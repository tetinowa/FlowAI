"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Home, Landmark, Megaphone, Settings, ShieldCheck } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { label: "Нүүр", icon: Home, href: "/" },
  { label: "Санхүү AI", icon: Landmark, href: "/finance" },
  { label: "Маркетинг AI", icon: Megaphone, href: "/marketing" },
  { label: "Тохиргоо", icon: Settings, href: "/settings" },
  { label: "Админ", icon: ShieldCheck, href: "/admin" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#5048e5] flex items-center justify-center text-white shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sidebar-foreground text-base font-bold leading-none">
              Flow AI
            </span>
            <span className="text-sidebar-foreground/50 text-xs font-medium">
              SaaS Insights
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(item.href + "/")}
                    className="data-[active=true]:bg-[#5048e5]/10 data-[active=true]:text-[#5048e5]"
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 p-2">
          <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden">
            <img
              src="https://i.pravatar.cc/32?img=47"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col overflow-hidden">
            <p className="text-xs font-bold truncate">Алекс Морган</p>
            <p className="text-[10px] text-sidebar-foreground/50 truncate">Про Данс</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
