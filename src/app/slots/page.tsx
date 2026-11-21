
"use client";

import AppHeader from "@/components/AppHeader";
import { GameCardWithProvider } from "@/components/GameCards";
import { useGames } from "@/lib/store.zustond";
import { Categories } from "@/types/game";
import PrimaryInput from "@/components/form/input";
import GameLoader from "@/components/loader/GameLoader";
import FilterProivder from "./filter-proivder";
import SideNavLayout from "@/components/SideNavLayout";

import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { MdFavorite } from "react-icons/md";

type ApiGame = {
  id?: string | number;
  game_code?: string | number;
  game_id?: string | number;
  game_uid?: string | number;

  name?: string;
  game_name?: string;

  img?: string;
  image_url?: string;
  thumbnail?: string;
  image?: string;
  game_image?: string;

  provider?: string;
  provider_name?: string;
  product_name?: string;
  product_code?: string | number;

  game_type?: string;
  categories?: string;
  status?: string;

  [key: string]: unknown;
};

const SlotPage = () => {
  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState<string>("all");

  const getGames = useGames((state) => state.getGames);
  const setGscGames = useGames((state) => state.setGscGames);
  const setLoading = useGames((state) => state.setLoading);
  const setError = useGames((state) => state.setError);
  const isLoading = useGames((state) => state.isLoading);
  const error = useGames((state) => state.error);

  // GSC+ গেম লোড করা
  const loadGames = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/games/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game_type: "all",
        }),
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || data.success !== true) {
        throw new Error(
          data.message ||
            `গেমের অনুরোধ ব্যর্থ হয়েছে: HTTP ${response.status}`
        );
      }

      const rawGames: ApiGame[] = Array.isArray(data.games)
        ? data.games
        : Array.isArray(data.gamesList)
          ? data.gamesList
          : [];

      console.log("GSC+ গেম API:", {
        total: data.total,
        received: rawGames.length,
        firstGame: rawGames[0],
      });

      // ডুপ্লিকেট গেম বাদ দেওয়া
      const seenGameKeys = new Set<string>();

      const normalizedGames = rawGames
        .map((game) => {
          const id =
            game.game_code ??
            game.game_id ??
            game.game_uid ??
            game.id;

          const name = game.game_name ?? game.name ?? "";

          const img =
            game.image_url ??
            game.thumbnail ??
            game.game_image ??
            game.image ??
            game.img ??
            "";

          const rawType = String(
            game.game_type ?? "slot"
          ).toLowerCase();

          const categories =
            rawType === "slot" || rawType === "slots"
              ? Categories.Slots
              : rawType === "fastgame" ||
                  rawType === "fast_games"
                ? Categories.FastGames
                : rawType;

          const providerName = String(
            game.provider_name ??
              game.provider ??
              game.product_name ??
              game.product_code ??
              "gsc"
          );

          return {
            id: String(id ?? ""),
            name: String(name),
            img: String(img),

            device: "mobile,desktop",
            title: providerName,
            categories,

            bm: "0",
            demo: "1",
            rewriterule: "0",
            exitButton: "1",
          };
        })
        .filter((game) => {
          if (!game.id || !game.name) {
            return false;
          }

          const uniqueKey =
            `${game.title.toLowerCase()}-${game.id}`;

          if (seenGameKeys.has(uniqueKey)) {
            return false;
          }

          seenGameKeys.add(uniqueKey);
          return true;
        });

      console.log("GSC+ ডুপ্লিকেট যাচাই:", {
        received: rawGames.length,
        uniqueGames: normalizedGames.length,
        removedDuplicates:
          rawGames.length - normalizedGames.length,
      });

      setGscGames(normalizedGames as never[]);

      if (rawGames.length > 0 && normalizedGames.length === 0) {
        throw new Error(
          "GSC+ গেম পাঠিয়েছে, কিন্তু ব্যবহারযোগ্য গেম আইডি বা নাম পাওয়া যায়নি। API response-এর field চেক করুন।"
        );
      }
    } catch (err) {
      console.error("GSC+ গেম লোড করতে ব্যর্থ:", err);

      setError(
        err instanceof Error
          ? err.message
          : "GSC+ গেম লোড করা সম্ভব হয়নি"
      );
    } finally {
      setLoading(false);
    }
  }, [setError, setGscGames, setLoading]);

  useEffect(() => {
    void loadGames();
  }, [loadGames]);

  // প্রোভাইডার নির্বাচন
  const handleProviderChange = useCallback(
    (selectedProvider: string) => {
      setProvider(selectedProvider);
    },
    []
  );

  // ফিল্টার করা গেম সংগ্রহ
  const gamesList = getGames(
    Categories.Slots,
    search,
    5000,
    provider
  );

  // পেজ রেন্ডার
  return (
    <SideNavLayout>
      <div className="min-h-screen bg-[#020018]">
        <AppHeader title="স্লট গেম" />

        <main className="min-h-screen bg-[#020018] px-2 py-5 sm:px-4">

          {/* প্রোভাইডার ফিল্টার */}
          <div className="mb-4 rounded-xl border border-[#351052] bg-[#0b031b] p-2">
            <FilterProivder
              onSelect={handleProviderChange}
            />
          </div>

          {/* গেম সার্চ ও প্রিয় গেম */}
          <div className="mb-3 flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <PrimaryInput
                placeholder="গেম খুঁজুন"
                className="mb-2"
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                value={search}
              />
            </div>

            <Link
              href="/favorites"
              title="প্রিয় গেম"
              className="mb-2 flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[10px] border border-[#70269c] bg-gradient-to-b from-[#351052] to-[#150329] shadow-[0_2px_0_#080014] transition hover:border-[#c026d3] hover:bg-[#31064e] active:scale-95"
            >
              <MdFavorite className="h-5 w-5 text-[#e879f9]" />
            </Link>
          </div>

          {/* লোডিং / এরর / গেমস */}
          {isLoading ? (
            <div className="mt-2 grid grid-cols-3 gap-2 md:grid-cols-4 md:gap-3 lg:grid-cols-5 lg:gap-4">
              <GameLoader length={15} loading={true} />
            </div>
          ) : error ? (
            <div className="mt-5 rounded-xl border border-[#8b245c] bg-[#1a0624] p-4 text-[#f5d0fe]">
              <p className="font-bold">
                গেম লোড করা যায়নি।
              </p>

              <p className="mt-2 break-words text-sm text-[#c4a5d8]">
                {error}
              </p>

              <button
                type="button"
                onClick={() => void loadGames()}
                className="mt-3 rounded-lg border border-[#a855f7] bg-gradient-to-b from-[#70269c] to-[#351052] px-5 py-2 text-sm font-bold text-white shadow-[0_2px_0_#160025] transition hover:brightness-125 active:scale-95"
              >
                আবার চেষ্টা করুন
              </button>
            </div>
          ) : (
            <>
              {/* গেম গ্রিড */}
              <div className="mt-2 grid grid-cols-3 gap-2 md:grid-cols-4 md:gap-3 lg:grid-cols-5 lg:gap-4">
                {gamesList?.map((game, index) => (
                  <GameCardWithProvider
                    game={game}
                    key={`${game.title}-${game.id}-${index}`}
                  />
                ))}
              </div>

              {/* কোনো গেম না থাকলে */}
              {(!gamesList || gamesList.length === 0) && (
                <div className="mt-5 rounded-xl border border-[#351052] bg-[#0b031b] px-4 py-12 text-center">
                  <MdFavorite className="mx-auto mb-3 h-9 w-9 text-[#70269c]" />

                  <p className="text-sm font-semibold text-[#e8c8ff]">
                    {search
                      ? "কোনো মিল থাকা গেম পাওয়া যায়নি।"
                      : "কোনো গেম পাওয়া যায়নি। GSC+ API response চেক করুন।"}
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </SideNavLayout>
  );
};

export default SlotPage;
