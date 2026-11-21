
"use client";

import React from "react";
import slider_1 from "@/../public/slider/slider-1.jpg";
import slider_2 from "@/../public/slider/slider-2.jpg";
import slider_3 from "@/../public/slider/slider-3.png";
import slider_4 from "@/../public/slider/slider-4.png";
import slider_5 from "@/../public/slider/slider-5.png";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import { Pagination, Autoplay } from "swiper/modules";

type HeroSliderProps = {
  images: string[];
};

const HeroSlider = ({ images }: HeroSliderProps) => {
  const fallbackImages = [
    slider_1.src,
    slider_2.src,
    slider_3.src,
    slider_4.src,
    slider_5.src,
  ];

  const sliders = images.length > 0 ? images : fallbackImages;

  return (
    <div className="my-4">
      <Swiper
        spaceBetween={10}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={[Pagination, Autoplay]}
        className="mySwiper"
      >
        {sliders.map((image, index) => (
          <SwiperSlide key={`${image}-${index}`}>
            <img
              src={image}
              alt={`slider-${index + 1}`}
              className="w-full aspect-auto md:aspect-[9/3] object-cover rounded-2xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;
