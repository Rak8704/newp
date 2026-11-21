"use server";
import zod from "zod";
import { registerSchema } from "@/schema";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { findUserByPhone, findUserByReferId } from "@/data/user";
import { referIdGenerate } from "@/lib/helpers";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signIn } from "@/auth";
import { LOGIN_SUCCESS } from "@/success";
import { playerIdGenerate } from "@/lib/helpers";

export const register = async (data: zod.infer<typeof registerSchema>) => {
  try {
    const { password, confirmPassword, phone, ageCheck, bonusCheck, referralId } = data;

    // ---------------- Validations ----------------
    if (password !== confirmPassword) return { error: "Confirm Password did not match" };
    if (!ageCheck) return { error: "Read Out age Restrictions" };

    const existingUser = await findUserByPhone(phone);
    if (existingUser) return { error: "Number is already registered" };

    // ---------------- Referral Setup ----------------
    let invitedBy = {};
    let isReferralBonusActive = false;

    const referralUser = referralId ? await findUserByReferId(referralId) : null;
    if (referralUser) {
      await db.invitationBonus.update({
        where: { userId: referralUser.id },
        data: { totalRegisters: { increment: 1 } },
      });

      isReferralBonusActive = true;
      invitedBy = {
        create: { user: { connect: { id: referralUser.id } } },
      };
    }

    // ---------------- Hash Password + Generate referId ----------------
    const hashedPassword = await bcrypt.hash(password, 10);
    const referId = await referIdGenerate();

    // ---------------- Create local player + user wallet ----------------
    const localPlayerId = await playerIdGenerate();
    const newPlayer = await db.player.create({
      data: {
        playerId: localPlayerId,
        name: `Guest ${Date.now()}`,
        email: `${phone}@tk1111.com`,
        currency: process.env.GSC_CURRENCY || "BDT",
        status: "ACTIVE",
      },
    });

    const newUser = await db.user.create({
      data: {
        phone,
        email: `${phone}@tk1111.com`,
        password: hashedPassword,
        playerId: newPlayer.playerId,
        referId,
        isBanned: false,
        invitedBy,
        bettingRecord: { create: {} },
        wallet: {
          create: {
            balance: 0,
            signinBonus: bonusCheck,
            referralBonus: isReferralBonusActive,
            currency: "BDT",
            playerId: newPlayer.id,
          },
        },
        inviationBonus: { create: {} },
      },
    });

    // ---------------- Update Referral ----------------
    if (referralUser) {
      await db.invitation.update({
        where: { userId: referralUser.id },
        data: { referredUsers: { connect: { id: newUser.id } } },
      });
    }

    // ---------------- Auto Sign In ----------------
    try {
      await signIn("credentials", {
        phone: newUser.phone,
        password,
        redirect: false,
      });
    } catch (error) {
      console.error("SignIn Error:", error);
    }

    return { success: LOGIN_SUCCESS };
  } catch (error) {
    console.error("Register Error:", error);
    return { error: INTERNAL_SERVER_ERROR };
  }
};
