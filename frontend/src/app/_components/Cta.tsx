import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Cta() {
  return (
    <section
      className="py-24"
      style={{ background: "#050B15" }}
    >
      <div className="container mx-auto px-6">
        <div
          className="relative overflow-hidden rounded-3xl px-8 py-20 text-center"
          style={{
            background: "linear-gradient(135deg, #071628 0%, #0D2240 50%, #071628 100%)",
            border: "1px solid rgba(0, 212, 255, 0.15)",
            boxShadow: "0 0 120px rgba(0, 212, 255, 0.06) inset",
          }}
        >
          {/* Glow orbs */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(ellipse, rgba(0,212,255,0.12) 0%, transparent 70%)",
              transform: "translateX(-50%) translateY(-40%)",
            }}
          />
          <div
            className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)",
              transform: "translateY(50%)",
            }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)",
              transform: "translateY(50%)",
            }}
          />

          <div className="relative z-10">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full text-xs font-semibold tracking-wide"
              style={{
                background: "rgba(0, 212, 255, 0.08)",
                border: "1px solid rgba(0, 212, 255, 0.2)",
                color: "#00D4FF",
                fontFamily: "Plus Jakarta Sans, sans-serif",
              }}
            >
              ✦ &nbsp;14 хоногийн үнэгүй туршилт — карт шаардлагагүй
            </div>

            <h2
              className="text-4xl md:text-6xl font-black leading-tight mb-6"
              style={{ color: "#E8F4FF", fontFamily: "Syne, sans-serif", letterSpacing: "-0.03em" }}
            >
              Өсөлтөө
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #00D4FF, #7DD3FC)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                автоматжуулахад
              </span>
              <br />
              бэлэн үү?
            </h2>

            <p
              className="mx-auto max-w-xl mb-12 text-base leading-relaxed"
              style={{ color: "#6B8BAE", fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              FlowAI ашиглан санхүүгийн тайлангаа цаг хэмнэн гаргадаг мянга мянган
              Монгол бизнес эрхлэгчтэй нэгдэж, татварын тооцоогоо автоматжуул.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="rounded-xl font-semibold text-base px-10 py-6"
                  style={{
                    background: "linear-gradient(135deg, #00D4FF, #0090CC)",
                    color: "#050B15",
                    boxShadow: "0 0 40px rgba(0, 212, 255, 0.35)",
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                  }}
                >
                  Үнэгүй эхлэх
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>

              <Button
                size="lg"
                variant="outline"
                className="rounded-xl text-base px-10 py-6"
                style={{
                  borderColor: "rgba(255,255,255,0.12)",
                  color: "#E8F4FF",
                  background: "transparent",
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                }}
              >
                Борлуулалтын багтай холбогдох
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
