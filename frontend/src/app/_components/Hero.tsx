import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="inline-block mb-4 text-black rounded-full bg-indigo-100 px-4 py-1 text-sm font-medium text-indigo-600">
              Шинэ: AI-д суурилсан аналитик
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-black">
              AI-д суурилсан санхүү болон маркетингийн тусламжтайгаар{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                бизнесээ өргөжүүл
              </span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-xl text-black">
              Манай AI платформоор мөнгөн урсгалаа оновчтой болгож, өсөлтөө
              автоматжуул. Таамаглал, дүн шинжилгээ, бодит цагийн тайлан.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" className="rounded-xl">
                Үнэгүй эхлэх
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="rounded-xl text-black">
                Demo үзэх
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200 to-purple-200 blur-3xl opacity-40 rounded-full" />
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
              alt="Dashboard Preview"
              className="relative rounded-2xl shadow-2xl border"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
