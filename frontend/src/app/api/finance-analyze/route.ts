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
    const { transactions, clientId } = body;

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
          content: `Чи бол туршлагатай Монгол санхүүгийн зөвлөх. ХАРИУГ БҮХЭЛД НЬ МОНГОЛ ХЭЛЭЭР БИЧ. summary болон tips заавал монгол хэлээр байх ёстой — англи үг бүү хэрэглэ. Хариуг ЗААВАЛ дараах JSON бүтцээр буцаах ёстой. Гүйлгээнүүдийг огноогоор нь сар бүрт ангилж орлого/зарлагын ангилал гаргана. ӨӨР ТЭКСТ БИТГИЙ БИЧ.

Ангилалын дүрэм — ОЙЛ ОЙЛГОМЖТОЙ АНГИЛАХ:
- "Цалин" → "цалин", "ажлын хөлс", "tsalin", "ajliinhuls", "salary", "wages", "TS1", "ts1", "Ts1", "ЦА", "ца" гэх мэт
- "Хоол хүнс" → "хоол", "lunch", "dinner", "food", "café", "coffee", "xool", "hool", "ресторан", "restaurant", "cafe", "гуанз", "цай", "tea", "bakery", "ХХ", "хх" гэх мэт
- "Тээвэр" → "bus", "taxi", "ubcab", "flight", "бензин", "benzin", "tulsh", "түлш", "тээвэр", "transport", "fuel", "petrol", "ТВ", "тв" гэх мэт
- "Бараа материал" → "бараа", "material", "baraa", "building material", "construction", "материал", "b1", "нийлүүлэлт", "supply", "supplies", "БМ", "бм", "BM" гэх мэт
- "Тоног төхөөрөмж" → "тоног", "tonog", "t1", "т1", "equipment", "machine", "техник", "компьютер", "computer", "phone", "утас", "ТТ", "тт" гэх мэт
- "Орон байр/Түрээс" → "түрээс", "rent", "building", "байр", "office", "оффис", "ОБ", "об", "TR", "tr" гэх мэт
- "Харилцаа холбоо" → "internet", "phone bill", "утасны", "мобикон", "mobicom", "unitel", "skytel", "gmobile", "г-мобайл", "ХХ1", "хх1" гэх мэт
- "Банкны шимтгэл" → "шимтгэл", "commission", "fee", "service charge", "bank fee", "БШ", "бш" гэх мэт
- "Бусад" → дээрх ангилалд тохирохгүй зарлагууд ЗӨВХӨН ЭНД орно. Аль болох цөөн гүйлгээ "Бусад"-д оруул. Гүйлгээний утга дотор товчилсон код (жнь: "TS1", "BM", "ТТ") байвал дээрх ангилалуудтай тааруулж ангилах.
Орлогын дүрэм:
- "Борлуулалтын орлого" → борлуулалт, худалдаа, үйлчилгээний орлого, payment received гэх мэт
- "Зээл" → зээл, loan, credit гэх мэт

{
  "summary": "Ерөнхий дүгнэлт монгол хэлээр (3-4 өгүүлбэр, тоон үзүүлэлт оруул)",
  "income": [
    { "name": "Борлуулалтын орлого", "total": 0 },
    { "name": "Зээл", "total": 0 }
  ],
  "expenses": [
    { "name": "Цалин", "total": 0 },
    { "name": "Хоол хүнс", "total": 0 },
    { "name": "Тээвэр", "total": 0 },
    { "name": "Бараа материал", "total": 0 },
    { "name": "Тоног төхөөрөмж", "total": 0 },
    { "name": "Орон байр/Түрээс", "total": 0 },
    { "name": "Харилцаа холбоо", "total": 0 },
    { "name": "Банкны шимтгэл", "total": 0 },
    { "name": "Бусад", "total": 0 }
  ],
  "monthly": [
    {
      "month": "2025-01",
      "income": [{ "name": "Борлуулалтын орлого", "total": 0 }],
      "expenses": [{ "name": "Хоол хүнс", "total": 0 }]
    }
  ],
  "tips": ["Монгол хэлээр зөвлөгөө 1", "Монгол хэлээр зөвлөгөө 2", "Монгол хэлээр зөвлөгөө 3"]
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

    const usageRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/limiting`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: clientId as string,
      }),
    });

    const usageData = await usageRes.json();

    // if limit reached, stop here
    if (usageRes.status === 429) {
      return NextResponse.json({ error: usageData.message }, { status: 429 });
    }

    return NextResponse.json(aiResult, { status: 200 });
  } catch (error) {
    console.error("Алдаа:", error);
    return NextResponse.json(
      { error: "Сервер дээр алдаа гарлаа." },
      { status: 500 },
    );
  }
}
