"use client";

import { useEffect, useState } from "react";
import { Lobby } from "../_parts/Lobby";
import { Companies } from "../_parts/Companies";
import { Clients } from "../_parts/Clients";
import { Sales } from "../_parts/Sales";
import { LayoutDashboard, BadgeCent, Building2, Users } from "lucide-react";
import { useAdmin } from "../provider/adminProvider";
import { AdminSideBar } from "../_parts/AdminSideBar";
type DisplayTypes = "Lobby" | "Companies" | "Clients" | "Sales";
import { ShieldCheck } from "lucide-react";
const navItems = [
  { ref: "Lobby", label: "Lobby", icon: LayoutDashboard },
  { ref: "Companies", label: "Companies", icon: Building2 },
  { ref: "Clients", label: "Clients", icon: Users },
  { ref: "Sales", label: "Sales", icon: BadgeCent },
];

export default function MainPage() {
  const { companies } = useAdmin();
  const { showSideBar } = useAdmin();
  const [active, setActive] = useState<DisplayTypes>("Lobby");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const RenderContent = () => {
    switch (active) {
      case "Lobby":
        return <Lobby />;
      case "Clients":
        return <Clients />;
      case "Companies":
        return <Companies />;
      case "Sales":
        return <Sales />;
      default:
        return <Lobby />;
    }
  };
  return (
    <div className={`flex gap-2 `}>
      <AdminSideBar>
        <div className={`w-fit h-screen flex flex-col py-5 gap-5`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={`flex gap-5 py-2 w-full ease-in-out duration-300 hover:bg-gray-700/50 rounded-xl hover:px-2`}
                key={item.ref}
                onClick={() => setActive(item.ref as DisplayTypes)}
              >
                <Icon />
                {showSideBar && <p className={` rounded-2xl  ease-in-out hover:scale-110 hover:duration-300`}>{item.label}</p>}
              </button>
            );
          })}
        </div>
      </AdminSideBar>

      <RenderContent />
    </div>
  );
}
