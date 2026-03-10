import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai =new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

export async function POST(request: NextRequest) {
    try {
      const body= await request.json();
 const { transactions } = body;

 const stringifiedData=JSON.stringify(transactions, null, 2)

 const response= await ai.models.generateContent({
  model:"gemini-2.0-flash",
  contents:`Дараах банкны хуулганд анализ хийнэ үү:\n\n${stringifiedData}`,
config:
         {
                systemInstruction: `Чи бол туршлагатай санхүүгийн зөвлөх. Хэрэглэгчийн банкны excel хуулгыг уншиж анализ хийнэ. 
                Хариуг ЗААВАЛ дараах JSON бүтцээр буцаах ёстой. Гүйлгээг "Хоол хүнс", "Тээвэр", "Бараа материал", "Цалин", "Бусад" гэсэн категориудад хувааж, нийт дүнг тооцно.
                ӨӨР ТЭКСТ БИТГИЙ БИЧ.
        {
          "summary": "Ерөнхий дүгнэлт (2-3 өгүүлбэр)",
          "categories": [
            { "name": "Хоол хүнс", "total": 0 },
            { "name": "Тээвэр", "total": 0 },
            { "name": "Бараа материал", "total": 0 },
            { "name": "Цалин", "total": 0 },
            { "name": "Бусад", "total": 0 }
          ],
          "tips": [
            "Зөвлөгөө 1",
            "Зөвлөгөө 2"
          ]
        }`,
        responseMimeType: "application/json",
        
            },});
if (!response.text) {
            throw new Error("AI-аас хоосон хариу ирлээ");
        }

        // Одоо TypeScript response.text-ийг гарцаагүй string гэж ойлгох болно
        const aiResult = JSON.parse(response.text);
        return NextResponse.json(aiResult, { status: 200 });
}
catch (error){
  console.error("Алдаа:", error);
  return NextResponse.json({error: "Сервер дээр алдаа гарлаа"}, {status:500});

}}