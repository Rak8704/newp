
"use client";

import { useState } from "react";
import { SportsList } from "./SportsList";
import { GamesList } from "./GamesList";
import { GameOddsDetail } from "./GameOddsDetail";
import { Game } from "@/types/sports";
import PrimaryInput from "@/components/form/input";

export const SportsContainer = () => {
  const [selectedSportKey, setSelectedSportKey] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectSport = (sportKey: string) => {
    setSelectedSportKey(sportKey);
    setSelectedGame(null);
  };

  const handleSelectGame = (game: Game) => {
    setSelectedGame(game);
  };

  const handleBackToGames = () => {
    setSelectedGame(null);
  };

  return (
    <div className="flex h-full min-h-[calc(100vh-100px)] flex-col overflow-hidden rounded-xl border border-[#351052] bg-[#080014] shadow-[0_8px_30px_rgba(112,38,156,0.12)] md:flex-row">

      {/* Left sidebar - Sports list */}
      <div className="w-full border-b border-[#351052] bg-gradient-to-b from-[#150329] to-[#100525] md:w-64 md:shrink-0 md:border-b-0 md:border-r">
        <div className="p-4">
          <h2 className="mb-4 text-xl font-bold text-[#e8c8ff]">
            Sports
          </h2>

          <PrimaryInput
            value={searchQuery}
            type="search"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Sports"
            className="mb-4"
          />
        </div>

        <SportsList
          onSelectSport={handleSelectSport}
          selectedSportKey={selectedSportKey || undefined}
        />
      </div>

      {/* Main content area */}
      <div className="min-h-[400px] min-w-0 flex-1 overflow-y-auto bg-[#020018]">

        {selectedGame ? (
          <GameOddsDetail
            game={selectedGame}
            onBack={handleBackToGames}
          />
        ) : selectedSportKey ? (
          <GamesList
            sportKey={selectedSportKey}
            onSelectGame={handleSelectGame}
          />
        ) : (
          <div className="flex h-full min-h-[450px] items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-xl text-center">

              <div className="mb-5 text-5xl text-[#70269c]">
                ♛
              </div>

              <h2 className="mb-4 text-2xl font-bold text-[#e8c8ff]">
                Welcome to Sports Betting
              </h2>

              <p className="mb-6 text-sm leading-6 text-[#a78abf]">
                Select a sport from the sidebar to view upcoming games and odds
              </p>

              <div className="mx-auto max-w-md rounded-xl border border-[#351052] bg-gradient-to-b from-[#150329] to-[#100525] p-4 shadow-[0_5px_20px_rgba(112,38,156,0.12)]">

                <h3 className="mb-3 text-left font-semibold text-[#d946ef]">
                  Popular Sports
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    "americanfootball_nfl",
                    "basketball_nba",
                    "soccer_epl",
                    "baseball_mlb",
                  ].map((sportKey) => (
                    <button
                      key={sportKey}
                      onClick={() => handleSelectSport(sportKey)}
                      className="rounded-lg border border-[#351052] bg-[#100525] px-3 py-3 text-xs font-semibold text-[#e8c8ff] transition-all duration-200 hover:border-[#d946ef] hover:bg-[#351052] hover:text-white active:scale-95 sm:text-sm"
                    >
                      {sportKey
                        .split("_")
                        .map((word) => word.toUpperCase())
                        .join(" ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
