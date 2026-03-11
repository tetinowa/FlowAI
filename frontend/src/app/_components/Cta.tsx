import { Button } from "@/components/ui/button";

export default function Cta() {
  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="relative overflow-hidden rounded-[48px] bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-500 px-8 py-20 text-center text-white shadow-xl">
          <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

          <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
            Өсөлтөө <br className="hidden md:block" />
            автоматжуулахад бэлэн үү?
          </h2>

          <p className="mx-auto max-w-2xl text-white/80 mb-10">
            Flow AI ашиглан компани илүү үр ашигтай ажиллуулдаг мянга мянган
            жижиг дунд бизнес эрхлэгчтэй нэгдээрэй.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="rounded-full bg-white text-indigo-600 hover:bg-white/90 px-8 py-6 text-base font-semibold"
            >
              14 хоногийн үнэгүй туршилтаа эхлүүлэх
            </Button>

            <Button
              size="lg"
              className="rounded-full bg-white text-indigo-600 hover:bg-white/90 px-8 py-6 text-base font-semibold"
            >
              Борлуулалтын багтай холбогдох
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
