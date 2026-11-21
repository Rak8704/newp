
"use client";

import { Game } from "@/types/sports";
import { useEffect } from "react";
import { useSportsStore } from "@/lib/store/sportsStore";
import { formatDistanceToNow, parseISO } from "date-fns";

interface GamesListProps {
  sportKey: string;
  onSelectGame?: (game: Game) => void;
}

export const GamesList = ({ sportKey, onSelectGame }: GamesListProps) => {
  const {
    games,
    fetchGamesForSport,
    isLoading,
    error,
    getSportByKey,
  } = useSportsStore();

  const sport = getSportByKey(sportKey);

  useEffect(() => {
    if (sportKey) {
      fetchGamesForSport(sportKey);
    }
  }, [sportKey, fetchGamesForSport]);

  if (isLoading && games.length === 0) {
    return (
      <div className="space-y-4 bg-[#020018] p-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl border border-[#351052] bg-[#150329]"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 rounded-xl border border-[#70269c] bg-[#150329] p-5 text-center">
        <p className="text-sm text-[#f0abfc]">
          Error loading games: {error}
        </p>

        <button
          onClick={() => fetchGamesForSport(sportKey)}
          className="mt-3 rounded-lg border border-[#d946ef] bg-gradient-to-b from-[#c026d3] to-[#70269c] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-125"
        >
          Retry
        </button>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="m-4 rounded-xl border border-[#351052] bg-gradient-to-b from-[#150329] to-[#080014] p-8 text-center">
        <div className="mb-3 text-3xl text-[#70269c]">♛</div>
        <p className="text-sm text-[#a78abf]">
          No upcoming games found for {sport?.title || sportKey}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-[#020018] p-3 sm:p-4">
      <h2 className="border-b border-[#351052] pb-3 text-xl font-bold text-[#e8c8ff]">
        {sport?.title || "Upcoming Games"}
      </h2>

      <div className="space-y-3">
        {games.map((game) => (
          <div
            key={game.id}
            className="cursor-pointer rounded-xl border border-[#351052] bg-gradient-to-b from-[#150329] to-[#100525] p-4 shadow-[0_3px_12px_rgba(53,16,82,0.2)] transition-all duration-200 hover:border-[#d946ef] hover:shadow-[0_4px_16px_rgba(192,38,211,0.15)]"
            onClick={() => onSelectGame && onSelectGame(game)}
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <span className="text-xs text-[#a78abf]">
                {formatDistanceToNow(parseISO(game.commence_time), {
                  addSuffix: true,
                })}
              </span>

              <span className="rounded-full border border-[#70269c] bg-[#351052] px-2.5 py-1 text-[10px] font-semibold text-[#f0abfc]">
                {game.sport_title}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 text-sm font-semibold text-[#e8c8ff] sm:text-base">
                {game.home_team}
              </div>

              <div className="rounded-full border border-[#351052] bg-[#080014] px-3 py-1 text-xs font-bold text-[#d946ef]">
                VS
              </div>

              <div className="flex-1 text-right text-sm font-semibold text-[#e8c8ff] sm:text-base">
                {game.away_team}
              </div>
            </div>

            {game.bookmakers.length > 0 && (
              <div className="mt-4 border-t border-[#351052] pt-3">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#d946ef]">
                  Odds (Moneyline)
                </div>

                <div className="flex flex-wrap justify-between gap-3">
                  {game.bookmakers[0].markets
                    .filter((market) => market.key === "h2h")
                    .map((market) => market.outcomes)
                    .flat()
                    .map((outcome) => (
                      <div
                        key={outcome.name}
                        className="flex min-w-[65px] flex-1 flex-col items-center rounded-lg border border-[#351052] bg-[#080014] px-2 py-2"
                      >
                        <span className="text-center text-[11px] text-[#a78abf]">
                          {outcome.name}
                        </span>

                        <span className="mt-1 text-sm font-bold text-[#f0abfc]">
                          {outcome.price > 0
                            ? `+${outcome.price}`
                            : outcome.price}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
