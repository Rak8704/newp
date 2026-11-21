
"use client";

import React, { useRef } from "react";

import { GameCardWithProvider } from "./GameCards";
import GameSelectionHeader from "./GameSelectionHeader";
import { useGames } from "@/lib/store.zustond";
import { Categories } from "@/types/game";
import GameLoader from "./loader/GameLoader";

const SlotGames = () => {
  const gamesContainer = useRef<HTMLDivElement | null>(null);

  const handleRightButtonClick = () => {
    gamesContainer.current?.scrollBy({
      left: 130,
      behavior: "smooth",
    });
  };

  const handleLeftButtonClick = () => {
    gamesContainer.current?.scrollBy({
      left: -130,
      behavior: "smooth",
    });
  };

  const { getGames } = useGames((state) => state);
  const gamesList = getGames(Categories.Slots, undefined, 20);

  return (
    <section className="my-4 w-full overflow-hidden rounded-xl border border-[#351052] bg-[#020018] p-2 shadow-[0_0_15px_rgba(95,20,150,0.10)]">
      <GameSelectionHeader
        title="স্লট গেমস"
        leftAction={handleLeftButtonClick}
        rightAction={handleRightButtonClick}
        seeMoreLink="/slots"
      />

      <div
        ref={gamesContainer}
        className="mt-2 w-full max-w-full overflow-x-auto scroll-smooth scrollbar-none"
      >
        <div className="hot-games-list">
          {gamesList?.map((game, i) => (
            <GameCardWithProvider key={game.id ?? i} game={game} />
          ))}

          <GameLoader length={20} loading={!gamesList} />
        </div>
      </div>
    </section>
  );
};

export default SlotGames;
