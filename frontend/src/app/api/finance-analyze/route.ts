// import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY тохируулагдаагүй байна." },
        { status: 500 },
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const body = await request.json();
    const { transactions } = body;

    if (!transactions || transactions.length === 0) {
      return NextResponse.json(
        { error: "Гүйлгээний мэдээлэл олдсонгүй." },
        { status: 400 },
      );
    }

    const stringifiedData = JSON.stringify(transactions, null, 2);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Чи бол туршлагатай санхүүгийн зөвлөх. Хариуг ЗААВАЛ дараах JSON бүтцээр буцаах ёстой. Гүйлгээнүүдийг огноогоор нь сар бүрт ангилж орлого/зарлагын ангилал гаргана. ӨӨР ТЭКСТ БИТГИЙ БИЧ.
Ангилалын дүрэм:
- "Цалин", "Ажлын хөлс", "Tsalin", ""Ajliinhuls" зэргээс гадна "Хоол хүнс", "хоол", "lunch", "dinner", "food", "café", "coffee", "xol","hol" гэх мэт хоол хүнстэй холбоотой бүх зарлагыг "Цалин" ангилалд  оруул.
- "Тээвэр", "bus", "taxi", "ubcab", "flight", "бензин","benzin", "tulsh", "түлш" гэх мэт тээвэртэй холбоотой бүх зарлагыг "Тээвэр" ангилалд оруул.
- Бараа маьериалын нэр бичсэн гүйлгээнээс гадна "Бараа материал", "barag material", "baraa material", "baraa", "material", "building material", "construction material","b1" гэх мэт бараа материалтай холбоотой бүх зарлагыг "Бараа материал" ангилалд оруул.
- "Тоног төхөөрөмж ашиглалт", "tonog tuhuurumj", "tonog", "t1", "т1" гэх мэт тоног төхөөрөмж ашиглалттай холбоотой бүх зарлагыг "Тоног төхөөрөмж ашиглалт" ангилалд оруул.
- Бусад бүх зарлагыг "Бусад" ангилалд оруул.
- Зээл гэсэн орлогоос бусад орлогыг "Борлуулалтын орлого" ангилалд оруул.
{
  "summary": "Ерөнхий дүгнэлт (2-3 өгүүлбэр)",
  "income": [
    { "name": "Борлуулалтын орлого", "total": 0 },
    { "name": "Зээл", "total": 0 }
  ],
  "expenses": [
    { "name": "Цалин", "code": "TS1", "total": 0 },
    { "name": "Тээвэр", "code": "T1", "total": 0 },
    { "name": "Бараа материал", "code": "B1", "total": 0 },
     { "name": "Тоног төхөөрөмж ашиглалт", "code": "TT1", "total": 0 },
    { "name": "Бусад", "total": 0 }
  ],
  "monthly": [
    {
      "month": "2025-01",
      "income": [{ "name": "Борлуулалтын орлого", "total": 0 }],
      "expenses": [{ "name": "Хоол хүнс", "total": 0 }]
    }
  ],
  "tips": ["Борлуулалтын орлого нэмэх зөвлөгөө", "Зардал бууруулах зөвөлгөө 2"]
}`,
        },
        {
          role: "user",
          content: `Дараах банкны хуулганд анализ хийнэ үү:\n\n${stringifiedData}`,
        },
      ],
    });

    const responseText = response.choices[0].message.content;

    if (!responseText) {
      throw new Error("AI-аас хоосон хариу ирлээ");
    }

    const aiResult = JSON.parse(responseText);
    return NextResponse.json(aiResult, { status: 200 });
  } catch (error) {
    console.error("Алдаа:", error);
    return NextResponse.json(
      { error: "Сервер дээр алдаа гарлаа." },
      { status: 500 },
    );
  }
}
