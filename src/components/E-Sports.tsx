
"use client";

import React, { useRef } from "react";

import { GameCardWithProvider } from "./GameCards";
import GameSelectionHeader from "./GameSelectionHeader";
import { Categories, Title } from "@/types/game";

export const sports = [
  {
    id: "8357",
    name: "CYBER BET MOBILE",
    img: "https://static.cdneu-stat.com/resources/sitepicstbs/imperium_bet/game_img_2/ibcb.jpg",
    device: "1",
    title: Title.SportBetting,
    categories: Categories.Sport,
    bm: "0",
    demo: "1",
    rewriterule: "0",
    exitButton: "1",
  },
  {
    id: "3002",
    name: "SPORT BET",
    img: "https://static.cdneu-stat.com/resources/sitepicstbs/imperium_bet/game_img_2/ib.jpg",
    device: "0",
    title: Title.SportBetting,
    categories: Categories.Sport,
    bm: "0",
    demo: "1",
    rewriterule: "0",
    exitButton: "1",
  },
  {
    id: "3001",
    name: "CYBER BET",
    img: "https://static.cdneu-stat.com/resources/sitepicstbs/imperium_bet/game_img_2/ibcb.jpg",
    device: "0",
    title: Title.SportBetting,
    categories: Categories.Sport,
    bm: "0",
    demo: "1",
    rewriterule: "0",
    exitButton: "1",
  },
  {
    id: "3000",
    name: "SPORT BET MOBILE",
    img: "https://static.cdneu-stat.com/resources/sitepicstbs/imperium_bet/game_img_2/ib.jpg",
    device: "1",
    title: Title.SportBetting,
    categories: Categories.Sport,
    bm: "0",
    demo: "1",
    rewriterule: "0",
    exitButton: "1",
  },
];

const ESports = () => {
  const gamesContainer = useRef<HTMLDivElement | null>(null);

  const handleRightButtonClick = () => {
    if (gamesContainer.current) {
      gamesContainer.current.scrollBy({
        left: 130,
        behavior: "smooth",
      });
    }
  };

  const handleLeftButtonClick = () => {
    if (gamesContainer.current) {
      gamesContainer.current.scrollBy({
        left: -130,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="my-4 w-full overflow-hidden rounded-xl border border-[#351052] bg-[#020018] p-2 shadow-[0_0_15px_rgba(95,20,150,0.10)]">
      <GameSelectionHeader
        title="ই-স্পোর্টস"
        leftAction={handleLeftButtonClick}
        rightAction={handleRightButtonClick}
        seeMoreLink="#"
      />

      <div
        ref={gamesContainer}
        className="mt-2 w-full max-w-full overflow-x-auto scroll-smooth scrollbar-none"
      >
        <div className="hot-games-list">
          {sports.map((game) => (
            <GameCardWithProvider
              game={game}
              key={game.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ESports;
