import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const paymentWallets = await db.paymentWallet.findMany({
      include: {
        depositWallets: true,
      },
      orderBy: {
        walletName: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      paymentWallets,
      count: paymentWallets.length,
    });
  } catch (error) {
    console.error("Error fetching payment wallets:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch payment wallets",
      },
      { status: 500 }
    );
  }
}