import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { GSC_OPERATOR_CODE } from "@/lib/gsc/config";
import { gscSign, verifySignature } from "@/lib/gsc/signature";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const requestTime = String(body.request_time || "");
    if (body.operator_code !== GSC_OPERATOR_CODE || !verifySignature(gscSign(requestTime, "deposit", GSC_OPERATOR_CODE), body.sign)) {
      return NextResponse.json({ data: [], code: 1004, message: "Invalid signature" });
    }
    const out: any[] = [];
    for (const batch of body.batch_requests || []) {
      const user = await db.user.findFirst({ where: { OR: [{ phone: batch.member_account }, { playerId: batch.member_account }] }, include: { wallet: true } });
      if (!user?.wallet) { out.push({ member_account: batch.member_account, product_code: batch.product_code, before_balance: 0, balance: 0, code: 1000, message: "Member does not exist" }); continue; }
      let before = Number(user.wallet.balance), after = before;
      for (const tx of batch.transactions || []) {
        const txId = String(tx.id || tx.wager_code || `${batch.member_account}:${requestTime}`);
        const amount = new Prisma.Decimal(String(tx.amount ?? 0));
        const signedAmount = amount;
        try {
          const result = await db.$transaction(async (t) => {
            const exists = await t.gscWalletTransaction.findUnique({ where: { providerTransactionId: txId } });
            const wallet = await t.wallet.findUnique({ where: { userId: user.id } });
            if (!wallet) throw new Error("WALLET_NOT_FOUND");
            if (exists) return { duplicate: true, before: exists.beforeBalance, after: exists.afterBalance };
            const b = wallet.balance;
            if (signedAmount.lt(0)) {
              const updated = await t.wallet.updateMany({ where: { userId: user.id, balance: { gte: signedAmount.abs() } }, data: { balance: { decrement: signedAmount.abs() } } });
              if (updated.count !== 1) throw new Error("INSUFFICIENT_BALANCE");
            } else {
              await t.wallet.update({ where: { userId: user.id }, data: { balance: { increment: signedAmount } } });
            }
            const a = b.plus(signedAmount);
            await t.gscWalletTransaction.create({ data: { providerTransactionId: txId, userId: user.id, memberAccount: user.phone, action: String(tx.action || "DEPOSIT"), amount: signedAmount, currency: String(body.currency || user.wallet?.currency || "BDT"), productCode: batch.product_code, gameType: batch.game_type, gameCode: tx.game_code, wagerCode: tx.wager_code, roundId: tx.round_id, beforeBalance: b, afterBalance: a, payload: tx } });
            return { duplicate: false, before: b, after: a };
          });
          before = Number(result.before); after = Number(result.after);
          if (result.duplicate) { out.push({ member_account: batch.member_account, product_code: batch.product_code, before_balance: before, balance: after, code: 1003, message: "Duplicate transaction" }); continue; }
        } catch (err: any) {
          out.push({ member_account: batch.member_account, product_code: batch.product_code, before_balance: before, balance: before, code: err.message === "INSUFFICIENT_BALANCE" ? 1001 : 999, message: err.message });
          continue;
        }
      }
      out.push({ member_account: batch.member_account, product_code: batch.product_code, before_balance: before, balance: after, code: 0, message: "" });
    }
    return NextResponse.json({ data: out });
  } catch (e: any) {
    return NextResponse.json({ data: [], code: 999, message: e.message }, { status: 200 });
  }
}
