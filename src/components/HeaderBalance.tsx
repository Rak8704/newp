
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { HiOutlineRefresh } from "react-icons/hi";
import { FaRegFileAlt } from "react-icons/fa";
import { RiCustomerService2Line, RiAccountPinCircleFill } from "react-icons/ri";
import { PiHandWithdrawFill, PiHandDepositFill } from "react-icons/pi";
import { IoLogOut } from "react-icons/io5";
import { MdHistory } from "react-icons/md";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { logout } from "@/action/logout";
import { getCurrencySymbol } from "@/lib/utils";

const UserBalance = ({
  balance,
  currency,
}: {
  balance: number;
  currency: string;
}) => {
  return (
    <section className="relative flex h-full items-center">
      <div className="flex h-full items-center">
        <div className="relative h-full">
          <div className="flex h-full items-center">

            <div
              className="flex h-[31px] items-center rounded-md border border-[#70269c] bg-[#150329] px-2 shadow-[0_2px_0_#080014,0_0_10px_rgba(112,38,156,0.15)]"
              aria-haspopup="true"
            >
              <div className="flex w-full items-center">
                <BalanceDisplay
                  amount={balance}
                  currencySymbol={getCurrencySymbol(currency)!}
                />
                <RefreshButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface UserAvatarProps {
  imageUrl: string;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  imageUrl,
  className = "",
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="প্রোফাইল মেনু খুলুন"
          className={`mr-2 h-[39px] w-[39px] overflow-hidden rounded-full border border-[#b026d3] bg-gradient-to-b from-[#a855f7] to-[#4c1176] p-[2px] shadow-[0_0_10px_rgba(192,38,211,0.25)] transition hover:brightness-125 ${className}`}
        >
          <div className="flex size-full items-center justify-center overflow-hidden rounded-full">
            <img
              alt="ব্যবহারকারীর প্রোফাইল ছবি"
              src={imageUrl || "https://images.51939393.com//TCG_PROD_IMAGES/B2C/01_PROFILE/PROFILE/0.png"}
              className="size-full rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://images.51939393.com//TCG_PROD_IMAGES/B2C/01_PROFILE/PROFILE/0.png";
              }}
            />
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="z-[1000] w-auto border-none bg-transparent p-0 shadow-none"
      >
        <DropdownMenu />
      </PopoverContent>
    </Popover>
  );
};

interface BalanceDisplayProps {
  amount: number;
  currencySymbol: string;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
  amount,
  currencySymbol,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={toggleDropdown}
          aria-expanded={isDropdownOpen}
          aria-label="ব্যালেন্স মেনু খুলুন"
          className="flex w-full items-center"
        >
          <div className="flex w-full items-center overflow-hidden whitespace-nowrap text-sm font-bold text-[#e8c8ff]">
            <span className="mr-1.5 text-sm font-bold text-[#d946ef]">
              {currencySymbol}
            </span>

            <span className="overflow-hidden text-ellipsis text-sm font-bold text-[#e8c8ff]">
              {amount}
            </span>
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="z-[1000] w-auto border-none bg-transparent p-0 shadow-none"
      >
        <DropdownMenu />
      </PopoverContent>
    </Popover>
  );
};

const RefreshButton: React.FC = () => {
  return (
    <div className="ml-1.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center">
      <HiOutlineRefresh className="h-3 w-3 text-[#c084fc] transition hover:text-[#f0abfc]" />
    </div>
  );
};

const DropdownMenu: React.FC = () => {
  const handleLogout = () => {
    logout().then((res) => {
      if (res && res.success) {
        location.reload();
      } else if (res.error) {
        console.log(res.error);
      }
    });
  };

  const menuItems = [
    {
      icon: <RiAccountPinCircleFill className="h-5 w-5" />,
      label: "প্রোফাইল",
      onclick: () => (window.location.href = "/member"),
    },
    {
      icon: <MdHistory className="h-5 w-5" />,
      label: "লেনদেনের ইতিহাস",
      onclick: () => (window.location.href = "/history"),
    },
    {
      icon: <FaRegFileAlt className="h-5 w-5" />,
      label: "লাভ ও ক্ষতি",
      onclick: () => (window.location.href = "/profitandloss"),
    },
    {
      icon: <PiHandDepositFill className="h-5 w-5" />,
      label: "ডিপোজিট",
      onclick: () => (window.location.href = "/deposit"),
    },
    {
      icon: <PiHandWithdrawFill className="h-5 w-5" />,
      label: "উত্তোলন",
      onclick: () => (window.location.href = "/withdraw"),
    },
    {
      icon: <RiCustomerService2Line className="h-5 w-5" />,
      label: "কাস্টমার সার্ভিস",
      onclick: () => (window.location.href = "/support"),
    },
    {
      icon: <IoLogOut className="h-5 w-5" />,
      label: "লগআউট",
      onclick: () => handleLogout(),
    },
  ];

  return (
    <div className="relative z-[101] min-w-[217px] overflow-hidden rounded-xl border border-[#70269c] bg-[#100525] p-1.5 shadow-[0_8px_25px_rgba(0,0,0,0.55),0_0_15px_rgba(112,38,156,0.18)]">
      <div className="mb-1 border-b border-[#351052] px-3 py-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#c084fc]">
          আমার অ্যাকাউন্ট
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            icon={item.icon}
            label={item.label}
            onClick={item.onclick}
          />
        ))}
      </nav>
    </div>
  );
};

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  link?: string;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center rounded-lg border border-transparent px-3 py-2 text-left text-sm font-medium text-[#e8c8ff] transition duration-200 hover:border-[#62218b] hover:bg-gradient-to-r hover:from-[#351052] hover:to-[#1e0835] hover:text-white active:scale-[0.98]"
    >
      <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#351052] bg-[#1e0835] text-[#c084fc] transition group-hover:border-[#b026d3] group-hover:bg-[#4c1176] group-hover:text-white">
        {icon}
      </div>

      <span className="text-sm font-medium text-[#e8c8ff] transition group-hover:text-white">
        {label}
      </span>
    </button>
  );
};

export default UserBalance;
