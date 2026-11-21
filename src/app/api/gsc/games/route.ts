
import { NextRequest, NextResponse } from "next/server";
import { gscRequest } from "@/lib/gsc/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GscGamesResponse = {
  code?: number;
  message?: string;
  data?: unknown;
  games?: unknown;
  [key: string]: unknown;
};

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;

    // Documentation/example code; confirm it is enabled for your account.
    const productCode = params.get("product_code") || "1138";

    if (!/^\d+$/.test(productCode) || Number(productCode) <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid product_code" },
        { status: 400 },
      );
    }

    const query: Record<string, string | number | undefined> = {
      product_code: Number(productCode),
      game_type: params.get("game_type") || undefined,
      offset: params.get("offset") || "0",
      size: params.get("size") || "100",
    };

    const data = await gscRequest<GscGamesResponse>(
      "/api/operators/provider-games",
      {
        method: "GET",
        action: "gamelist",
        query,
      },
    );

    return NextResponse.json({
      ...data,
      success:
        data.code === undefined ||
        data.code === 0 ||
        data.code === 200,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to fetch GSC+ games";

    return NextResponse.json(
      { success: false, error: message },
      { status: 502 },
    );
  }
}
