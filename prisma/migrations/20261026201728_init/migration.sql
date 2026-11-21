-- AddForeignKey
ALTER TABLE "public"."DepositWallet" ADD CONSTRAINT "DepositWallet_paymentWalletId_fkey" FOREIGN KEY ("paymentWalletId") REFERENCES "public"."PaymentWallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
