"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Layers2,
  LayoutDashboard,
  Settings,
  ShieldUser,
  TableProperties,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
const navItems = [
  { label: "Хяналтын Сбмбр", icon: LayoutDashboard, href: "/administrator/dashboard" },
  { label: "Компаниуд", icon: TableProperties, href: "/administrator/companies" },
  { label: "Хэрэглэгчид", icon: Users, href: "/administrator/users" },
  { label: "Админ", icon: ShieldUser, href: "/administrator/about-me" },
  { label: "Тохиргоо", icon: Settings, href: "/administrator/settings" },
];
export function ControlSideBar() {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#5048e5] flex items-center justify-center text-white shrink-0">
            <Layers2 className="w-5 h-5" />
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
      <SidebarContent className={`lg:p-4 p-2`}>
        {navItems.map((item, i) => (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton
              asChild
              isActive={
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href ||
                    pathname.startsWith(item.href + "/")
              }
              className="data-[active=true]:bg-[#5048e5]/10 data-[active=true]:text-[#5048e5]"
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
