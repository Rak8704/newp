
"use client";

import AppHeader from "@/components/AppHeader";
import React, { useState } from "react";

import { GameCardWithProvider } from "@/components/GameCards";
import { useGames } from "@/lib/store.zustond";
import { Categories } from "@/types/game";
import PrimaryInput from "@/components/form/input";
import GameLoader from "@/components/loader/GameLoader";
import SideNavLayout from "@/components/SideNavLayout";

const LiveCasionPage = () => {
  const [search, setSearch] = useState("");

  const { getGames } = useGames((state) => state);

  const gamesList = getGames(Categories.LiveDealers, search);

  return (
    <SideNavLayout>
      <div className="min-h-screen bg-[#020018]">
        <AppHeader title="লাইভ ক্যাসিনো" />

        <main className="min-h-screen bg-[#020018] px-2 py-5 sm:px-4">

          {/* গেম সার্চ সেকশন */}
          <div className="mb-4 rounded-xl border border-[#351052] bg-gradient-to-b from-[#150329] to-[#080014] p-3">
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <PrimaryInput
                  value={search}
                  type="search"
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="লাইভ ক্যাসিনো গেম খুঁজুন"
                  className="mb-2"
                />
              </div>
            </div>
          </div>

          {/* গেমের তালিকা */}
          <div className="grid grid-cols-3 gap-2 md:grid-cols-4 md:gap-3 lg:grid-cols-5 lg:gap-4">

            {gamesList &&
              gamesList.map((game, i) => (
                <GameCardWithProvider
                  game={game}
                  key={`${game.id}-${i}`}
                />
              ))}

            <GameLoader
              length={20}
              loading={!!!gamesList}
            />

          </div>

          {/* গেম পাওয়া না গেলে */}
          {gamesList && gamesList.length === 0 && (
            <div className="mt-6 rounded-xl border border-[#351052] bg-gradient-to-b from-[#150329] to-[#080014] px-4 py-12 text-center">

              <div className="mb-3 text-4xl text-[#70269c]">
                ♠
              </div>

              <h3 className="text-lg font-bold text-[#e8c8ff]">
                কোনো গেম পাওয়া যায়নি
              </h3>

              <p className="mt-2 text-sm text-[#a78abf]">
                অন্য কোনো গেমের নাম দিয়ে সার্চ করুন।
              </p>

            </div>
          )}

        </main>
      </div>
    </SideNavLayout>
  );
};

export default LiveCasionPage;