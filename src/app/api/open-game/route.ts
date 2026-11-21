
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  assertGscConfig,
  GSC_BASE_URL,
  GSC_CURRENCY,
  GSC_LANGUAGE_CODE,
  GSC_LOBBY_URL,
  GSC_OPERATOR_CODE,
} from "@/lib/gsc/config";
import { gscLaunchSign } from "@/lib/gsc/signature";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    assertGscConfig();

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();

    const gameCode = body.gameCode ?? body.game_code ?? undefined;
    const productCode = Number(body.productCode ?? body.product_code);
    const gameType = String(body.gameType ?? body.game_type ?? "").trim();

    if (!Number.isInteger(productCode) || productCode <= 0 || !gameType) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid productCode and gameType are required",
        },
        { status: 400 },
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, phone: true, name: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    if (!user.phone) {
      return NextResponse.json(
        {
          success: false,
          error: "A phone number is required for the GSC+ member account",
        },
        { status: 400 },
      );
    }

    if (!GSC_LOBBY_URL) {
      return NextResponse.json(
        { success: false, error: "GSC_LOBBY_URL is not configured" },
        { status: 500 },
      );
    }

    const requestTime = Math.floor(Date.now() / 1000);
    const forwardedFor = req.headers.get("x-forwarded-for");
    const clientIp =
      forwardedFor?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const payload = {
      operator_code: GSC_OPERATOR_CODE,
      request_time: requestTime,
      sign: gscLaunchSign(requestTime),
      member_account: user.phone,
      password:
        process.env.GSC_LAUNCH_PASSWORD_MODE === "fixed"
          ? process.env.GSC_LAUNCH_PASSWORD || ""
          : user.phone,
      nickname: user.name || user.phone,
      currency: body.currency || GSC_CURRENCY,
      product_code: productCode,
      game_type: gameType,
      language_code: String(body.languageCode ?? GSC_LANGUAGE_CODE),
      ip: clientIp,
      platform: body.platform || "WEB",
      operator_lobby_url: GSC_LOBBY_URL,
      ...(gameCode ? { game_code: String(gameCode) } : {}),
    };

    const response = await fetch(
      `${GSC_BASE_URL}/api/operators/launch-game`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      },
    );

    const raw = await response.text();

    let data: Record<string, unknown>;

    try {
      data = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "GSC+ returned an invalid response",
          httpStatus: response.status,
        },
        { status: 502 },
      );
    }

    const code = data.code;
    const providerSuccess =
      response.ok && (code === undefined || code === 0 || code === 200);

    return NextResponse.json(
      {
        ...data,
        success: providerSuccess,
      },
      { status: response.ok ? 200 : 502 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Game launch failed";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
