import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { GSC_OPERATOR_CODE, GSC_CURRENCY } from "@/lib/gsc/config";
import { gscSign, verifySignature } from "@/lib/gsc/signature";

export const GSC_SUCCESS=0, GSC_DUPLICATE=1003, GSC_MEMBER_NOT_FOUND=1000, GSC_INSUFFICIENT=1001, GSC_INVALID_SIGNATURE=1004;
const dec=(v:any)=>new Prisma.Decimal(String(v ?? 0));

export async function parseAndVerify(req:NextRequest){
  const body=await req.json();
  const requestTime=String(body.request_time ?? "");
  if(!requestTime || body.operator_code!==GSC_OPERATOR_CODE || !verifySignature(gscSign(requestTime, body._action, GSC_OPERATOR_CODE), body.sign)) return {ok:false,body:null,response:NextResponse.json({code:GSC_INVALID_SIGNATURE,message:"Invalid signature"},{status:200})};
  return {ok:true,body};
}

export async function findUser(memberAccount:string){
  return db.user.findFirst({where:{OR:[{phone:memberAccount},{playerId:memberAccount}]},select:{id:true,phone:true,name:true,wallet:{select:{balance:true,currency:true}}}});
}

export async function mutateWallet(args:{userId:string; txId:string; action:string; amount:Prisma.Decimal; currency:string; productCode?:number; gameType?:string; gameCode?:string; wagerCode?:string; roundId?:string; payload?:unknown;}){
  return db.$transaction(async tx=>{
    const existing=await tx.gscWalletTransaction.findUnique({where:{providerTransactionId:args.txId}});
    const wallet=await tx.wallet.findUnique({where:{userId:args.userId}});
    if(!wallet) throw new Error("Wallet not found");
    if(existing) return {duplicate:true,before:existing.beforeBalance,after:existing.afterBalance};
    const before=wallet.balance;
    let after:Prisma.Decimal;
    if(args.amount.lt(0)){
      const updated=await tx.wallet.updateMany({where:{userId:args.userId,balance:{gte:args.amount.abs()}},data:{balance:{decrement:args.amount.abs()}}});
      if(updated.count!==1) throw new Error("INSUFFICIENT_BALANCE");
      after=before.minus(args.amount.abs());
    } else {
      await tx.wallet.update({where:{userId:args.userId},data:{balance:{increment:args.amount}}});
      after=before.plus(args.amount);
    }
    await tx.gscWalletTransaction.create({data:{providerTransactionId:args.txId,userId:args.userId,memberAccount:(await tx.user.findUniqueOrThrow({where:{id:args.userId},select:{phone:true}})).phone,action:args.action,amount:args.amount,currency:args.currency,productCode:args.productCode,gameType:args.gameType,gameCode:args.gameCode,wagerCode:args.wagerCode,roundId:args.roundId,beforeBalance:before,afterBalance:after,payload:args.payload as Prisma.InputJsonValue}});
    return {duplicate:false,before,after};
  });
}

export function walletData(memberAccount:string,productCode:number|undefined,result:any,code=GSC_SUCCESS,message=""){return {member_account:memberAccount,product_code:productCode??0,before_balance:Number(result.before),balance:Number(result.after),code,message};}
export { GSC_CURRENCY };
