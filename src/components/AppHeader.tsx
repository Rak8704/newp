
"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { IoIosArrowBack } from "react-icons/io";

const AppHeader = ({ title }: { title: string }) => {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-[100] flex w-full items-center justify-between border-b border-[#552080] bg-gradient-to-r from-[#100321] via-[#310653] to-[#100321] px-4 py-3 shadow-[0_3px_12px_rgba(100,20,160,0.15)]">

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#67299a] bg-[#20063a] transition hover:bg-[#42086d]"
        aria-label="Go back"
      >
        <IoIosArrowBack className="h-6 w-6 text-[#e8c8ff]" />
      </button>

      {/* Page Title */}
      <div className="flex-1 px-2">
        <h3 className="w-full text-center text-lg font-bold tracking-wide text-white">
          {title}
        </h3>
      </div>

      {/* Right Spacer */}
      <div className="h-9 w-9" />
    </div>
  );
};

export default AppHeader;
