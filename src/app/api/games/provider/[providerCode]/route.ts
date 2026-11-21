
import { NextRequest, NextResponse } from "next/server";
import { gscRequest } from "@/lib/gsc/client";

export const dynamic = "force-dynamic";

function normalize(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

// Extract array from GSC response
function findArray(response: any, keys: string[]): any[] {
  if (Array.isArray(response)) return response;

  if (!response || typeof response !== "object") {
    return [];
  }

  for (const key of keys) {
    if (Array.isArray(response[key])) {
      return response[key];
    }
  }

  if (response.data && typeof response.data === "object") {
    for (const key of keys) {
      if (Array.isArray(response.data[key])) {
        return response.data[key];
      }
    }
  }

  return [];
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ providerCode: string }> }
) {
  try {
    const { providerCode } = await params;

    const requestedProvider = normalize(providerCode);

    const searchParams = req.nextUrl.searchParams;

    const limit = Math.min(
      200,
      Math.max(
        1,
        Number.parseInt(searchParams.get("limit") ?? "200", 10) || 200
      )
    );

    const page = Math.max(
      1,
      Number.parseInt(searchParams.get("page") ?? "1", 10) || 1
    );

    const offset = Math.max(
      0,
      Number.parseInt(
        searchParams.get("offset") ?? String((page - 1) * limit),
        10
      ) || 0
    );

    // =========================================
    // STEP 1: GET GSC PRODUCTS
    // =========================================

    const productsResponse: any = await gscRequest<any>(
      "/api/operators/available-products",
      {
        action: "product list",
      }
    );

    console.log(
      "GSC RAW PRODUCT RESPONSE:",
      JSON.stringify(productsResponse).slice(0, 10000)
    );

    const allProducts = findArray(productsResponse, [
      "available_products",
      "products",
      "product_list",
      "productList",
      "provider_products",
      "providerProducts",
      "data",
    ]);

    console.log("GSC PRODUCTS COUNT:", allProducts.length);

    // =========================================
    // STEP 2: FILTER PROVIDER
    // =========================================

    const matchingProducts = allProducts.filter((product: any) => {
      const provider = normalize(product.provider);
      const status = String(product.status ?? "")
        .trim()
        .toUpperCase();

      return (
        provider === requestedProvider &&
        ["ACTIVE", "ACTIVATED"].includes(status)
      );
    });

    console.log("REQUESTED PROVIDER:", providerCode);
    console.log("MATCHING PRODUCTS:", matchingProducts.length);

    // =========================================
    // STEP 3: IF NO PRODUCT FOUND
    // =========================================

    if (allProducts.length === 0) {
      return NextResponse.json({
        success: false,
        debug: true,
        stage: "PRODUCT_LIST_PARSING",
        requestedProvider: providerCode,
        totalProducts: 0,
        matchingProducts: 0,
        rawResponseType: Array.isArray(productsResponse)
          ? "array"
          : typeof productsResponse,
        rawResponseKeys:
          productsResponse &&
          typeof productsResponse === "object"
            ? Object.keys(productsResponse)
            : [],
        rawResponse: productsResponse,
        message:
          "GSC+ Product List response did not contain a recognized product array",
      });
    }

    if (matchingProducts.length === 0) {
      return NextResponse.json({
        success: true,
        debug: true,
        stage: "PROVIDER_MATCHING",
        requestedProvider: providerCode,
        totalProducts: allProducts.length,
        matchingProducts: 0,
        availableProviders: [
          ...new Set(
            allProducts.map((p: any) => ({
              provider: p.provider,
              status: p.status,
            }))
          ),
        ],
        products: allProducts.map((p: any) => ({
          provider: p.provider,
          product_code: p.product_code,
          status: p.status,
          game_type: p.game_type,
        })),
        games: [],
        message: "No active products matched this provider",
      });
    }

    // =========================================
    // STEP 4: GET PROVIDER GAMES
    // =========================================

    const games: any[] = [];
    const gameResponses: any[] = [];

    for (const product of matchingProducts.slice(0, 20)) {
      const result: any = await gscRequest<any>(
        "/api/operators/provider-games",
        {
          action: "gamelist",
          query: {
            product_code: Number(product.product_code),
            game_type: product.game_type,
            offset,
            size: limit,
          },
        }
      );

      console.log(
        "GSC GAME RESPONSE:",
        JSON.stringify(result).slice(0, 5000)
      );

      const providerGames = findArray(result, [
        "provider_games",
        "games",
        "game_list",
        "gameList",
        "data",
      ]);

      gameResponses.push({
        product_code: product.product_code,
        game_type: product.game_type,
        responseKeys:
          result && typeof result === "object"
            ? Object.keys(result)
            : [],
        returnedGames: providerGames.length,
      });

      for (const game of providerGames) {
        games.push({
          ...game,
          provider: product.provider,
          product_code: product.product_code,
          game_type: product.game_type,
        });
      }
    }

    // =========================================
    // STEP 5: FINAL RESPONSE
    // =========================================

    return NextResponse.json({
      success: true,
      debug: true,
      requestedProvider: providerCode,
      totalProducts: allProducts.length,
      matchingProducts: matchingProducts.length,
      gameResponses,
      totalGames: games.length,
      games,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch GSC+ provider games";

    console.error("GSC PROVIDER API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: message,
        games: [],
      },
      { status: 502 }
    );
  }
}
