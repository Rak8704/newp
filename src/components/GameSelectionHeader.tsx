
"use client";

import Link from "next/link";
import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface GameSelectionHeaderProps {
  title: string;
  rightAction: () => void;
  leftAction: () => void;
  isMoreGames?: boolean;
  seeMoreLink?: string;
}

const GameSelectionHeader = ({
  title,
  rightAction,
  leftAction,
  isMoreGames = true,
  seeMoreLink,
}: GameSelectionHeaderProps) => {
  return (
    <div className="my-2 flex items-center justify-between gap-2">
      {/* Section Title */}
      <span className="text-[16px] font-bold uppercase tracking-wide text-[#e8c8ff] sm:text-[18px]">
        {title}
      </span>

      {/* Navigation Buttons */}
      {isMoreGames && (
        <div className="flex shrink-0 items-center gap-1.5">
          {/* See All */}
          {seeMoreLink && (
            <Link
              href={seeMoreLink}
              className="flex h-[34px] items-center justify-center rounded-md border border-[#70269c] bg-gradient-to-b from-[#4c1176] to-[#24043d] px-3 text-[12px] font-bold text-[#f1ddff] shadow-[0_1px_0_#160025] transition hover:border-[#b43ce5] hover:brightness-125 active:scale-95"
            >
              আরও দেখুন
            </Link>
          )}

          {/* Previous */}
          <button
            type="button"
            onClick={rightAction}
            aria-label="Scroll previous"
            className="flex h-[34px] w-[34px] items-center justify-center rounded-md border border-[#62218b] bg-[#150329] text-[#e8c8ff] shadow-[0_1px_0_#080014] transition hover:border-[#b026d3] hover:bg-[#31064e] hover:text-white active:scale-95"
          >
            <IoIosArrowBack size={18} />
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={leftAction}
            aria-label="Scroll next"
            className="flex h-[34px] w-[34px] items-center justify-center rounded-md border border-[#62218b] bg-[#150329] text-[#e8c8ff] shadow-[0_1px_0_#080014] transition hover:border-[#b026d3] hover:bg-[#31064e] hover:text-white active:scale-95"
          >
            <IoIosArrowForward size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default GameSelectionHeader;
