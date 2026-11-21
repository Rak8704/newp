
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { formatBDT } from "@/lib/utils";
import React, { useEffect, useState } from "react";

import facebook from "@/../public/icons/social-media/facebook.png";
import telegram from "@/../public/icons/social-media/telegram.png";
import whatsapp from "@/../public/icons/social-media/whatsapp.png";

import reward_1 from "@/../public/icons/rewards/reward-1.png";
import reward_2 from "@/../public/icons/rewards/reward-2.png";
import reward_3 from "@/../public/icons/rewards/reward-3.png";
import reward_4 from "@/../public/icons/rewards/reward-4.png";

import Image from "next/image";

import { FaLink, FaCopy } from "react-icons/fa6";
import { StatisticType } from "@/types/api/reward";
import useCurrentUser from "@/hook/useCurrentUser";

interface OverviewProps {
  statictic: StatisticType;
}

const Overview = ({ statictic }: OverviewProps) => {
  const user: any = useCurrentUser();

  const {
    registersCount,
    todayIncome,
    validReferral,
    totalIncome,
  } = statictic;

  return (
    <div className="space-y-5">

      <Statictic
        registersCount={registersCount}
        todayIncome={todayIncome}
        validReferral={validReferral}
        totalIncome={totalIncome}
      />

      <InviteLink invitationCode={user?.referId || ""} />

      <ReleasedReward />

    </div>
  );
};

export default Overview;

/* =========================
   STATISTICS
========================= */

