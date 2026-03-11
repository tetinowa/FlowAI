import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Megaphone, Wallet } from "lucide-react";

export default function Modul() {
  return (
    <section className="w-full bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold text-indigo-500 mb-2">модулиуд</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Өсөлтөд зориулагдсан AI хэрэгслүүд
          </h2>
          <p className="text-gray-500">
            Бизнесээ дараагийн шатанд гаргахын тулд хүчирхэг алгоритмуудыг
            ашигла.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="rounded-2xl shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
                <Wallet className="text-indigo-600" />
              </div>

              <h3 className="text-xl font-semibold mb-2 text-black">
                Санхүүгийн AI
              </h3>
              <p className="text-gray-500 mb-6">
                Predictive bookkeeping and automated expense tracking. Get
                real-time runway alerts and intelligent cash flow forecasting.
              </p>

              <div className="mb-6 rounded-xl bg-gradient-to-r from-pink-100 to-orange-100 p-6 flex justify-center">
                <div className="bg-white rounded-xl shadow w-48 h-64" />
              </div>

              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="text-indigo-500 w-4 h-4" />
                  Automated categorization
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="text-indigo-500 w-4 h-4" />
                  Real-time tax estimation
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
                <Megaphone className="text-indigo-600" />
              </div>

              <h3 className="text-xl font-semibold mb-2">Маркетингийн AI</h3>
              <p className="text-gray-500 mb-6">
                Automated ad spend optimization and personalized campaigns.
                Create high-converting content in seconds with generative AI.
              </p>

              <div className="mb-6 rounded-xl bg-gradient-to-r from-teal-200 to-emerald-200 p-6 flex justify-center">
                <div className="bg-white rounded-xl shadow w-48 h-64" />
              </div>

              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="text-indigo-500 w-4 h-4" />
                  Smart audience targeting
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="text-indigo-500 w-4 h-4" />
                  24/7 campaign optimization
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
