
"use client";

import dynamic from "next/dynamic";

const HeroSlider = dynamic<{ images: string[] }>(
  () => import("./HeroSlider"),
  { ssr: false }
);

const HeroSliderWrapper = ({ images }: { images: string[] }) => {
  return <HeroSlider images={images} />;
};

export default HeroSliderWrapper;
