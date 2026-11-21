
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";

import logo_sq from "@/../public/logo-sq.jpg";
import Image from "next/image";

const Footer = () => {
  const categories = [
    "স্লট গেম",
    "লাইভ ক্যাসিনো",
    "পোকার",
    "ফিশিং",
    "স্পোর্টস",
    "ই-স্পোর্টস",
    "লটারি",
  ];

  const providers = [
    "jl", "pg", "spb", "pp", "pt", "bng",
    "ng", "btg", "jff", "l22", "jdb", "mnp",
    "fc", "sg", "obs", "fp", "ezg", "5g",
    "ae", "bt", "759", "bom", "ne", "rt",
  ];

  return (
    <footer className="w-full border-t border-[#351052] bg-[#020018] px-4 pb-[100px] pt-6">
      <div className="relative mx-auto w-full max-w-5xl">

        {/* পার্টনার এবং লাইভ চ্যাট বাটন */}
        <div className="mb-8 flex gap-3 sm:gap-4">
          <Link
            href="#"
            className="flex h-[48px] max-w-[164px] flex-1 items-center justify-center rounded-xl border border-[#70269c] bg-gradient-to-b from-[#4c1176] to-[#200436] shadow-[0_3px_0_#100020,0_0_12px_rgba(112,38,156,0.18)] transition hover:border-[#c026d3] hover:brightness-125 active:translate-y-[2px] active:shadow-none"
          >
            <span className="bg-gradient-to-b from-[#ffffff] via-[#e8c8ff] to-[#c026d3] bg-clip-text text-xl font-extrabold tracking-wide text-transparent drop-shadow-[0_2px_3px_rgba(192,38,211,0.5)] sm:text-2xl">
              পার্টনার
            </span>
          </Link>

          <Link
            href="/support"
            className="flex h-[48px] max-w-[164px] flex-1 items-center justify-center rounded-xl border border-[#70269c] bg-gradient-to-b from-[#4c1176] to-[#200436] shadow-[0_3px_0_#100020,0_0_12px_rgba(112,38,156,0.18)] transition hover:border-[#c026d3] hover:brightness-125 active:translate-y-[2px] active:shadow-none"
          >
            <span className="bg-gradient-to-b from-[#ffffff] via-[#e8c8ff] to-[#c026d3] bg-clip-text text-xl font-extrabold tracking-wide text-transparent drop-shadow-[0_2px_3px_rgba(192,38,211,0.5)] sm:text-2xl">
              লাইভ চ্যাট
            </span>
          </Link>
        </div>

        {/* গেম সেন্টার */}
        <div className="mb-4 border-l-[3px] border-[#c026d3] pl-3 text-lg font-bold tracking-wide text-[#e8c8ff]">
          গেম সেন্টার
        </div>

        {/* গেমের বিভাগসমূহ */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <div
              key={category}
              className="inline-flex h-8 items-center rounded-md border border-[#62218b] bg-gradient-to-b from-[#1e0835] to-[#100525] px-3 text-sm font-medium text-[#d9b5f5] transition hover:border-[#c026d3] hover:bg-[#31064e] hover:text-white"
            >
              {category}
            </div>
          ))}
        </div>

        {/* লোগো এবং বিবরণ */}
        <div className="mb-6 flex items-start gap-4 rounded-xl border border-[#351052] bg-[#0b031b] p-3">
          <Image
            src={logo_sq}
            alt="tk1111"
            className="h-[64px] w-[64px] shrink-0 rounded-xl border border-[#62218b] object-cover shadow-[0_0_12px_rgba(112,38,156,0.25)] sm:h-[72px] sm:w-[72px]"
          />

          <p className="text-xs leading-6 text-[#bda4d1]">
            tk1111.com ওয়েবসাইটটি একটি প্রতিষ্ঠানের মাধ্যমে পরিচালিত হয়।
            প্রতিষ্ঠানটি AE6427EQRW00034 লাইসেন্স নম্বরের অধীনে পরিচালিত
            এবং Gaming Services Provider N.V. দ্বারা নিয়ন্ত্রিত।
            প্রতিষ্ঠানটি কুরাসাও সরকারের অনুমোদিত 1668JAZ লাইসেন্সের
            অধীনে গেমিং সেবা প্রদান করে।
          </p>
        </div>

        {/* সামাজিক যোগাযোগ মাধ্যম */}
        <div className="mb-8 flex items-center gap-4">
          <a
            href="#"
            aria-label="ফেসবুক"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#351052] bg-[#100525] transition hover:border-[#c026d3] hover:bg-[#31064e]"
          >
            <img
              src="https://c.animaapp.com/m9cwtgo4xBXHVx/img/facebook.png"
              alt="ফেসবুক"
              className="h-[22px] w-[22px] object-contain"
            />
          </a>

          <a
            href="#"
            aria-label="টেলিগ্রাম"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#351052] bg-[#100525] transition hover:border-[#c026d3] hover:bg-[#31064e]"
          >
            <img
              src="https://c.animaapp.com/m9cwtgo4xBXHVx/img/telegram.png"
              alt="টেলিগ্রাম"
              className="h-[22px] w-[22px] object-contain"
            />
          </a>

          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#351052] bg-[#100525]">
            <img
              src="https://c.animaapp.com/m9cwtgo4xBXHVx/img/age-d182eefd-png.png"
              alt="বয়স সংক্রান্ত সীমাবদ্ধতা"
              className="h-[24px] w-[24px] object-contain"
            />
          </div>
        </div>

        {/* গেম প্রোভাইডার লোগো */}
        <div className="rounded-xl border border-[#351052] bg-[#0b031b] p-3">
          <div className="mb-3 text-sm font-bold uppercase tracking-wider text-[#cda4e9]">
            গেম সরবরাহকারী প্রতিষ্ঠান
          </div>

          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
            {providers.map((provider) => (
              <div
                key={provider}
                className="flex h-[38px] items-center justify-center rounded-md border border-[#28103e] bg-[#100525] p-1 transition hover:border-[#70269c] hover:bg-[#1e0835]"
              >
                <img
                  src={`https://c.animaapp.com/m9cwtgo4xBXHVx/img/${provider}-color-png.png`}
                  alt={`${provider} গেম সরবরাহকারী`}
                  className="max-h-[23px] max-w-full object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* কপিরাইট */}
        <div className="mt-6 border-t border-[#351052] pt-4 text-center text-[11px] text-[#806b96]">
          © {new Date().getFullYear()} tk1111.com। সর্বস্বত্ব সংরক্ষিত।
        </div>
      </div>
    </footer>
  );
};

export default Footer;