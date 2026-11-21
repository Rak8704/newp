
"use client";

import SecondaryButton from "@/components/buttons/SecondaryButton";
import GameOpeningLoader from "@/components/loader/GameOpeningLoader";
import useGetCurrentUser from "@/hook/useCurrentUser";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Play() {
  const router = useRouter();
  const sp = useSearchParams();
  const user = useGetCurrentUser();

  const gameId = (
    sp.get("gameId") ||
    sp.get("game_code") ||
    ""
  ).trim();

  const productCode = (
    sp.get("productCode") ||
    sp.get("product_code") ||
    ""
  ).trim();

  // Do not assume SLOT; GSC+ games may use OTHER or another type.
  const gameType = (
    sp.get("gameType") ||
    sp.get("game_type") ||
    ""
  ).trim();

  const [loading, setLoading] = useState(true);
  const [iframe, setIframe] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    if (!gameId || !productCode || !gameType) {
      setError(
        "Game information is incomplete. Required: gameId, productCode and gameType."
      );
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function launchGame() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/gsc/launch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gameCode: gameId,
            productCode: Number(productCode),
            gameType,
            platform: "WEB",
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.error ||
              data.message ||
              `Game launch failed (HTTP ${response.status})`
          );
        }

        const launchUrl = data.url || data.launch_url;

        if (
          typeof launchUrl !== "string" ||
          !/^https?:\/\//i.test(launchUrl)
        ) {
          throw new Error(
            data.error || "The launch API did not return a valid game URL."
          );
        }

        if (!cancelled) {
          setIframe(launchUrl);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to launch game"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void launchGame();

    return () => {
      cancelled = true;
    };
  }, [user, router, gameId, productCode, gameType]);

  return (
    <div className="h-screen w-full">
      {loading && !error && <GameOpeningLoader />}

      {!loading && !error && iframe && (
        <iframe
          src={iframe}
          title="Game"
          className="h-full w-full border-0"
          allowFullScreen
        />
      )}

      {error && (
        <div className="flex h-screen w-full items-center justify-center">
          <div className="w-[350px] rounded-xl bg-white p-6">
            <h3 className="text-2xl font-semibold">Error</h3>
            <p className="mt-2 break-words text-sm">{error}</p>
            <Link href="/" className="mt-4 inline-block">
              <SecondaryButton>Go Home</SecondaryButton>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
