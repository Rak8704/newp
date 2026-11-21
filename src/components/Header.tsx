
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { RiMenuFoldLine } from "react-icons/ri";

import logo from "@/../public/logo.png";
import Image from "next/image";
import Link from "next/link";
import { findCurrentUser } from "@/data/user";
import HeaderBalance from "./HeaderBalance";
import AppSideCanva from "./AppSideCanva";

const Header = async () => {
  const user: any = await findCurrentUser();

  return (
    <header className="sticky top-0 z-[1000] flex h-[60px] w-full items-center justify-between border-b border-[#4c1875] bg-[#020018] px-3 shadow-[0_3px_12px_rgba(95,20,150,0.15)]">
      {/* লোগো এবং মেনু */}
      <div className="flex items-center gap-2.5">
        {/* সাইডবার মেনু */}
        <AppSideCanva
          trigger={
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#62218b] bg-[#150329] transition hover:bg-[#31064e]">
              <RiMenuFoldLine className="h-5 w-6 text-[#e8c8ff]" />
            </span>
          }
        />

        {/* লোগো */}
        <Link href="/" className="flex items-center">
          <Image
            src={logo}
            alt="TK1111 লোগো"
            width={90}
            height={30}
            className="h-[30px] w-[90px] object-contain"
            priority
          />
        </Link>
      </div>

      {/* ব্যবহারকারীর ব্যালেন্স */}
      {user && user.wallet && (
        <HeaderBalance
          balance={+user.wallet.balance}
          currency={user.wallet.currency}
        />
      )}

      {/* লগইন / নিবন্ধন */}
      {!user && (
        <div className="flex items-center gap-2">
          {/* লগইন */}
          <Link
            href="/login"
            className="flex h-[32px] min-w-[72px] items-center justify-center rounded-md border border-[#70269c] bg-gradient-to-b from-[#4c1176] to-[#24043d] px-3 text-[12px] font-bold text-[#f1ddff] shadow-[0_1px_0_#160025] transition hover:brightness-125 active:scale-95"
          >
            লগইন
          </Link>

          {/* নিবন্ধন */}
          <Link
            href="/register"
            className="flex h-[32px] min-w-[78px] items-center justify-center rounded-md border border-[#b43ce5] bg-gradient-to-b from-[#a52be0] to-[#60108f] px-3 text-[12px] font-bold text-white shadow-[0_1px_0_#360452] transition hover:brightness-125 active:scale-95"
          >
            নিবন্ধন
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
