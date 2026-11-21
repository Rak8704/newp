
"use client";

import React from "react";
import { TfiHome } from "react-icons/tfi";
import { TbGiftCard } from "react-icons/tb";
import Link from "next/link";
import { BiAward } from "react-icons/bi";
import { GiCutDiamond } from "react-icons/gi";
import { usePathname } from "next/navigation";
import { IoGameController } from "react-icons/io5";

const TabNav = () => {
  const path = usePathname();

  const navItems = [
    {
      title: "হোম",
      href: "/",
      icon: TfiHome,
    },
    {
      title: "গেমস",
      href: "/slots",
      icon: IoGameController,
    },
    {
      title: "বন্ধু আমন্ত্রণ",
      href: "/invite-friends",
      icon: TbGiftCard,
    },
    {
      title: "পুরস্কার",
      href: "/rewardCenter",
      icon: BiAward,
    },
    {
      title: "সদস্য",
      href: "/member",
      icon: GiCutDiamond,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") return path === "/";
    return path === href || path.startsWith(`${href}/`);
  };

  return (
    <div className="fixed bottom-[50px] left-0 z-[999] w-full md:left-1/2 md:w-[500px] md:-translate-x-1/2">
      <div className="w-full px-[5px]">
        <div className="flex h-[52px] items-center justify-between rounded-full border border-[#70269c] border-t-[#c026d3] bg-gradient-to-b from-[#26083f] via-[#150329] to-[#080014] px-2 py-1 shadow-[0_-3px_15px_rgba(168,40,220,0.30)]">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <div key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={`relative flex w-full flex-col items-center justify-center gap-[2px] transition-all duration-200 ${
                    active
                      ? "text-[#f0aaff]"
                      : "text-[#b98bd5] hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-[22px] w-[22px] ${
                      active
                        ? "drop-shadow-[0_0_7px_rgba(192,38,211,0.85)]"
                        : ""
                    }`}
                  />

                  <span
                    className={`text-[11px] font-bold ${
                      active ? "text-white" : ""
                    }`}
                  >
                    {item.title}
                  </span>

                  {active && (
                    <span className="absolute -top-[5px] h-[2px] w-7 rounded-full bg-[#d946ef] shadow-[0_0_8px_#d946ef]" />
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabNav;
