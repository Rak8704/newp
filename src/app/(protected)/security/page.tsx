
"use client";

import CircleProgress from "@/components/loader/Progress";
import SiteHeader from "@/components/SiteHeader";
import React, { useTransition } from "react";
import boost from "@/../public/energetic.png";
import Image from "next/image";
import Link from "next/link";
import Profile from "@/components/icons/profile";
import { IoIosArrowForward } from "react-icons/io";

import Power from "@/components/icons/power";
import Lock from "@/components/icons/lock";
import { logout } from "@/action/logout";
import toast from "react-hot-toast";
import SpinLoader from "@/components/loader/SpinLoader";
import PaymentLock from "@/components/icons/payment-lock";

const Securiry = () => {
  const [pending, startTr] = useTransition();

  const handleLogout = () => {
    logout().then((res) => {
      startTr(() => {
        if (res && res.success) {
          location.reload();
        } else if (res.error) {
          toast.error(res.error);
        }
      });
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <SiteHeader title="নিরাপত্তা কেন্দ্র" />

      <div className="px-4 py-7">
        <div className="bg-white rounded-md shadow-md flex items-center gap-4 p-3">
          <div>
            <CircleProgress />
          </div>

          <div>
            <h3 className="bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent font-bold text-xl">
              নিরাপত্তার মাত্রা: উচ্চ
            </h3>

            <div className="flex items-center gap-2 mt-2">
              <Image src={boost} alt="নিরাপত্তা" className="w-8" />
              <Image src={boost} alt="নিরাপত্তা" className="w-8" />
              <Image src={boost} alt="নিরাপত্তা" className="w-8" />
              <Image src={boost} alt="নিরাপত্তা" className="w-8" />
              <Image src={boost} alt="নিরাপত্তা" className="w-8" />
            </div>
          </div>
        </div>

        <div className="mt-8">
          {/* ব্যক্তিগত তথ্য */}
          <Link
            href="/my-account"
            className="flex items-center justify-between border-b-2 py-2 bg-white rounded-sm shadow-sm"
          >
            <div className="flex justify-center w-[20%]">
              <Profile />
            </div>

            <div className="flex items-center justify-between w-[80%]">
              <div>
                <p className="text-lg text-black font-medium">
                  ব্যক্তিগত তথ্য
                </p>

                <span className="text-gray-500 text-sm">
                  ব্যক্তিগত তথ্য সম্পূর্ণ করুন
                </span>
              </div>

              <div>
                <IoIosArrowForward className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </Link>

          {/* লগইন পাসওয়ার্ড */}
          <Link
            href="/security/password"
            className="flex items-center justify-between border-b-2 py-2 bg-white rounded-sm shadow-sm"
          >
            <div className="flex justify-center w-[20%]">
              <Lock />
            </div>

            <div className="flex items-center justify-between w-[80%]">
              <div>
                <p className="text-lg text-black font-medium">
                  লগইন পাসওয়ার্ড পরিবর্তন
                </p>

                <span className="text-gray-500 text-sm max-w-[120px]">
                  অক্ষর ও সংখ্যার সমন্বয়ে পাসওয়ার্ড তৈরি করুন
                </span>
              </div>

              <div>
                <IoIosArrowForward className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </Link>

          {/* উত্তোলন পাসওয়ার্ড */}
          <Link
            href="/security/withdraw-password"
            className="flex items-center justify-between border-b-2 py-2 bg-white rounded-sm shadow-sm"
          >
            <div className="flex justify-center w-[20%]">
              <PaymentLock />
            </div>

            <div className="flex items-center justify-between w-[80%]">
              <div>
                <p className="text-lg text-black font-medium">
                  উত্তোলন পাসওয়ার্ড পরিবর্তন
                </p>

                <span className="text-gray-500 text-sm max-w-[120px]">
                  অক্ষর ও সংখ্যার সমন্বয়ে পাসওয়ার্ড তৈরি করুন
                </span>
              </div>

              <div>
                <IoIosArrowForward className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </Link>

          {/* লগআউট */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between border-b-2 py-2 bg-white rounded-sm shadow-sm"
          >
            <div className="flex justify-center w-[20%]">
              <Power />
            </div>

            <div className="flex items-center justify-between w-[80%]">
              <div>
                <p className="text-lg text-black font-medium text-start">
                  লগআউট
                </p>

                <span className="text-gray-500 text-sm">
                  নিরাপদে লগআউট করুন
                </span>
              </div>

              <div>
                <IoIosArrowForward className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </button>
        </div>
      </div>

      {pending && <SpinLoader />}
    </div>
  );
};

export default Securiry;
