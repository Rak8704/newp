
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { UserAvatar } from "@/components/HeaderBalance";
import { PiHandDepositFill, PiHandWithdrawFill } from "react-icons/pi";
import { FiRefreshCw, FiDownload } from "react-icons/fi";
import { FaCopy, FaCreditCard, FaGift, FaChartLine, FaFileInvoiceDollar, FaCircleUser } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { LuNotebookText } from "react-icons/lu";
import { MdSecurity, MdOutlineSupportAgent } from "react-icons/md";
import { TiUserAdd } from "react-icons/ti";
import { GiFishMonster } from "react-icons/gi";
import Link from "next/link";
import { useFetchWalletQuery } from "@/lib/features/walletApiSlice";
import { getCurrencySymbol } from "@/lib/utils";
import useCurrentUser from "@/hook/useCurrentUser";
import { Skeleton } from "@/components/ui/skeleton";
import LogOutModal from "@/components/logout-modal";

const App: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  const user: any = useCurrentUser();

  const {
    data,
    isLoading: walletLoading,
    refetch,
    isFetching: walletRetching,
  } = useFetchWalletQuery();

  const balance = data?.payload
    ? Number(data.payload.balance)
    : 0;

  const handleCopyPlayerId = () => {
    if (!user?.playerId) return;

    navigator.clipboard.writeText(String(user.playerId));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefreshBalance = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);

    try {
      await refetch();
      setLastUpdateTime(new Date());
      setShowToast(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!showToast) return;

    const timer = setTimeout(() => {
      setShowToast(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showToast]);

  const menuItems = [
    {
      title: "রিওয়ার্ড",
      href: "/rewardCenter",
      icon: FaGift,
    },
    {
      title: "লাভ/ক্ষতি",
      href: "/profitandloss",
      icon: FaChartLine,
    },
    {
      title: "ডিপোজিট হিস্টোরি",
      href: "/history?type=deposit",
      icon: FaFileInvoiceDollar,
    },
    {
      title: "উইথড্র হিস্টোরি",
      href: "/history?type=withdraw",
      icon: LuNotebookText,
    },
    {
      title: "আমার অ্যাকাউন্ট",
      href: "/my-account",
      icon: FaCircleUser,
    },
    {
      title: "নিরাপত্তা কেন্দ্র",
      href: "/security",
      icon: MdSecurity,
    },
    {
      title: "বন্ধু আমন্ত্রণ",
      href: "/invite-friends",
      icon: TiUserAdd,
    },
    {
      title: "অ্যাপ ডাউনলোড",
      href: "#",
      icon: FiDownload,
    },
    {
      title: "কাস্টমার সাপোর্ট",
      href: "/support",
      icon: MdOutlineSupportAgent,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#020018] px-2 py-4 pb-20 text-[#e8c8ff] md:flex md:flex-col md:items-center md:px-4">

      <div className="w-full md:max-w-4xl">

        {/* টোস্ট নোটিফিকেশন */}
        <div
          className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-xl border border-[#a855f7] bg-gradient-to-r from-[#351052] to-[#70269c] px-4 py-3 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-opacity duration-300 ${
            showToast
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          <div className="text-sm font-semibold">
            ব্যালেন্স সফলভাবে আপডেট হয়েছে
          </div>
          <div className="mt-1 text-xs text-[#e8c8ff]" suppressHydrationWarning>
            {lastUpdateTime.toLocaleTimeString()}
          </div>
        </div>

        {/* প্রোফাইল সেকশন */}
        <div className="relative overflow-hidden rounded-[24px] border border-[#70269c] bg-gradient-to-br from-[#26083f] via-[#150329] to-[#080014] p-4 shadow-[0_5px_25px_rgba(112,38,156,0.2)] md:mt-4 md:p-6">

          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#a21caf]/15 blur-3xl" />

          <div className="relative flex items-center justify-between gap-3">

            <div className="flex min-w-0 items-center">
              <div className="shrink-0 rounded-full border-2 border-[#d946ef] p-1 shadow-[0_0_15px_rgba(217,70,239,0.3)]">
                <UserAvatar imageUrl="https://images.51939393.com//TCG_PROD_IMAGES/B2C/01_PROFILE/PROFILE/0.png" />
              </div>

              <div className="ml-3 min-w-0">
                <h2 className="truncate text-lg font-bold text-white md:text-xl">
                  {user?.name}
                </h2>

                <div className="mt-1 flex items-center gap-2">
                  <span className="truncate text-xs text-[#d9b5f5] md:text-sm">
                    প্লেয়ার আইডি: {user?.playerId}
                  </span>

                  <button
                    type="button"
                    onClick={handleCopyPlayerId}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#70269c] bg-[#351052] text-[#e8c8ff] transition hover:bg-[#70269c]"
                    title="প্লেয়ার আইডি কপি করুন"
                  >
                    <FaCopy size={12} />
                  </button>

                  {copied && (
                    <span className="text-xs font-semibold text-[#e879f9]">
                      কপি হয়েছে!
                    </span>
                  )}
                </div>
              </div>
            </div>

            <LogOutModal>
              <button
                type="button"
                aria-label="লগআউট"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#70269c] bg-[#351052] text-white transition hover:border-[#e879f9] hover:bg-[#70269c]"
              >
                <IoLogOut className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            </LogOutModal>
          </div>

          {/* ব্যালেন্স */}
          <div className="relative mt-5 rounded-2xl border border-[#62218b] bg-[#080014]/70 p-4">

            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#c084fc] md:text-sm">
                  ব্যবহারযোগ্য ব্যালেন্স
                </span>

                <div className="mt-1 flex items-center gap-2">
                  <span
                    className="text-2xl font-extrabold text-[#e879f9] md:text-3xl"
                    style={{
                      animation: isRefreshing
                        ? "none"
                        : "balancePulse 0.5s ease-out",
                    }}
                  >
                    {(walletLoading || walletRetching) && (
                      <Skeleton className="h-[30px] w-[100px] rounded-md bg-[#351052]" />
                    )}

                    {!walletLoading && !walletRetching && data && (
                      <>
                        {getCurrencySymbol("BDT")}
                        {balance.toFixed(2)}
                      </>
                    )}

                    {!walletLoading && !walletRetching && !data && (
                      <>
                        {getCurrencySymbol("BDT")}0.00
                      </>
                    )}
                  </span>

                  <style>
                    {`
                      @keyframes balancePulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                        100% { transform: scale(1); }
                      }
                    `}
                  </style>

                  <button
                    type="button"
                    onClick={handleRefreshBalance}
                    disabled={isRefreshing || walletRetching}
                    aria-label="ব্যালেন্স রিফ্রেশ করুন"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#70269c] bg-[#351052] text-[#e879f9] transition hover:bg-[#70269c] disabled:opacity-50"
                  >
                    <FiRefreshCw
                      className={`h-4 w-4 ${
                        isRefreshing || walletRetching
                          ? "animate-spin"
                          : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="hidden rounded-xl border border-[#70269c] bg-[#351052] p-3 sm:block">
                <FaCreditCard className="text-2xl text-[#e879f9]" />
              </div>
            </div>
          </div>
        </div>

        {/* প্রধান অ্যাকশন বাটন */}
        <div className="grid grid-cols-3 gap-2 px-1 py-4 md:gap-4 md:px-0 md:py-5">

          <Link href="/deposit" className="min-w-0">
            <div className="flex h-[65px] items-center justify-center gap-2 rounded-2xl border border-[#d946ef] bg-gradient-to-b from-[#c026d3] to-[#70269c] text-white shadow-[0_4px_0_#351052,0_5px_12px_rgba(192,38,211,0.2)] transition hover:brightness-125 active:translate-y-1 active:shadow-none md:h-[75px]">
              <PiHandDepositFill className="h-6 w-6 shrink-0 md:h-7 md:w-7" />
              <span className="text-sm font-bold md:text-lg">
                ডিপোজিট
              </span>
            </div>
          </Link>

          <Link href="/withdraw" className="min-w-0">
            <div className="flex h-[65px] items-center justify-center gap-2 rounded-2xl border border-[#a855f7] bg-gradient-to-b from-[#70269c] to-[#351052] text-white shadow-[0_4px_0_#160025,0_5px_12px_rgba(112,38,156,0.2)] transition hover:brightness-125 active:translate-y-1 active:shadow-none md:h-[75px]">
              <PiHandWithdrawFill className="h-6 w-6 shrink-0 md:h-7 md:w-7" />
              <span className="text-sm font-bold md:text-lg">
                উত্তোলন
              </span>
            </div>
          </Link>

          <Link href="/my-cards" className="min-w-0">
            <div className="flex h-[65px] items-center justify-center gap-2 rounded-2xl border border-[#70269c] bg-gradient-to-b from-[#351052] to-[#150329] text-white shadow-[0_4px_0_#080014] transition hover:border-[#d946ef] hover:brightness-125 active:translate-y-1 active:shadow-none md:h-[75px]">
              <FaCreditCard className="h-5 w-5 shrink-0 md:h-6 md:w-6" />
              <span className="text-sm font-bold md:text-lg">
                আমার কার্ড
              </span>
            </div>
          </Link>
        </div>

        {/* সদস্য মেনু */}
        <div className="rounded-2xl border border-[#351052] bg-gradient-to-b from-[#100525] to-[#080014] px-3 py-5 shadow-[0_4px_20px_rgba(112,38,156,0.1)] md:px-5 md:py-6">

          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white md:text-xl">
              সদস্য মেনু
            </h3>

            <span className="rounded-full border border-[#70269c] bg-[#351052] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#e879f9]">
              অ্যাকাউন্ট
            </span>
          </div>

          <div className="grid grid-cols-4 gap-x-2 gap-y-6 md:gap-x-4 md:gap-y-8">

            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex min-w-0 flex-col items-center text-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#62218b] bg-gradient-to-b from-[#351052] to-[#150329] shadow-[0_3px_0_#080014] transition duration-200 group-hover:-translate-y-1 group-hover:border-[#d946ef] group-hover:shadow-[0_0_15px_rgba(217,70,239,0.25)] md:h-14 md:w-14">
                    <Icon className="h-5 w-5 text-[#e8c8ff] transition group-hover:text-[#f0abfc] md:h-6 md:w-6" />
                  </div>

                  <span className="mt-2 text-[11px] font-medium leading-tight text-[#d9b5f5] transition group-hover:text-white md:text-sm">
                    {item.title}
                  </span>
                </Link>
              );
            })}

          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
