"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import slot from "@/../public/icons/nav-slot.svg";
import sport from "@/../public/icons/nav-sport.svg";
import live from "@/../public/icons/nav-live.svg";
import lottery from "@/../public/icons/nav-lottery.svg";
import fav from "@/../public/icons/nav-fav.svg";
import pvp from "@/../public/icons/nav-pvp.svg";
import gift from "@/../public/icons/nav-gift.svg";
import reward from "@/../public/icons/nav-reward.svg";
import languages from "@/../public/icons/nav-language.svg";
import fish from "@/../public/icons/nav-fish.svg";
import poker from "@/../public/icons/poker.svg";
import subrat1 from "@/../public/icons/subrat1.svg";
import subrat from "@/../public/icons/subrat.svg";
import subrat2 from "@/../public/icons/subrat2.svg";
import subrat3 from "@/../public/icons/subrat3.svg";
import subrat4 from "@/../public/icons/subrat4.svg";
import mission from "@/../public/icons/mission.svg";
import navEsport from "@/../public/icons/nav-esport.svg";
import subrat5 from "@/../public/icons/subrat5.svg";
import subrat6 from "@/../public/icons/subrat6.svg";

const menuData = [
  { title: "গেমস", icon: subrat1, redirect: "/games" },
  { title: "স্লট", icon: slot, redirect: "/slots" },
  { title: "স্পোর্টস", icon: sport, redirect: "/sports" },
  { title: "ই-স্পোর্টস", icon: navEsport, redirect: "/e-sports" },
  { title: "লাইভ ক্যাসিনো", icon: live, redirect: "/live-casino" },
  { title: "প্রিয় গেম", icon: fav, redirect: "/favorites" },
  { title: "লটারি", icon: lottery, redirect: "/lottery" },
  { title: "পিভিপি", icon: pvp, redirect: "/pvp" },
  { title: "পোকার", icon: poker, redirect: "#" },
  { title: "মিশন", icon: mission, redirect: "/mission", badge: "নতুন" },
  { title: "ফিশিং", icon: fish, redirect: "/fish" },
  { title: "ভিআইপি", icon: subrat4, redirect: "/vip" },
  { title: "প্রমোশন", icon: subrat, redirect: "/promotion", badge: "হট" },
  { title: "রিওয়ার্ড", icon: reward, redirect: "/rewardCenter" },
  { title: "বন্ধু আমন্ত্রণ", icon: subrat2, redirect: "/invite-friends" },
  { title: "গেম গাইড", icon: subrat3, redirect: "/manual" },
  { title: "ভাষা", icon: languages, redirect: "/languages" },
  { title: "অ্যাপ", icon: subrat5, redirect: "/appp" },
  { title: "লাইভ চ্যাট", icon: subrat6, redirect: "/chat", badge: "৯৯+" },
  { title: "অ্যাফিলিয়েট", icon: reward, redirect: "/affiliate" },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-full overflow-y-auto bg-[#020018] p-3 scrollbar-thin scrollbar-thumb-[#7023b8] scrollbar-track-[#100525]">
      <div className="rounded-[20px] border border-[#4c1680] bg-[#0b0320] p-2 shadow-[0_0_18px_rgba(112,23,190,0.15)]">
        <div className="grid grid-cols-2 overflow-hidden rounded-xl">
          {menuData.map((menu, i) => {
            const active = pathname === menu.redirect;

            return (
              <Link
                key={menu.title}
                href={menu.redirect}
                aria-label={menu.title}
                className={`
                  relative flex h-[65px] items-center gap-2
                  overflow-hidden px-2
                  border-b border-[#4a1876]
                  transition-all duration-200
                  ${i % 2 === 0 ? "border-r border-[#4a1876]" : ""}
                  ${
                    active
                      ? "bg-gradient-to-r from-[#7512a9] to-[#39045f] text-[#ffdf00]"
                      : "bg-[#100525] text-[#e9dfff] hover:bg-[#22083d]"
                  }
                `}
              >
                <Image
                  src={menu.icon}
                  alt=""
                  width={21}
                  height={21}
                  className="h-[21px] w-[21px] shrink-0 object-contain"
                />

                <span className="truncate text-[11px] font-semibold">
                  {menu.title}
                </span>

                {menu.badge && (
                  <span className="absolute right-0 top-0 rounded-bl-md bg-[#ed168b] px-1 text-[8px] font-bold text-white">
                    {menu.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}