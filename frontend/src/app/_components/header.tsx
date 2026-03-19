"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Header = () => {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(5, 11, 21, 0.80)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0, 212, 255, 0.08)",
      }}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
            style={{
              background: "linear-gradient(135deg, #00D4FF, #0090CC)",
              boxShadow: "0 0 20px rgba(0, 212, 255, 0.4)",
              color: "#050B15",
              fontFamily: "Syne, sans-serif",
            }}
          >
            ✦
          </div>
          <span
            className="font-bold text-lg"
            style={{ color: "#E8F4FF", fontFamily: "Syne, sans-serif", letterSpacing: "-0.02em" }}
          >
            FlowAI
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {["Онцлог", "Үнэ", "Холбоо барих"].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-sm transition-colors"
              style={{ color: "#6B8BAE", fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <Button
                className="rounded-xl text-sm font-semibold"
                style={{
                  background: "linear-gradient(135deg, #00D4FF, #0090CC)",
                  color: "#050B15",
                  boxShadow: "0 0 20px rgba(0, 212, 255, 0.25)",
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                }}
              >
                Эхлэх
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="rounded-xl text-sm"
                style={{
                  borderColor: "rgba(0, 212, 255, 0.2)",
                  color: "#E8F4FF",
                  background: "transparent",
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                }}
              >
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
