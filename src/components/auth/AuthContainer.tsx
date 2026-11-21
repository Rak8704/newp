import React from "react";
import Link from "next/link";
import logo from "@/../public/logo.png";
import Image from "next/image";

interface AuthContainerProps {
  title: string;
  formRedirectText: string;
  formRedirectLink: string;
  formRedirectLinkPlaceholder: string;
  children: React.ReactNode;
}

const AuthContainer = ({
  formRedirectText,
  formRedirectLink,
  formRedirectLinkPlaceholder,
  children,
  title,
}: AuthContainerProps) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#090414] via-[#1a0733] to-[#2d0b50]">

      {/* Purple Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[180px] left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-purple-600/25 blur-[130px]" />

        <div className="absolute -left-[150px] top-[30%] h-[300px] w-[300px] rounded-full bg-violet-600/20 blur-[120px]" />

        <div className="absolute -right-[150px] bottom-[5%] h-[350px] w-[350px] rounded-full bg-fuchsia-600/20 blur-[130px]" />

        <div className="absolute bottom-[-200px] left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-purple-800/20 blur-[140px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen w-full">

        {/* Logo */}
        <div className="flex justify-center pt-12 pb-4">
          <Image
            src={logo}
            alt="Logo"
            priority
            className="h-auto w-[100px] drop-shadow-[0_0_20px_rgba(168,85,247,0.35)]"
          />
        </div>

        {/* Title */}
        <div className="mb-2 flex flex-col items-center px-4">
          <h4 className="mb-3 text-center text-xl font-bold text-[#e9b5ff] drop-shadow-[0_0_10px_rgba(168,85,247,0.25)]">
            {title}
          </h4>

          {/* Redirect Link */}
          <p className="mt-3 text-center text-sm text-white/80">
            {formRedirectText}{" "}
            <Link
              href={formRedirectLink}
              className="font-semibold text-purple-300 transition-colors hover:text-fuchsia-300 hover:underline"
            >
              {formRedirectLinkPlaceholder}
            </Link>
          </p>
        </div>

        {/* Form */}
        <div className="mx-auto mt-8 w-[90%] max-w-[400px] pb-10">
          {children}
        </div>

      </div>
    </div>
  );
};

export default AuthContainer;