
"use client";

import React, { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { useForm, useWatch } from "react-hook-form";
import { RiCloseCircleLine } from "react-icons/ri";
import zod from "zod";
import { registerSchema } from "@/schema";

import Variant1 from "../icons/Variant2";

import { FaEyeSlash, FaEye } from "react-icons/fa6";
import { IoLockOpen } from "react-icons/io5";
import { FaUserAstronaut } from "react-icons/fa6";

import CheckInput from "./CheckInput";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { register } from "@/action/register";
import { toast } from "react-hot-toast";
import SpinLoader from "../loader/SpinLoader";

const RegisterForm = () => {
  const referId = useSearchParams().get("r") || "";

  const router = useRouter();

  const [pending, startTransition] = useTransition();

  const [passwordShow, setPasswordShow] = useState({
    password: false,
    confirmPassword: false,
  });

  const form = useForm<zod.infer<typeof registerSchema>>({
    defaultValues: {
      phone: "",
      password: "",
      confirmPassword: "",
      ageCheck: false,
      bonusCheck: false,
      referralId: referId,
    },
    resolver: zodResolver(registerSchema),
  });

  // Watch checkbox state so the button updates immediately.
  const ageCheck = useWatch({
    control: form.control,
    name: "ageCheck",
  });

  const handleRegister = (
    data: zod.infer<typeof registerSchema>
  ) => {
    if (!data.ageCheck) {
      toast.error("রেজিস্ট্রেশন করতে ১৮+ নিশ্চিত করতে হবে।");
      return;
    }

    startTransition(async () => {
      try {
        const res = await register(data);

        if (res && res.success) {
          toast.success("রেজিস্ট্রেশন সফল হয়েছে!");
          router.replace("/");
        } else if (res?.error) {
          toast.error(res.error);
        }
      } catch {
        toast.error("রেজিস্ট্রেশন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      }
    });
  };

  const inputClass = `
    w-full h-[62px]
    rounded-[5px]
    bg-[#222625]
    border border-transparent
    px-12 pr-12
    text-white text-[16px]
    outline-none
    placeholder:text-[#77838b]
    focus:border-[#087c5b]
    focus:ring-1 focus:ring-[#087c5b]
    transition-all duration-200
    disabled:opacity-50
  `;

  const iconClass =
    "absolute left-4 top-1/2 -translate-y-1/2 text-[#00a982]";

  const eyeClass =
    "absolute right-4 top-1/2 -translate-y-1/2 text-[#00a982]";

  return (
    <>
      <div className="w-full">

        {/* REGISTER HEADING */}

        <div className="mb-6">
          <h1 className="text-white text-[25px] font-bold mb-2">
            Register
          </h1>

          <p className="text-[#89969b] text-[14px]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#00b68c] font-bold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>

        {/* REGISTER FORM */}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleRegister)}
            className="w-full"
          >

            {/* PHONE NUMBER */}

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="mb-5 space-y-2">

                  <label className="block text-[16px] font-medium text-[#89969b]">
                    মোবাইল নম্বর
                  </label>

                  <FormControl>
                    <div className="relative">

                      <input
                        type="tel"
                        placeholder="আপনার মোবাইল নম্বর লিখুন"
                        autoComplete="tel"
                        disabled={pending}
                        {...field}
                        className={inputClass}
                      />

                      <div className={iconClass}>
                        <Variant1 className="w-[19px] h-[19px]" />
                      </div>

                      {field.value && (
                        <button
                          type="button"
                          onClick={() => field.onChange("")}
                          className={eyeClass}
                          aria-label="Clear phone"
                        >
                          <RiCloseCircleLine size={20} />
                        </button>
                      )}

                    </div>
                  </FormControl>

                  <FormMessage className="text-red-400 text-sm" />

                </FormItem>
              )}
            />

            {/* PASSWORD */}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-5 space-y-2">

                  <label className="block text-[16px] font-medium text-[#89969b]">
                    পাসওয়ার্ড
                  </label>

                  <FormControl>
                    <div className="relative">

                      <input
                        type={passwordShow.password ? "text" : "password"}
                        placeholder="আপনার পাসওয়ার্ড লিখুন"
                        autoComplete="new-password"
                        disabled={pending}
                        {...field}
                        className={inputClass}
                      />

                      <div className={iconClass}>
                        <IoLockOpen size={20} />
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setPasswordShow((state) => ({
                            ...state,
                            password: !state.password,
                          }))
                        }
                        className={eyeClass}
                        aria-label="Toggle password visibility"
                      >
                        {passwordShow.password ? (
                          <FaEye size={19} />
                        ) : (
                          <FaEyeSlash size={19} />
                        )}
                      </button>

                    </div>
                  </FormControl>

                  <FormMessage className="text-red-400 text-sm" />

                </FormItem>
              )}
            />

            {/* CONFIRM PASSWORD */}

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="mb-5 space-y-2">

                  <label className="block text-[16px] font-medium text-[#89969b]">
                    পাসওয়ার্ড নিশ্চিত করুন
                  </label>

                  <FormControl>
                    <div className="relative">

                      <input
                        type={
                          passwordShow.confirmPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="পাসওয়ার্ড আবার লিখুন"
                        autoComplete="new-password"
                        disabled={pending}
                        {...field}
                        className={inputClass}
                      />

                      <div className={iconClass}>
                        <IoLockOpen size={20} />
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setPasswordShow((state) => ({
                            ...state,
                            confirmPassword: !state.confirmPassword,
                          }))
                        }
                        className={eyeClass}
                        aria-label="Toggle confirm password visibility"
                      >
                        {passwordShow.confirmPassword ? (
                          <FaEye size={19} />
                        ) : (
                          <FaEyeSlash size={19} />
                        )}
                      </button>

                    </div>
                  </FormControl>

                  <FormMessage className="text-red-400 text-sm" />

                </FormItem>
              )}
            />

            {/* REFERRAL ID */}

            <FormField
              control={form.control}
              name="referralId"
              render={({ field }) => (
                <FormItem className="mb-5 space-y-2">

                  <label className="block text-[16px] font-medium text-[#89969b]">
                    রেফারেল আইডি{" "}
                    <span className="text-[#68777b] text-sm">
                      (ঐচ্ছিক)
                    </span>
                  </label>

                  <FormControl>
                    <div className="relative">

                      <input
                        type="text"
                        placeholder="Referral ID (Optional)"
                        disabled={pending}
                        {...field}
                        className={inputClass}
                      />

                      <div className={iconClass}>
                        <FaUserAstronaut size={19} />
                      </div>

                    </div>
                  </FormControl>

                  <FormMessage className="text-red-400 text-sm" />

                </FormItem>
              )}
            />

            {/* CHECKBOX OPTIONS */}

            <div className="my-5 flex flex-col gap-4">

              {/* AGE + TERMS */}

              <div className="rounded-lg border border-[#174a3b] bg-[#101b17] p-4">

                <CheckInput
                  onChecked={(checked) => {
                    form.setValue("ageCheck", checked, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                  label="I am over 18 years of age and have read and accepted Terms & Conditions, Privacy Policy & Betting Rules as published on the site."
                />

                <p className="text-[#748780] text-[11px] leading-5 mt-3 ml-7">
                  By registering, you confirm that you meet the minimum
                  legal age requirement and agree to the published policies.
                </p>

                <FormMessage className="text-red-400 text-xs mt-2">
                  {form.formState.errors.ageCheck?.message}
                </FormMessage>

              </div>

              {/* PROMOTIONAL OFFERS */}

              <div className="rounded-lg border border-[#303936] bg-[#111513] p-4">

                <CheckInput
                  onChecked={(checked) => {
                    form.setValue("bonusCheck", checked, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                  label="I would like to receive details of special offers, free bets and other promotions."
                />

                <p className="text-[#748780] text-[11px] leading-5 mt-3 ml-7">
                  You can choose whether to receive promotional updates.
                </p>

              </div>

            </div>

            {/* REGISTER BUTTON */}

            <button
              type="submit"
              disabled={pending || !ageCheck}
              className="
                mt-3
                w-full h-[62px]
                rounded-[5px]
                bg-[#07513e]
                hover:bg-[#087354]
                active:scale-[0.99]
                disabled:!bg-[#ffffff0e]
                disabled:!text-white/30
                disabled:cursor-not-allowed
                text-white
                text-[19px]
                font-bold
                transition-all duration-200
              "
            >
              {pending ? "রেজিস্ট্রেশন হচ্ছে..." : "Register"}
            </button>

            {/* LOGIN LINK */}

            <div className="text-center mt-6">
              <p className="text-[#89969b] text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#00b68c] font-bold hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>

          </form>
        </Form>

        {/* LOADER */}

        {pending && <SpinLoader />}

      </div>
    </>
  );
};

export default RegisterForm;
