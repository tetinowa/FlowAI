"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppSidebar } from "./dashboard/_components/dashboard/Sidebar";
import { TopBar } from "./dashboard/_components/dashboard/TopBar";
import ChatBubble from "@/app/_components/ChatBubble";

/**
 * Layout component that enforces onboarding completion and renders the dashboard shell.
 *
 * When user data finishes loading, redirects users whose `publicMetadata.onboardingComplete`
 * is falsy to "/onboarding". While loading or when onboarding is incomplete, renders `null`.
 *
 * @param children - The page content to render inside the dashboard layout
 * @returns The dashboard layout containing the sidebar and top bar with `children`, or `null` if the user is not ready or not onboarded
 */
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!user?.publicMetadata?.onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user?.publicMetadata?.onboardingComplete) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopBar />
        {children}
      </SidebarInset>
      <div className="fixed bottom-6 right-6 z-50">
        <ChatBubble />
      </div>
    </SidebarProvider>
  );
}
