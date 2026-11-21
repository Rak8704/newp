
"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

import hotGame from "@/../public/icons/subrat1.svg";
import slot from "@/../public/icons/nav-slot.svg";
import sport from "@/../public/icons/nav-sport.svg";
import live from "@/../public/icons/nav-live.svg";
import fav from "@/../public/icons/nav-fav.svg";
import lottery from "@/../public/icons/nav-lottery.svg";
import pvp from "@/../public/icons/nav-pvp.svg";
import Image from "next/image";

const menuData = [
  {
    title: "জনপ্রিয় গেম",
    icon: hotGame,
    link: "/hot",
  },
  {
    title: "স্লট",
    icon: slot,
    link: "/slots",
  },
  {
    title: "লাইভ ক্যাসিনো",
    icon: live,
    link: "/live-casino",
  },
  {
    title: "খেলাধুলা",
    icon: sport,
    link: "/sports",
  },
  {
    title: "লটারি",
    icon: lottery,
    link: "/lottery",
  },
  {
    title: "পিভিপি গেম",
    icon: pvp,
    link: "/pvp",
  },
  {
    title: "প্রিয় গেম",
    icon: fav,
    link: "/favorites",
  },
];

const AppMenuItems = () => {
  const pathname = usePathname();

  return (
    <div className="w-full overflow-x-auto scrollbar-none">
      <div className="my-3 flex w-max min-w-full flex-nowrap items-center gap-2 px-1">
        {menuData.map((menu) => {
          const active = pathname === menu.link;

          return (
            <Link
              href={menu.link}
              key={menu.title}
              className={`
                flex h-[42px] min-w-[125px] items-center justify-center
                gap-2 rounded-full border px-4
                transition-all duration-200
                ${
                  active
                    ? "border-[#c026d3] bg-gradient-to-r from-[#7900a8] to-[#3c075e] text-white shadow-[0_0_12px_rgba(192,38,211,0.35)]"
                    : "border-[#62218b] bg-[#100525] text-[#f0e5ff] hover:border-[#b026d3] hover:bg-[#25083e]"
                }
              `}
            >
              <Image
                src={menu.icon}
                alt={menu.title}
                width={20}
                height={20}
                className="h-5 w-5 shrink-0 object-contain"
              />

              <span className="whitespace-nowrap text-[12px] font-bold">
                {menu.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AppMenuItems;
