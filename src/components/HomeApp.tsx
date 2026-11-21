
import React from "react";
import { db } from "@/lib/db";
import AppNotice from "./AppNotice";
import AppMenuItems from "./AppMenuItems";
import SlotGames from "./SlotsGames";
import HotGames from "./HotGames";
import LiveCasino from "./LiveCasino";
import Sports from "./Sports";
import ESports from "./E-Sports";
import HeroSliderWrapper from "./HeroSliderWrapper";

const HomeApp = async () => {
  const siteSettings = await db.siteSetting.findFirst({
    select: {
      sliderImages: true,
    },
  });

  const sliderImages = (siteSettings?.sliderImages ?? []).filter(
    (image): image is string =>
      typeof image === "string" && image.trim().length > 0
  );

  return (
    <div className="app p-3">
      <AppNotice />
      <HeroSliderWrapper images={sliderImages} />
      <AppMenuItems />
      <HotGames />
      <SlotGames />
      <ESports />
      <Sports />
      <LiveCasino />
    </div>
  );
};

export default HomeApp;
