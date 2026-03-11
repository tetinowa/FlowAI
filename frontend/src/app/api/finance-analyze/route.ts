// import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY});

export async function POST(request: NextRequest) {
    try {
      const body= await request.json();
 const { transactions } = body;

 if(!transactions || transactions.length===0) {
  return NextResponse.json({error:"Гүйлгээний мэдээлэл олдсонгүй."}, {status:400})
 }

 const stringifiedData = JSON.stringify(transactions, null, 2);


 const response = await openai.responses.create({
    model: "gpt-5",
    input: [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: `Чи бол туршлагатай санхүүгийн зөвлөх. Хэрэглэгчийн банкны excel хуулгыг уншиж анализ хийнэ. Хариуг ЗААВАЛ дараах JSON бүтцээр буцаах ёстой. Гүйлгээг "Хоол хүнс", "Тээвэр", "Бараа материал", "Цалин", "Бусад" гэсэн категориудад хувааж, нийт дүнг тооцно. ӨӨР ТЭКСТ БИТГИЙ БИЧ.
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
}`
        },
        {
          type: "input_file",
          file_url: `Дараах банкны хуулганд анализ хийнэ үү:\n\n${stringifiedData}`
        }
      ]
    }
  ]
});

console.log(response.output_text);
const responseText = response.output_text

if (!response.text) {
            throw new Error("AI-аас хоосон хариу ирлээ");
        }

        const aiResult = JSON.parse(responseText);
        return NextResponse.json(aiResult, { status: 200 });
}
catch (error){
  console.error("Алдаа:", error);
  return NextResponse.json({error: "Сервер дээр алдаа гарлаа."}, {status:500});

}}


