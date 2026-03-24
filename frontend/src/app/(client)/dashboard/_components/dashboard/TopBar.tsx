"use client";

import { Search, Bell, HelpCircle, ChevronDown, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";

export function TopBar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 border-b border-border bg-background px-4 flex items-center justify-between z-10 shrink-0">
      <div className="flex items-center gap-3 w-full max-w-md">
        <SidebarTrigger />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground"
          aria-label="Мэдэгдэлүүд">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          aria-label="Тусламж">
          <HelpCircle className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          aria-label={
            theme === "dark"
              ? "Цайвар горим руу шилжих"
              : "Харанхуй горим руу шилжих"
          }
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          <Sun className="w-5 h-5 dark:hidden" />
          <Moon className="w-5 h-5 hidden dark:block" />
        </Button>
        <div className="h-8 w-px bg-border mx-2" />
        <UserButton />
        {/* <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-border">
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src="https://i.pravatar.cc/36?img=47"
            />
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div> */}
      </div>
    </header>
  );
}
