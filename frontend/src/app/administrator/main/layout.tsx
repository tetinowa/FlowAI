"use client";
import { AdminProvider } from "../provider/adminProvider";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <div className={` no-scrollbar w-screen h-screen shrink-0`}>
        {children}
      </div>
    </AdminProvider>
  );
}
