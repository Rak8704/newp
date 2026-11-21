
"use client";

import AppHeader from "@/components/AppHeader";
import React from "react";
import { SportsCard, sportsData } from "@/components/Sports";
import SideNavLayout from "@/components/SideNavLayout";

const ESportsPage = () => {
  return (
    <SideNavLayout>
      <div className="min-h-screen bg-[#020018]">
        <AppHeader title="Sports" />

        <main className="min-h-screen bg-gradient-to-b from-[#020018] via-[#100525] to-[#080014] px-2 py-5 sm:px-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {sportsData.map((s, i) => (
              <SportsCard
                key={i}
                image={s.image}
                redirect={s.redirect}
              />
            ))}
          </div>
        </main>
      </div>
    </SideNavLayout>
  );
};

export default ESportsPage;
