
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { updateProfile } from "@/action/account";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useCurrentUser from "@/hook/useCurrentUser";
import { accountUpdateSchema, AccountUpdateSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const MyAccount = () => {
  const user: any = useCurrentUser();
  const [pending, startTr] = useTransition();

  const form = useForm<AccountUpdateSchema>({
    defaultValues: {
      facebook: user!.facebook || "",
      name: user!.name || "Pro User",
      phone: user!.phone || "",
    },
    resolver: zodResolver(accountUpdateSchema),
  });

  const handleUpdate = (data: AccountUpdateSchema) => {
    startTr(() => {
      updateProfile(data).then((res) => {
        if (res.error) {
          toast.error(res.error);
        } else if (res && res.success) {
          toast.success("তথ্য সফলভাবে আপডেট হয়েছে");
        }
      });
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader title="আমার অ্যাকাউন্ট" />

      <div className="px-5 py-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdate)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ব্যবহারকারীর নাম</FormLabel>
                  <FormControl>
                    <Input
                      disabled={pending}
                      type="text"
                      {...field}
                      placeholder="ব্যবহারকারীর নাম"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="playerid"
              render={() => (
                <FormItem>
                  <FormLabel>প্লেয়ার আইডি</FormLabel>
                  <FormControl>
                    <Input
                      readOnly
                      disabled
                      value={"932745783"}
                      type="number"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>মোবাইল নম্বর</FormLabel>
                  <FormControl>
                    <Input
                      disabled={pending}
                      type="text"
                      {...field}
                      placeholder="মোবাইল নম্বর"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ফেসবুক</FormLabel>
                  <FormControl>
                    <Input
                      disabled={pending}
                      type="text"
                      {...field}
                      placeholder="আপনার ফেসবুক লিংক"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Link
              href="/security"
              className="my-3 block text-sm font-medium text-[#d946ef] underline decoration-[#a855f7] underline-offset-4 transition hover:text-[#f0abfc] hover:decoration-[#f0abfc]"
            >
              অ্যাকাউন্টের নিরাপত্তা যাচাই করুন
            </Link>

            <Button
              disabled={pending}
              className="mt-3 w-full rounded-sm border border-[#d946ef] bg-gradient-to-b from-[#c026d3] to-[#70269c] text-white shadow-[0_3px_0_#351052] transition-all hover:brightness-125 active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              জমা দিন
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default MyAccount;
