
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { providers } from "../../../data/api-providers";
import Image from "next/image";
import { Title } from "@/types/game";

const FilterProivder = ({
  onSelect,
}: {
  onSelect: (provider: Title) => void;
}) => {
  const [selectedProvider, setProvider] = useState<any>("all");

  useEffect(() => {
    onSelect(selectedProvider);
  }, [selectedProvider, onSelect]);

  return (
    <div className="w-full min-w-0">
      <div className="mb-3 w-full min-w-0 overflow-hidden rounded-xl border border-[#62218b] bg-gradient-to-b from-[#150329] to-[#080014] px-3 py-3 shadow-[0_3px_12px_rgba(112,38,156,0.15)] sm:px-4">

        <Swiper
          slidesPerView="auto"
          spaceBetween={10}
          direction="horizontal"
          freeMode={true}
          grabCursor={true}
          className="providerSwiper w-full"
        >
          {/* All Button */}
          <SwiperSlide className="!w-auto !shrink-0">
            <button
              type="button"
              onClick={() => setProvider("all")}
              className={`flex h-[45px] w-[75px] shrink-0 items-center justify-center whitespace-nowrap rounded-[11px] border px-4 transition-all duration-200 active:scale-95 ${
                selectedProvider === "all"
                  ? "border-[#e879f9] bg-gradient-to-b from-[#c026d3] to-[#70269c] text-white shadow-[0_0_12px_rgba(192,38,211,0.35)]"
                  : "border-[#62218b] bg-gradient-to-b from-[#351052] to-[#150329] text-[#d9b5f5] shadow-[0_2px_0_#080014] hover:border-[#b026d3] hover:text-white"
              }`}
            >
              <span className="text-base font-bold">All</span>
            </button>
          </SwiperSlide>

          {/* Provider Buttons */}
          {providers.map((provider) => {
            const isActive = selectedProvider === provider.name;

            return (
              <SwiperSlide
                key={provider.name}
                className="!w-auto !shrink-0"
              >
                <button
                  type="button"
                  onClick={() => setProvider(provider.name)}
                  aria-label={provider.name}
                  aria-pressed={isActive}
                  className={`flex h-[45px] min-w-[90px] w-auto shrink-0 items-center justify-center whitespace-nowrap rounded-[11px] border px-4 transition-all duration-200 active:scale-95 ${
                    isActive
                      ? "border-[#e879f9] bg-gradient-to-b from-[#c026d3] to-[#70269c] shadow-[0_0_12px_rgba(192,38,211,0.35)]"
                      : "border-[#62218b] bg-gradient-to-b from-[#351052] to-[#150329] shadow-[0_2px_0_#080014] hover:border-[#b026d3] hover:bg-[#31064e]"
                  }`}
                >
                  <Image
                    src={
                      isActive
                        ? provider.imageBlack
                        : provider.imageWhite
                    }
                    alt={provider.name}
                    width={85}
                    height={30}
                    sizes="85px"
                    className="block h-[30px] w-[85px] shrink-0 object-contain"
                  />
                </button>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <style jsx global>{`
        .providerSwiper .swiper-wrapper {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
        }

        .providerSwiper .swiper-slide {
          width: auto !important;
          flex-shrink: 0 !important;
          height: auto !important;
        }
      `}</style>
    </div>
  );
};

export default FilterProivder;
