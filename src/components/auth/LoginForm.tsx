
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
import { useForm } from "react-hook-form";
import { RiCloseCircleLine } from "react-icons/ri";
import zod from "zod";
import { loginSchema } from "@/schema";
import Variant1 from "../icons/Variant2";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import { IoLockOpen } from "react-icons/io5";
import { login } from "@/action/login";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import SpinLoader from "../loader/SpinLoader";

const LoginForm = () => {
  const [pending, startTransition] = useTransition();
  const [passwordShow, setPasswordShow] = useState(false);

  const router = useRouter();
  const customRedirect = useSearchParams().get("redirect") || "";

  const form = useForm<zod.infer<typeof loginSchema>>({
    defaultValues: {
      phone: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = (data: zod.infer<typeof loginSchema>) => {
    startTransition(async () => {
      try {
        const res = await login(data);

        if (res?.success) {
          router.replace(customRedirect || "/");
          router.refresh();
        } else if (res?.error) {
          toast.error(res.error);
        }
      } catch {
        toast.error("লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      }
    });
  };

  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-[#1a0b2e] via-[#2b1050] to-[#160824] p-5 sm:p-7 border border-purple-500/20 shadow-[0_0_35px_rgba(139,92,246,0.12)]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleLogin)}
          className="w-full space-y-0"
        >
          {/* PHONE */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="mb-5 space-y-2">
                <label className="block text-[15px] sm:text-[16px] font-medium text-[#c4b5fd]">
                  মোবাইল নম্বর
                </label>

                <FormControl>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="আপনার মোবাইল নম্বর লিখুন"
                      disabled={pending}
                      autoComplete="tel"
                      {...field}
                      className="
                        w-full h-[58px] sm:h-[64px]
                        rounded-xl
                        bg-[#120922]
                        border border-[#43216b]
                        px-12 pr-12
                        text-white text-[16px]
                        outline-none
                        placeholder:text-[#827394]
                        focus:border-[#a855f7]
                        focus:ring-2 focus:ring-[#8b42ff]/20
                        transition-all duration-200
                        disabled:opacity-50
                      "
                    />

                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b65cff]">
                      <Variant1 className="w-5 h-5" />
                    </div>

                    {field.value && !pending && (
                      <button
                        type="button"
                        onClick={() =>
                          form.setValue("phone", "", {
                            shouldValidate: true,
                          })
                        }
                        className="
                          absolute right-4 top-1/2
                          -translate-y-1/2
                          text-[#a78bca]
                          hover:text-[#e879f9]
                          transition-colors
                        "
                        aria-label="Clear phone number"
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
              <FormItem className="mb-4 space-y-2">
                <label className="block text-[15px] sm:text-[16px] font-medium text-[#c4b5fd]">
                  পাসওয়ার্ড
                </label>

                <FormControl>
                  <div className="relative">
                    <input
                      type={passwordShow ? "text" : "password"}
                      placeholder="আপনার পাসওয়ার্ড লিখুন"
                      disabled={pending}
                      autoComplete="current-password"
                      {...field}
                      className="
                        w-full h-[58px] sm:h-[64px]
                        rounded-xl
                        bg-[#120922]
                        border border-[#43216b]
                        px-12 pr-12
                        text-white text-[16px]
                        outline-none
                        placeholder:text-[#827394]
                        focus:border-[#a855f7]
                        focus:ring-2 focus:ring-[#8b42ff]/20
                        transition-all duration-200
                        disabled:opacity-50
                      "
                    />

                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b65cff]">
                      <IoLockOpen size={20} />
                    </div>

                    <button
                      type="button"
                      onClick={() => setPasswordShow((prev) => !prev)}
                      className="
                        absolute right-4 top-1/2
                        -translate-y-1/2
                        text-[#a78bca]
                        hover:text-[#e879f9]
                        transition-colors
                      "
                      aria-label={
                        passwordShow ? "Hide password" : "Show password"
                      }
                    >
                      {passwordShow ? (
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

          {/* FORGOT PASSWORD */}
          <div className="flex justify-end mb-6">
            <a
              href="/forgot-password"
              className="
                text-[#c084fc]
                text-[14px] sm:text-[15px]
                font-medium
                underline underline-offset-4
                hover:text-[#e879f9]
                transition-colors
              "
            >
              পাসওয়ার্ড ভুলে গেছেন?
            </a>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={pending}
            className="
              w-full h-[58px] sm:h-[64px]
              rounded-xl
              bg-gradient-to-r from-[#6d28d9] via-[#9333ea] to-[#7e22ce]
              hover:from-[#7c3aed] hover:via-[#a855f7] hover:to-[#9333ea]
              active:scale-[0.98]
              disabled:opacity-50
              disabled:cursor-not-allowed
              text-white
              text-[17px] sm:text-[18px]
              font-bold
              border border-[#a855f7]/30
              shadow-[0_0_18px_rgba(139,66,255,0.20)]
              transition-all duration-200
            "
          >
            {pending ? "লগইন হচ্ছে..." : "লগইন"}
          </button>
        </form>
      </Form>

      {pending && <SpinLoader />}
    </div>
  );
};

export default LoginForm;
