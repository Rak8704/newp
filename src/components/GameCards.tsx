
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
 

"use client";

import { NetEnt } from "@/types/game";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { LiaHeartSolid } from "react-icons/lia";
import { Loader } from "./loader/GameLoader";
import Link from "next/link";
import useGetCurrentUser from "@/hook/useCurrentUser";
import { getProviderDisplayName } from "@/lib/utils/providerUtils";
import { providers } from "../../data/api-providers";
import { LocalArrayStorage } from "@/lib/favorites";

const storage = LocalArrayStorage<string>();

interface GameCardWithProviderProps {
  game: NetEnt;
}

export const GameCardWithProvider = ({
  game,
}: GameCardWithProviderProps) => {
  const [imageLoaded, setImageLoad] = useState(false);
  const [isFav, setFav] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const user: any = useGetCurrentUser();

  const {
    img,
    name,
    title,
    id,
    game_code,
    product_code,
    game_type,
  } = game;

  // IMPORTANT: Only use the actual GSC+ game_code.
  // Never fall back to your internal database ID.
  const gameId = String(game_code ?? "").trim();
  const productCode = String(product_code ?? "").trim();
  const gameType = String(game_type ?? "").trim();

  const providerImage = providers.find(
    (provider) => provider.name === title
  )?.imageWhite;

  const providerDisplayName = getProviderDisplayName(title);

  const hasLaunchInfo = Boolean(
    gameId &&
      productCode &&
      /^\d+$/.test(productCode) &&
      gameType
  );

  const playUrl = hasLaunchInfo
    ? `/play?${new URLSearchParams({
        gameId,
        productCode,
        gameType,
      }).toString()}`
    : "/play";

  // Load game thumbnail.
  useEffect(() => {
    let cancelled = false;

    setLoaded(false);
    setImageLoad(false);

    if (!img || img === "NULL" || !String(img).trim()) {
      setImageSrc("/games/provider/default-game.png");
      setLoaded(true);
      return () => {
        cancelled = true;
      };
    }

    const image = new window.Image();

    image.onload = () => {
      if (cancelled) return;
      setImageSrc(String(img));
      setLoaded(true);
    };

    image.onerror = () => {
      if (cancelled) return;
      setImageSrc("/games/provider/default-game.png");
      setLoaded(true);
    };

    image.src = String(img);

    return () => {
      cancelled = true;
      image.onload = null;
      image.onerror = null;
    };
  }, [img]);

  // Restore favorite status.
  useEffect(() => {
    setFav(storage.exists("favorites-games", id));
  }, [id]);

  const handleAddToFav = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isFav) {
      storage.push("favorites-games", id);
      setFav(true);
    }
  };

  const handleOpenGame = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (!user) {
      event.preventDefault();
      window.location.href = "/login";
      return;
    }

    if (!hasLaunchInfo) {
      event.preventDefault();

      console.error("GSC+ launch information is missing:", {
        databaseId: id,
        game_code,
        product_code,
        game_type,
        game,
      });

      window.alert(
        "This game is missing GSC+ launch information. Please try another game."
      );
    }
  };

  if (!loaded || !imageSrc) {
    return <Loader />;
  }

  return (
    <div className="relative">
      <Link
        href={playUrl}
        onClick={handleOpenGame}
        className="relative game-main block overflow-hidden"
        aria-label={`Play ${name || "game"}`}
        aria-disabled={!hasLaunchInfo}
      >
        <div
          className={`relative overflow-hidden rounded-2xl ${
            imageLoaded ? "visible" : "invisible h-0"
          }`}
        >
          <div className="shiny-card w-full">
            <img
              alt={name || "Game image"}
              src={imageSrc}
              className="h-40 w-full rounded-2xl object-cover"
              onLoad={() => setImageLoad(true)}
              onError={() => {
                setImageSrc("/games/provider/default-game.png");
                setImageLoad(true);
              }}
            />
          </div>

          {providerImage && (
            <div className="game-card-provider-overllay absolute bottom-0 left-0 z-10 flex items-center justify-center rounded-2xl">
              <Image
                src={providerImage}
                alt={providerDisplayName}
                width={35}
                height={15}
                unoptimized
                className="h-auto w-[35px]"
                title={providerDisplayName}
              />
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-2">
          <h3 className="truncate text-xs text-white">
            {name || "Unknown game"}
          </h3>

          <span className="text-[10px] font-medium text-white/70">
            {providerDisplayName}
          </span>
        </div>
      </Link>

      <button
        type="button"
        onClick={handleAddToFav}
        aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={isFav}
        className="absolute right-2 top-2 z-10 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white/10"
      >
        <span
          className={`h-[15px] w-[15px] ${
            isFav ? "text-pink-500" : "text-white"
          }`}
        >
          <LiaHeartSolid className="h-full w-full" />
        </span>
      </button>
    </div>
  );
};
