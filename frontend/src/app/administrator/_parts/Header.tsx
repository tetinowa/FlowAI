"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { theme } = useTheme();
  return (
    <div className="w-full min-h-10 lg:p-5 text-bold p-2 flex justify-between">
      <SidebarTrigger /> {/* 👈 this button toggles sidebar open/close */}
      <p className={`text-xl font-bold`}>Admin Control Panel</p>
      <Button className="bg-[#4038d4] rounded-2xl">Add Organization +</Button>
        
    </div>
  );
}
