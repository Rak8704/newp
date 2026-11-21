
"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Overview from "./overview";
import Rewards from "./rewards";
import Records from "./records";

import { useFindInvitationRewardDataQuery } from "@/lib/features/rewardApiSlice";

const Invite = () => {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useFindInvitationRewardDataQuery();

  console.log("Invitation Reward API Response:", data);
  console.log("Invitation Reward API Error:", error);

  const rewards = data?.rewards;
  const statistic = data?.statistic;

  // লোডিং অবস্থা
  if (isLoading || isFetching) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center bg-[#020018]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#351052] border-t-[#d946ef]" />
          <p className="text-sm font-medium text-[#d9b5f5]">
            আমন্ত্রণ রিওয়ার্ড লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  // ত্রুটির অবস্থা
  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#020018] px-4">
        <div className="w-full max-w-md rounded-2xl border border-[#70269c] bg-[#100525] p-6 text-center">
          <h2 className="text-lg font-bold text-white">
            আমন্ত্রণ রিওয়ার্ড লোড করা যায়নি
          </h2>

          <p className="mt-2 text-sm text-[#c4a5d8]">
            অনুগ্রহ করে আবার চেষ্টা করুন।
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 rounded-lg border border-[#d946ef] bg-gradient-to-b from-[#c026d3] to-[#70269c] px-6 py-2 font-semibold text-white transition hover:brightness-125"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  // ডেটা না পাওয়ার অবস্থা
  if (!data || !rewards || !statistic) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#020018] px-4">
        <div className="w-full max-w-md rounded-2xl border border-[#62218b] bg-[#100525] p-6 text-center">
          <h2 className="text-lg font-bold text-white">
            আমন্ত্রণের কোনো তথ্য পাওয়া যায়নি
          </h2>

          <p className="mt-2 text-sm text-[#c4a5d8]">
            আমন্ত্রণ রিওয়ার্ডের তথ্য বর্তমানে পাওয়া যাচ্ছে না।
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 rounded-lg border border-[#d946ef] bg-gradient-to-b from-[#c026d3] to-[#70269c] px-6 py-2 font-semibold text-white transition hover:brightness-125"
          >
            রিফ্রেশ করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#020018] text-[#e8c8ff]">
      <Tabs defaultValue="overview" className="w-full">

        {/* ট্যাব হেডার */}
        <TabsList className="sticky left-0 top-0 z-20 flex h-auto w-full justify-between rounded-none border-b border-[#62218b] bg-gradient-to-b from-[#150329] to-[#080014] px-2 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.25)]">

          <TabsTrigger
            value="overview"
            className="flex-1 rounded-none border-b-2 border-transparent bg-transparent py-3 text-sm font-bold text-[#b99acb] shadow-none transition-all hover:text-white data-[state=active]:border-[#e879f9] data-[state=active]:bg-transparent data-[state=active]:text-[#f0abfc] data-[state=active]:shadow-none sm:text-base"
          >
            সারসংক্ষেপ
          </TabsTrigger>

          <TabsTrigger
            value="rewards"
            className="flex-1 rounded-none border-b-2 border-transparent bg-transparent py-3 text-sm font-bold text-[#b99acb] shadow-none transition-all hover:text-white data-[state=active]:border-[#e879f9] data-[state=active]:bg-transparent data-[state=active]:text-[#f0abfc] data-[state=active]:shadow-none sm:text-base"
          >
            রিওয়ার্ড
          </TabsTrigger>

          <TabsTrigger
            value="records"
            className="flex-1 rounded-none border-b-2 border-transparent bg-transparent py-3 text-sm font-bold text-[#b99acb] shadow-none transition-all hover:text-white data-[state=active]:border-[#e879f9] data-[state=active]:bg-transparent data-[state=active]:text-[#f0abfc] data-[state=active]:shadow-none sm:text-base"
          >
            রেকর্ড
          </TabsTrigger>

        </TabsList>

        {/* সারসংক্ষেপ */}
        <TabsContent value="overview" className="px-3 py-6 outline-none">
          <Overview statictic={statistic} />
        </TabsContent>

        {/* রিওয়ার্ড */}
        <TabsContent value="rewards" className="px-3 py-6 outline-none">
          <Rewards rewards={rewards} />
        </TabsContent>

        {/* রেকর্ড */}
        <TabsContent value="records" className="px-3 py-6 outline-none">
          <Records />
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default Invite;
