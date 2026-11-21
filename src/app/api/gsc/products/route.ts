
import { NextRequest, NextResponse } from "next/server";
import { gscRequest } from "@/lib/gsc/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GscProductsResponse = {
  code?: number;
  message?: string;
  data?: unknown;
  products?: unknown;
  [key: string]: unknown;
};

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;

    const offset = params.get("offset") ?? "0";
    const size = params.get("size") ?? "100";

    const data = await gscRequest<GscProductsResponse>(
      "/api/operators/available-products",
      {
        method: "GET",
        action: "gamelist",
        query: { offset, size },
      },
    );

    if (data.code !== undefined && data.code !== 0) {
      return NextResponse.json(
        {
          success: false,
          gscCode: data.code,
          message: data.message ?? "GSC+ API error",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to fetch GSC+ products";

    return NextResponse.json(
      { success: false, error: message },
      { status: 502 },
    );
  }
}
