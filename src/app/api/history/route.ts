 

import { db } from "@/lib/db";
import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { paymentSystemsLogos } from "@/data/paymentWallet";

type TransactionType = "deposit" | "withdraw";

interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  created_at: number;
  currency: string;
  order_id: string;
  payment_system: string;
  status: string;
  success: boolean;
  image?: string;
  label?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(
      1,
      Number.parseInt(searchParams.get("page") || "1", 10) || 1
    );

    const limit = Math.min(
      100,
      Math.max(
        1,
        Number.parseInt(searchParams.get("limit") || "10", 10) || 10
      )
    );

    const type = searchParams.get("type") || "all";
    const status = searchParams.get("status") || "all";

    if (!["all", "deposit", "withdraw"].includes(type)) {
      return Response.json(
        { message: "Invalid transaction type" },
        { status: 400 }
      );
    }

    const user = await findCurrentUser();

    if (!user) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const includeDeposits = type === "all" || type === "deposit";
    const includeWithdrawals = type === "all" || type === "withdraw";

    const [
      dbDeposits,
      dbWithdrawals,
      depositCount,
      withdrawCount,
    ] = await Promise.all([
      includeDeposits
        ? db.durantoPayDeposit.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
          })
        : Promise.resolve([]),

      includeWithdrawals
        ? db.durantoPayWithdraw.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
          })
        : Promise.resolve([]),

      includeDeposits
        ? db.durantoPayDeposit.count({
            where: { userId: user.id },
          })
        : Promise.resolve(0),

      includeWithdrawals
        ? db.durantoPayWithdraw.count({
            where: { userId: user.id },
          })
        : Promise.resolve(0),
    ]);

    const deposits: Transaction[] = dbDeposits.map((deposit) => ({
      id: deposit.id,
      userId: deposit.userId,
      type: "deposit",
      amount: Number(deposit.amount),
      created_at: Math.floor(deposit.createdAt.getTime() / 1000),
      currency: "BDT",
      order_id: deposit.invoice_no,
      payment_system: deposit.paymentType,
      status: deposit.status,
      success: [
        "success",
        "successful",
        "approved",
        "completed",
      ].includes(deposit.status.toLowerCase()),
    }));

    const withdrawals: Transaction[] = dbWithdrawals.map((withdrawal) => ({
      id: withdrawal.id,
      userId: withdrawal.userId,
      type: "withdraw",
      amount: Number(withdrawal.amount),
      created_at: Math.floor(withdrawal.createdAt.getTime() / 1000),
      currency: "BDT",
      order_id: withdrawal.invoice_no,
      payment_system: withdrawal.pay_type,
      status: withdrawal.status,
      success: [
        "success",
        "successful",
        "approved",
        "completed",
      ].includes(withdrawal.status.toLowerCase()),
    }));

    const addPaymentSystemInfo = (
      transaction: Transaction
    ): Transaction => {
      const paymentSystem = paymentSystemsLogos.find(
        (system) =>
          system.name.toLowerCase() ===
          transaction.payment_system.toLowerCase()
      );

      return {
        ...transaction,
        image: paymentSystem?.image,
        label: paymentSystem?.label,
      };
    };

    let transactions: Transaction[] = [
      ...deposits,
      ...withdrawals,
    ]
      .map(addPaymentSystemInfo)
      .sort((a, b) => b.created_at - a.created_at);

    if (status !== "all") {
      transactions = transactions.filter(
        (transaction) =>
          transaction.status.toLowerCase() === status.toLowerCase()
      );
    }

    const total =
      type === "deposit"
        ? depositCount
        : type === "withdraw"
          ? withdrawCount
          : depositCount + withdrawCount;

    // Pagination after combining and filtering both transaction types.
    transactions = transactions.slice(
      (page - 1) * limit,
      page * limit
    );

    return Response.json(
      {
        data: transactions,
        pagination: {
          page,
          limit,
          total:
            status === "all"
              ? total
              : transactions.length +
                // See note below: filtered totals need their own count.
                0,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[TRANSACTION_HISTORY_ERROR]", error);

    return Response.json(
      { message: INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}