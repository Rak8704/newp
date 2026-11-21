
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef } from "react";

import sports_1 from "@/../public/sports/sports-1.png";
import sports_2 from "@/../public/sports/sports-2.png";
import sports_3 from "@/../public/sports/sports-3.png";
import sports_4 from "@/../public/sports/sports-4.png";

import GameSelectionHeader from "./GameSelectionHeader";
import Link from "next/link";
import Image from "next/image";

export const sportsData = [
  {
    image: sports_1,
    redirect: "/sports",
  },
  {
    image: sports_2,
    redirect: "/sports",
  },
  {
    image: sports_3,
    redirect: "/sports",
  },
  {
    image: sports_4,
    redirect: "/sports",
  },
];

const Sports = () => {
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

  return (
    <section className="my-4 w-full overflow-hidden rounded-xl border border-[#351052] bg-gradient-to-b from-[#150329] to-[#020018] p-2 shadow-[0_4px_20px_rgba(112,38,156,0.15)]">
      <GameSelectionHeader
        title="খেলাধুলা"
        leftAction={handleLeftButtonClick}
        rightAction={handleRightButtonClick}
        seeMoreLink="/live-sports"
      />

      <div
        ref={gamesContainer}
        className="mt-3 w-full max-w-full overflow-x-auto scroll-smooth scrollbar-none"
      >
        <div className="hot-games-list">
          {sportsData.map((s, i) => (
            <SportsCard
              key={i}
              image={s.image}
              redirect={s.redirect}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sports;

export const SportsCard = ({
  image,
  redirect,
}: {
  image: any;
  redirect: string;
}) => {
  return (
    <Link
      href={redirect}
      className="group relative block overflow-hidden rounded-xl border border-[#351052] bg-[#100525] shadow-[0_3px_12px_rgba(53,16,82,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d946ef] hover:shadow-[0_5px_20px_rgba(192,38,211,0.3)]"
    >
      <div className="relative overflow-hidden rounded-xl">
        <Image
          src={image}
          alt="Sports"
          className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080014]/30 via-transparent to-[#70269c]/10 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </Link>
  );
};
