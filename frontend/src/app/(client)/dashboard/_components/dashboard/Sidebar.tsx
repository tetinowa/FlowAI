"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Home,
  Landmark,
  Megaphone,
  Settings,
  ShieldCheck,
  CreditCard,
  Receipt,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
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
  { label: "Нүүр", icon: Home, href: "/dashboard" },
  { label: "Санхүү AI", icon: Landmark, href: "/finance" },
  { label: "Маркетинг AI", icon: Megaphone, href: "/marketing" },
  { label: "Татварын тайлан", icon: Receipt, href: "/tax" },
  { label: "Тариф & Төлбөр", icon: CreditCard, href: "/billing" },
  { label: "Тохиргоо", icon: Settings, href: "/settings" },
  { label: "Админ", icon: ShieldCheck, href: "/admin" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const fullName = user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "";
  const planName = (user?.publicMetadata?.plan as string) ?? "";

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
                    isActive={
                      item.href === "/"
                        ? pathname === "/"
                        : pathname === item.href ||
                          pathname.startsWith(item.href + "/")
                    }
                    className="data-[active=true]:bg-[#5048e5]/10 data-[active=true]:text-[#5048e5]">
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
          <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden bg-[#5048e5] flex items-center justify-center text-white text-xs font-bold">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{(user?.firstName?.[0] ?? user?.emailAddresses?.[0]?.emailAddress?.[0] ?? "?").toUpperCase()}</span>
            )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <p className="text-xs font-bold truncate">{fullName || user?.emailAddresses?.[0]?.emailAddress}</p>
            <p className="text-[10px] text-sidebar-foreground/50 truncate">
              {planName || user?.emailAddresses?.[0]?.emailAddress}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
