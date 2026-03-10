
"use client"

import { Header } from "@/app/_components/header";
import Hero from "@/app/_components/Hero";
import Trusted from "./_components/Trusted";
import Footer from "./_components/Footer";
import Modul from "./_components/Modul";
import Cta from "./_components/Cta";

export default function Home() {
  return (
    <div className="">
      <Header />
      <Hero />
      <Trusted />
      <Modul />
      <Cta />
      <Footer />
    </div>
  );
}
