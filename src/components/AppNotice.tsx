
import Image from "next/image";
import React from "react";

import notice from "@/../public/icons/notice.png";
import Marquee from "react-fast-marquee";

const AppNotice = () => {
  return (
    <div className="px-1">
      <div className="flex h-8 w-full items-center gap-2 overflow-hidden rounded-full border border-[#65238e] bg-gradient-to-r from-[#100321] via-[#24063d] to-[#100321] px-3 shadow-[0_1px_0_#3d125c]">

        {/* Notice Icon */}
        <Image
          src={notice}
          alt="Notice"
          width={18}
          height={18}
          className="h-[18px] w-[18px] shrink-0 object-contain"
        />

        {/* Marquee */}
        <div className="min-w-0 flex-1 overflow-hidden">
          <Marquee speed={40} pauseOnHover gradient={false}>
            <p className="whitespace-nowrap text-[13px] font-medium text-[#e8c8ff]">
              TK1111 🌟 আপনার প্রথম ডিপোজিটে ৫০% বোনাস পান! 🎉
            </p>
          </Marquee>
        </div>
      </div>
    </div>
  );
};

export default AppNotice;
