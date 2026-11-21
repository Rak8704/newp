
"use client";

import SecondaryButton from "@/components/buttons/SecondaryButton";
import GameOpeningLoader from "@/components/loader/GameOpeningLoader";

import { useOpenGameMutation } from "@/lib/features/gamesApiSlice";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Sportss = () => {
  const [openGame, { isLoading }] = useOpenGameMutation();
  const [isIframeLoading, setIsLoading] = useState(true);
  const [iframe, setIframe] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    openGame({ gameId: "3000" })
      .unwrap()
      .then((res) => {
        if (res) {
          const url = res.content.game.url;
          const iframeMode = res.content.game.iframe;

          if (iframeMode == "0") {
            location.href = url;
          } else {
            console.log("url ", url);
            setIframe(url);
          }
        }
      })
      .catch((error) => {
        console.log("Opend game error ", error);
        setError(true);
      });
  }, [openGame]);

  return (
    <div className="min-h-screen bg-[#020018]">
      {(isLoading || isIframeLoading) && <GameOpeningLoader />}

      {!isLoading && !error && iframe && (
        <div className="h-screen w-full overflow-hidden bg-[#020018]">
          <iframe
            src={iframe}
            onLoad={() => setIsLoading(false)}
            className="h-full w-full rounded-b-lg border-0"
            allowFullScreen
          />
        </div>
      )}

      {!isLoading && error && (
        <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-[#020018] via-[#100525] to-[#080014] px-4">
          <div className="w-[280px] overflow-hidden rounded-xl border border-[#70269c] bg-gradient-to-b from-[#150329] to-[#080014] shadow-[0_8px_30px_rgba(112,38,156,0.25)] md:w-[320px] lg:w-[350px]">

            <div className="w-full border-b border-[#70269c] bg-gradient-to-r from-[#70269c] to-[#351052] px-6 py-5">
              <div className="mb-2 text-3xl text-[#f0abfc]">
                !
              </div>

              <h3 className="text-2xl font-bold text-white">
                Error
              </h3>

              <p className="mt-2 text-sm font-medium tracking-wide text-[#e8c8ff]">
                Sports is not available
              </p>
            </div>

            <div className="flex justify-end p-4">
              <Link href="/" className="mt-2">
                <SecondaryButton>Go Home</SecondaryButton>
              </Link>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Sportss;
