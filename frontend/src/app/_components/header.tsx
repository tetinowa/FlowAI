"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ChatBubble from "./ChatBubble";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white backdrop-blur-sm">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#5048e5] flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg text-black">FlowAI</span>
        </Link>

        <div className="flex items-center gap-3">
          <ChatBubble />
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="bg-[#5048e5] hover:bg-[#4038d4] text-white rounded-xl">
                Эхлэх
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard">
              <Button variant="outline" className="rounded-xl text-black">
                Dashboard
              </Button>
            </Link>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};
