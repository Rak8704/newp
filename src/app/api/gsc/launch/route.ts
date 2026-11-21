
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

type GscLaunchResponse = {
  code?: number;
  message?: string;
  success?: boolean;
  launch_url?: string;
  launchUrl?: string;
  game_url?: string;
  url?: string;
  data?: {
    launch_url?: string;
    launchUrl?: string;
    game_url?: string;
    url?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export async function POST(req: NextRequest) {
  try {
    // 1. Validate GSC configuration
    assertGscConfig();

    // 2. Validate logged-in user
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 3. Read request body
    let body: Record<string, unknown>;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    // 4. Validate game information
    const productCode = Number(
      body.productCode ?? body.product_code
    );

    const gameCode = String(
      body.gameCode ?? body.game_code ?? ""
    ).trim();

    const gameType = String(
      body.gameType ?? body.game_type ?? ""
    ).trim();

    if (
      !Number.isSafeInteger(productCode) ||
      productCode <= 0 ||
      !gameCode ||
      !gameType
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Valid productCode, gameCode and gameType are required",
        },
        { status: 400 }
      );
    }

    // 5. Get user from database
    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        phone: true,
        name: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.phone?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A phone number is required for the GSC+ member account",
        },
        { status: 400 }
      );
    }

    if (!GSC_LOBBY_URL) {
      return NextResponse.json(
        {
          success: false,
          error: "GSC_LOBBY_URL is not configured",
        },
        { status: 500 }
      );
    }

    // 6. Prepare GSC request
    const requestTime = Math.floor(Date.now() / 1000);

    // Only trust forwarded IP headers when set by your reverse proxy.
    const forwardedFor = req.headers.get("x-forwarded-for");

    const clientIp =
      forwardedFor?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip")?.trim() ||
      "127.0.0.1";

    const password =
      process.env.GSC_LAUNCH_PASSWORD_MODE === "fixed"
        ? process.env.GSC_LAUNCH_PASSWORD
        : user.phone.trim();

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          error: "GSC launch password is not configured",
        },
        { status: 500 }
      );
    }

    const payload = {
      operator_code: GSC_OPERATOR_CODE,
      request_time: requestTime,
      sign: gscLaunchSign(requestTime),
      member_account: user.phone.trim(),
      password,
      nickname: user.name || user.phone,
      currency: GSC_CURRENCY,
      product_code: productCode,
      game_code: gameCode,
      game_type: gameType,
      language_code: GSC_LANGUAGE_CODE,
      ip: clientIp,
      platform: "WEB",
      operator_lobby_url: GSC_LOBBY_URL,
    };

    // 7. Send launch request to GSC+
    const endpoint = `${GSC_BASE_URL}/api/operators/launch-game`;

    console.log("========== GSC LAUNCH REQUEST ==========");
    console.log("ENDPOINT:", endpoint);
    console.log("REQUEST DATA:", {
      operator_code: payload.operator_code,
      member_account: payload.member_account,
      product_code: payload.product_code,
      game_code: payload.game_code,
      game_type: payload.game_type,
      currency: payload.currency,
      platform: payload.platform,
      request_time: payload.request_time,
      ip: payload.ip,
    });
    console.log("========================================");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });

    // 8. Read provider response
    const raw = await response.text();

    console.log("========== GSC LAUNCH RESPONSE ==========");
    console.log("HTTP STATUS:", response.status);
    console.log("GSC RAW RESPONSE:", raw);
    console.log("=========================================");

    let result: GscLaunchResponse;

    try {
      result = JSON.parse(raw) as GscLaunchResponse;
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "GSC+ returned an invalid response",
          httpStatus: response.status,
        },
        { status: 502 }
      );
    }

    // 9. Check provider success
    const providerSuccess =
      response.ok &&
      (result.code === 0 || result.code === 200);

    if (!providerSuccess) {
      return NextResponse.json(
        {
          success: false,
          error: result.message || "GSC+ game launch failed",
          code: result.code ?? null,
          httpStatus: response.status,
        },
        { status: 502 }
      );
    }

    // 10. Extract launch URL
    const launchUrl =
      result.launch_url ??
      result.launchUrl ??
      result.game_url ??
      result.url ??
      result.data?.launch_url ??
      result.data?.launchUrl ??
      result.data?.game_url ??
      result.data?.url;

    // 11. Validate launch URL
    if (
      typeof launchUrl !== "string" ||
      !/^https?:\/\//i.test(launchUrl)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "GSC+ accepted the request but did not return a valid launch URL",
          code: result.code ?? null,
        },
        { status: 502 }
      );
    }

    // 12. Return launch URL to frontend
    return NextResponse.json({
      success: true,
      launch_url: launchUrl,
    });
  } catch (error) {
    const isTimeout =
      error instanceof Error &&
      error.name === "TimeoutError";

    const message =
      error instanceof Error
        ? error.message
        : "Game launch failed";

    console.error("========== GSC LAUNCH ERROR ==========");
    console.error("ERROR:", message);
    console.error("=======================================");

    return NextResponse.json(
      {
        success: false,
        error: isTimeout
          ? "GSC+ launch request timed out"
          : message,
      },
      {
        status: isTimeout ? 504 : 500,
      }
    );
  }
}
