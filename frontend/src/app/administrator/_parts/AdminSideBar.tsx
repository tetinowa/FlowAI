"use client";

import {
  LayoutDashboard,
  Building2,
  Users,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { useAdmin } from "../provider/adminProvider";
import { ReactNode, useState } from "react";

export function AdminSideBar({ children }: { children: ReactNode }) {
  const { showSideBar, setShowSideBar } = useAdmin();
  return (
    <div
      onMouseEnter={() => {
        setShowSideBar(true);
      }}
      onMouseLeave={() => {
        setShowSideBar(false);
      }}
      className="w-12 hover:w-60 ease-in-out duration-300 h-screen bg-gray-600 color-white text-white  shrink-0"
    >
      <div className="flex items-center gap-3 shrink-0 absolute top-5 left-2">
        <div className="w-8 h-8 rounded-lg bg-[#5048e5] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4 text-white" />
        </div>
        <div className={`flex flex-col px-5 ${showSideBar ? "" : "hidden"}`}>
          <span className="text-sm font-bold leading-none">Super Admin</span>
          <span className="text-[11px] text-muted-foreground mt-0.5">
            Flow AI
          </span>
        </div>
      </div>

      <div className="flex-1 px-3 py-4 absolute top-15">{children}</div>
    </div>
  );
}
