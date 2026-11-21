
import { NextRequest, NextResponse } from "next/server";
import { gscRequest } from "@/lib/gsc/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const productCode = params.get("product_code");

    if (!productCode || !/^\d+$/.test(productCode)) {
      return NextResponse.json(
        {
          success: false,
          error: "A valid product_code is required",
        },
        { status: 400 }
      );
    }

    const gameType = params.get("game_type");
    const offset = params.get("offset");
    const size = params.get("size");

    const data = await gscRequest<{
      success?: boolean;
      provider_games?: unknown[];
      [key: string]: unknown;
    }>("/api/operators/provider-games", {
      action: "gamelist",
      query: {
        product_code: Number(productCode),
        game_type: gameType || undefined,
        offset: offset ? Number(offset) : undefined,
        size: size ? Number(size) : undefined,
      },
    });

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown GSC+ error";

    console.error("[GSC Games API]", message);

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 502 }
    );
  }
}
