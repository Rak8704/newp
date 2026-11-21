
"use client";

import AppHeader from "@/components/AppHeader";
import React from "react";
import SideNavLayout from "@/components/SideNavLayout";
import { SportsContainer } from "@/components/sports/SportsContainer";

const Sports = () => {
  return (
    <SideNavLayout>
      <div className="min-h-screen bg-[#020018]">
        <AppHeader title="Sports Betting" />

        <main className="min-h-screen bg-gradient-to-b from-[#020018] via-[#100525] to-[#080014] px-2 py-5 sm:px-4">
          <SportsContainer />
        </main>
      </div>
    </SideNavLayout>
  );
};

export default Sports;
