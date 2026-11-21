
"use client";

import Image from "next/image";
import React, { useState } from "react";

import announcement from "@/../public/announcement-poster.png";
import close_btn from "@/../public/icons/close.svg";

import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";

const AnnouncementModal: React.FC = () => {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1001] flex h-screen w-full items-center justify-center bg-black/75 px-3 backdrop-blur-sm">

      {/* Modal */}
      <div className="relative mx-auto w-full max-w-[850px] overflow-hidden rounded-2xl border border-[#7824b4] bg-[#020018] shadow-[0_0_35px_rgba(123,35,190,0.30)]">

        {/* Header */}
        <div className="flex h-[65px] items-center justify-center border-b border-[#542080] bg-gradient-to-r from-[#250541] via-[#4c0878] to-[#250541]">
          <h2 className="text-lg font-extrabold tracking-wide text-white">
            Announcement
          </h2>
        </div>

        {/* Announcement Image */}
        <div className="bg-[#020018] p-2 sm:p-3">
          <div className="overflow-hidden rounded-xl border border-[#4b1875]">
            <Image
              src={announcement}
              alt="Announcement"
              className="h-[240px] w-full object-contain sm:h-[380px]"
              priority
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 border-t border-[#4b1875] bg-[#0b0320] p-3">

          {/* Previous */}
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#7724b0] bg-gradient-to-b from-[#531080] to-[#260442] py-3 text-sm font-bold text-white shadow-[0_2px_0_#180027] transition hover:brightness-125 active:scale-[0.98]"
          >
            <BiSolidLeftArrow className="h-4 w-4 text-[#e5b5ff]" />
            Previous
          </button>

          {/* Next */}
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#7724b0] bg-gradient-to-b from-[#531080] to-[#260442] py-3 text-sm font-bold text-white shadow-[0_2px_0_#180027] transition hover:brightness-125 active:scale-[0.98]"
          >
            Next
            <BiSolidRightArrow className="h-4 w-4 text-[#e5b5ff]" />
          </button>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={() => setOpen(false)}
        aria-label="Close announcement"
        className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#7824b4] bg-[#18042b] transition hover:bg-[#45086b] sm:right-5 sm:top-5"
      >
        <Image
          src={close_btn}
          alt="Close"
          className="h-5 w-5"
        />
      </button>
    </div>
  );
};

export default AnnouncementModal;
