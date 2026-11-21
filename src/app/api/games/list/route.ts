
import { NextRequest, NextResponse } from "next/server";
import { gscRequest } from "@/lib/gsc/client";
import { Categories, Title } from "@/types/game";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;

type GscResponse = Row & {
  code?: number;
  message?: string;
  success?: boolean;
};

function isRow(value: unknown): value is Row {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Supports arrays nested inside common GSC+ response wrappers.
function getArray(value: unknown, depth = 0): Row[] {
  if (depth > 5 || value == null) return [];

  if (Array.isArray(value)) {
    return value.filter(isRow);
  }

  if (!isRow(value)) return [];

  const keys = [
    "provider_games",
    "products",
    "available_products",
    "games",
    "items",
    "list",
    "records",
    "result",
    "data",
  ];

  for (const key of keys) {
    const nested = value[key];

    if (Array.isArray(nested)) {
      return nested.filter(isRow);
    }

    if (isRow(nested)) {
      const rows = getArray(nested, depth + 1);
      if (rows.length) return rows;
    }
  }

  return [];
}

function isActive(row: Row): boolean {
  const status = row.status;

  if (status == null || status === "") return true;

  return ["ACTIVE", "ACTIVATED", "1"].includes(
    String(status).toUpperCase(),
  );
}

function mapCategory(gameType: unknown): Categories {
  const type = String(gameType ?? "").toLowerCase();

  if (type.includes("live")) return Categories.LiveDealers;
  if (type.includes("sport")) return Categories.Sport;
  if (type.includes("fish")) return Categories.Fish;
  if (type.includes("roulette")) return Categories.Roulette;
  if (type.includes("lottery")) return Categories.Lottery;
  if (type.includes("arcade")) return Categories.Arcade;
  if (type.includes("card")) return Categories.Card;
  if (type.includes("poker")) return Categories.VideoPoker;
  if (type.includes("fast")) return Categories.FastGames;

  // GSC+ sample games use game_type "OTHER".
  // Use Slots as the fallback for the slots listing.
  return Categories.Slots;
}

export async function POST(req: NextRequest) {
  try {
    let body: Row = {};

    try {
      const parsed: unknown = await req.json();
      if (isRow(parsed)) body = parsed;
    } catch {
      // An empty body is allowed.
    }

    const search = String(body.search ?? "").trim().toLowerCase();
    const requestedType = String(body.game_type ?? "all")
      .trim()
      .toLowerCase();

    // 1. Fetch available products.
    const productResponse = await gscRequest<GscResponse>(
      "/api/operators/available-products",
      {
        method: "GET",
        action: "productlist",
        query: { offset: 0, size: 100 },
      },
    );

    if (
      productResponse.code !== undefined &&
      ![0, 200].includes(Number(productResponse.code))
    ) {
      throw new Error(
        `GSC+ product list error: ${
          productResponse.message ?? productResponse.code
        }`,
      );
    }

    const products = getArray(productResponse).filter(isActive);

    if (!products.length) {
      console.error(
        "[GSC+ games list] No products parsed. Response keys:",
        Object.keys(productResponse),
      );

      return NextResponse.json({
        success: true,
        gamesList: { [requestedType || "all"]: [] },
        games: [],
        total: 0,
        message: "No products found in GSC+ product-list response",
        productResponseKeys: Object.keys(productResponse),
      });
    }

    // 2. Fetch games for each active product.
    const games: Row[] = [];
    const warnings: string[] = [];
    const batchSize = 5;

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);

      const results = await Promise.all(
        batch.map(async (product) => {
          const productCode = String(product.product_code ?? "");

          if (!/^\d+$/.test(productCode)) {
            return {
              games: [] as Row[],
              warning: `Invalid product_code: ${productCode || "missing"}`,
            };
          }

          try {
            const response = await gscRequest<GscResponse>(
              "/api/operators/provider-games",
              {
                method: "GET",
                action: "gamelist",
                query: {
                  product_code: Number(productCode),
                  offset: 0,
                  size: 200,
                },
              },
            );

            if (
              response.code !== undefined &&
              ![0, 200].includes(Number(response.code))
            ) {
              throw new Error(
                String(response.message ?? response.code),
              );
            }

            const providerGames = getArray(response);

            const mapped = providerGames
              .filter((game) => {
                const status = game.status;

                if (
                  status != null &&
                  !["ACTIVE", "ACTIVATED", "1"].includes(
                    String(status).toUpperCase(),
                  )
                ) {
                  return false;
                }

                const name = String(
                  game.game_name ?? game.name ?? game.game_code ?? "",
                ).toLowerCase();

                if (search && !name.includes(search)) return false;

                const category = mapCategory(
                  game.game_type ?? product.game_type,
                );

                if (
                  requestedType !== "all" &&
                  requestedType !== category.toLowerCase() &&
                  requestedType !== String(game.game_type ?? "").toLowerCase()
                ) {
                  return false;
                }

                return true;
              })
              .map((game) => {
                const gameCode = String(game.game_code ?? "");
                const gameName = String(
                  game.game_name ?? game.name ?? gameCode,
                );
                const imageUrl = String(
                  game.image_url ?? game.img ?? "",
                );

                return {
                  ...game,

                  // Fields expected by the existing frontend.
                  id: gameCode,
                  name: gameName,
                  img: imageUrl,

                  // Keep original GSC+ fields too.
                  game_code: gameCode,
                  game_name: gameName,
                  image_url: imageUrl,
                  product_code: productCode,

                  provider: String(
                    game.provider ??
                      product.provider ??
                      product.product_name ??
                      "GSC+",
                  ),

                  title: Title.GSCPlus,
                  categories: mapCategory(
                    game.game_type ?? product.game_type,
                  ),

                  device: "all",
                  bm: "",
                  demo: "",
                  rewriterule: "0",
                  exitButton: "1",
                };
              });

            return { games: mapped, warning: null };
          } catch (error) {
            const message =
              error instanceof Error ? error.message : String(error);

            console.error(
              `[GSC+ games] product_code=${productCode}:`,
              message,
            );

            return {
              games: [] as Row[],
              warning: `Product ${productCode}: ${message}`,
            };
          }
        }),
      );

      for (const result of results) {
        games.push(...result.games);
        if (result.warning) warnings.push(result.warning);
      }
    }

    return NextResponse.json(
      {
        success: true,
        gamesList: { [requestedType || "all"]: games },
        games,
        total: games.length,
        productsFound: products.length,
        failedProducts: warnings.length,
        ...(warnings.length ? { warnings: warnings.slice(0, 10) } : {}),
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    console.error("[GSC+ games list]", message);

    return NextResponse.json(
      { success: false, error: message, games: [], total: 0 },
      { status: 502 },
    );
  }
}
