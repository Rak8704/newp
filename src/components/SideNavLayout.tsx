
import React from "react";
import SideNav from "./SideNav";

const SideNavLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#020018]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-0 z-40 h-screen w-[245px] lg:w-[250px]">
        <SideNav />
      </aside>

      {/* Main Content */}
      <main className="min-h-screen w-full bg-[#020018] md:ml-[245px] md:w-[calc(100%-250px)] lg:ml-[270px] lg:w-[calc(100%-270px)]">
        {children}
      </main>
    </div>
  );
};

export default SideNavLayout;
