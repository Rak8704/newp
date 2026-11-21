
"use client";
import React, { useRef } from "react";
import GameSelectionHeader from "./GameSelectionHeader";

const HotGames = () => {
  const gamesContainer = useRef<HTMLDivElement | null>(null);

  const handleRightButtonClick = () => {
    gamesContainer.current!.scrollLeft += -130;
  };

  const handleLeftButtonClick = () => {
    gamesContainer.current!.scrollLeft += 130;
  };

  return (
    <div
      className="my-4"
      style={{
        width: "100%",
      }}
    >
      <GameSelectionHeader
        title="জনপ্রিয় গেম"
        leftAction={handleLeftButtonClick}
        rightAction={handleRightButtonClick}
        seeMoreLink="#"
      />

      <div
        className="max-w-full w-full overflow-x-auto scrollbar-none scroll-smooth"
        ref={gamesContainer}
      >
        <div className="hot-games-list">
          {/* 
          {hotGamesData.map((g, i) => (
            <GameCardWithProvider
              gameImage={g.gameImage}
              gameName={g.gameName}
              providerImage={g.providerImage}
              redirect={g.redirect}
              key={i}
            />
          ))} 
          */}
        </div>
      </div>
    </div>
  );
};

export default HotGames;