const Statictic = ({
  registersCount,
  todayIncome,
  validReferral,
  totalIncome,
}: StatisticType) => {
  const statistics = [
    {
      title: "Today's Income",
      value: formatBDT(todayIncome),
    },
    {
      title: "Total Income",
      value: formatBDT(totalIncome),
    },
    {
      title: "Registers",
      value: registersCount,
    },
    {
      title: "Valid Referral",
      value: validReferral,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">

      {statistics.map((item, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-xl border border-[#62218b] bg-gradient-to-br from-[#351052] via-[#200638] to-[#100525] p-3 shadow-[0_4px_15px_rgba(112,38,156,0.15)]"
        >
          <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#c026d3]/10 blur-2xl" />

          <span className="relative block text-center text-xs font-semibold text-[#d9b5f5] sm:text-sm">
            {item.title}
          </span>

          <span className="relative mt-2 block break-words text-center text-xl font-extrabold text-[#f0abfc] sm:text-2xl">
            {item.value}
          </span>

          <div className="mx-auto mt-2 h-[2px] w-10 rounded-full bg-gradient-to-r from-[#70269c] to-[#e879f9]" />
        </div>
      ))}

    </div>
  );
};

/* =========================
   INVITATION LINK
========================= */

const InviteLink = ({
  invitationCode,
}: {
  invitationCode: string;
}) => {
  const [domain, setDomain] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDomain(window.location.origin);
  }, []);

  const invitationLink = `${domain}/register?r=${invitationCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(invitationLink);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const shareText = encodeURIComponent(
    `Join me using my invitation link: ${invitationLink}`
  );

  const encodedLink = encodeURIComponent(invitationLink);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#70269c] bg-gradient-to-br from-[#26083f] via-[#150329] to-[#080014] p-4 shadow-[0_4px_20px_rgba(112,38,156,0.15)]">

      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#c026d3]/10 blur-3xl" />

      <h3 className="relative text-center text-xl font-bold text-[#f0abfc]">
        Share to your friends
      </h3>

      <p className="relative mt-2 text-center text-xs text-[#c4a5d8]">
        Invite your friends and earn rewards
      </p>

      {/* Social Media */}
      <div className="relative mt-5 flex items-center justify-center gap-5">

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          className="rounded-full border border-[#62218b] bg-[#200638] p-2 transition hover:scale-110 hover:border-[#d946ef]"
        >
          <Image
            src={facebook}
            alt="Facebook"
            className="h-9 w-9 object-contain"
          />
        </a>

        <a
          href={`https://wa.me/?text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
          className="rounded-full border border-[#62218b] bg-[#200638] p-2 transition hover:scale-110 hover:border-[#d946ef]"
        >
          <Image
            src={whatsapp}
            alt="WhatsApp"
            className="h-9 w-9 object-contain"
          />
        </a>

        <a
          href={`https://t.me/share/url?url=${encodedLink}&text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Telegram"
          className="rounded-full border border-[#62218b] bg-[#200638] p-2 transition hover:scale-110 hover:border-[#d946ef]"
        >
          <Image
            src={telegram}
            alt="Telegram"
            className="h-9 w-9 object-contain"
          />
        </a>

      </div>

      {/* Invitation Link */}
      <div className="relative mt-5 rounded-xl border border-[#62218b] bg-[#080014] p-2">

        <div className="flex min-w-0 items-center gap-2">

          <FaLink className="h-5 w-5 shrink-0 text-[#e879f9]" />

          <span className="min-w-0 flex-1 truncate text-xs text-[#d9b5f5]">
            {invitationLink}
          </span>

          <button
            type="button"
            onClick={handleCopy}
            disabled={!invitationCode || !domain}
            className="flex shrink-0 items-center gap-2 rounded-lg border border-[#e879f9] bg-gradient-to-b from-[#c026d3] to-[#70269c] px-3 py-2 text-xs font-bold text-white shadow-[0_2px_0_#351052] transition hover:brightness-125 active:translate-y-[1px] disabled:opacity-50"
          >
            <FaCopy />
            {copied ? "Copied!" : "Copy"}
          </button>

        </div>

      </div>

    </div>
  );
};

/* =========================
   RELEASED REWARDS
========================= */

const ReleasedReward = () => {
  const rewards = [
    {
      sticker: reward_1,
      label: "Invitation Rewards",
      prize: "21,257,956.00",
      claimed: "67620",
    },
    {
      sticker: reward_2,
      label: "Achievement Rewards",
      prize: "457,250.00",
      claimed: "9126",
    },
    {
      sticker: reward_3,
      label: "Deposit Rebate",
      prize: "21,257,956.00",
      claimed: "71525",
    },
    {
      sticker: reward_4,
      label: "Betting Rebate",
      prize: "21,190,073.52",
      claimed: "78159",
    },
  ];

  return (
    <div className="py-3">

      <div className="mb-5 text-center">
        <h3 className="text-2xl font-extrabold text-[#f0abfc] sm:text-3xl">
          Rewards Released to Date
        </h3>

        <p className="mt-2 text-xs text-[#a78abf]">
          Explore the rewards available in our platform
        </p>

        <div className="mx-auto mt-3 h-[3px] w-16 rounded-full bg-gradient-to-r from-[#70269c] to-[#e879f9]" />
      </div>

      <div className="space-y-3">

        {rewards.map((reward, index) => (
          <div
            className="group flex items-center gap-3 overflow-hidden rounded-xl border border-[#62218b] bg-gradient-to-r from-[#200638] to-[#100525] p-3 shadow-[0_3px_12px_rgba(112,38,156,0.12)] transition hover:border-[#d946ef] hover:shadow-[0_0_15px_rgba(217,70,239,0.12)]"
            key={index}
          >

            <div className="flex w-[28%] shrink-0 items-center justify-center">

              <div className="flex h-[75px] w-[75px] items-center justify-center rounded-2xl border border-[#70269c] bg-gradient-to-br from-[#351052] to-[#150329] p-2 transition group-hover:scale-105">
                <Image
                  src={reward.sticker}
                  alt={reward.label}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

            </div>

            <div className="min-w-0 flex-1">

              <h5 className="text-sm font-bold text-[#e8c8ff] sm:text-base">
                {reward.label}
              </h5>

              <h4 className="mt-1 break-words text-xl font-extrabold text-[#e879f9] sm:text-2xl">
                ৳ {reward.prize}
              </h4>

              <span className="mt-1 block text-xs font-medium text-[#a78abf]">
                {reward.claimed} Claimed
              </span>

            </div>

            <div className="h-12 w-[3px] shrink-0 rounded-full bg-gradient-to-b from-[#e879f9] to-[#70269c]" />

          </div>
        ))}

      </div>

    </div>
  );
};
