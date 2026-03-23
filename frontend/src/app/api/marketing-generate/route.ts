import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//read the user data and find org patronage.
//if patronge=basic, 

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productName, description, targetAudience, images } = body;
    const imageBase64s: string[] = Array.isArray(images) ? images : [];

    if (!productName || !description || !targetAudience) {
      return NextResponse.json(
        {
          error:
            "Бүтээгдэхүүний нэр, тайлбар болон зорилгот хэрэглэгчийн мэдээлэл шаардлагатай.",
        },
        { status: 400 },
      );
    }

    const today = new Date();
    const todayISO = today.toISOString().split("T")[0];

    // Step 1: Generate posts in English
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Та Монгол брэндийн social media маркетер. Бүх постуудыг МОНГОЛ ХЭЛЭЭР бич.

## ЗОРИЛГО
Өгөгдсөн бүтээгдэхүүнд зориулж 12 пост үүсгэ. Постууд хүний мэдрэмжтэй, тодорхой, платформд тохирсон байх ёстой.

---

## ХОРИГЛОХ ЗҮЙЛС
❌ Хуурамч хэрэглэгчийн сэтгэгдэл бүү бич
❌ "Онцлогууд: X, Y, Z" гэсэн жагсаалт бүү хэрэглэ
❌ "Өнөөдөр захиалаад хямдрал ав" зэрэг ерөнхий уриа бүү хэрэглэ
❌ Орилох, хэт урам зоригтой өнгө аяс бүү хэрэглэ. Тайван, шууд, бодитой байх.
❌ Анхаарлын тэмдэг (!) хэрэглэхгүй. Цэг эсвэл таслал хэрэглэ.

---

## ПЛАТФОРМЫН ДҮРМҮҮД

### Facebook (8 пост) — 60–100 үг
- Эхний мөр анхаарал татах ёстой
- Дунд хэсэг: нэг богино түүх, зөвлөгөө, эсвэл бодит нөхцөл байдал
- Төгсгөл: коммент урих асуулт эсвэл энгийн CTA
- 1–2 emoji байгалийн байршилд
- 2–3 хэштэг

### Instagram (4 пост) — 40–70 үг
- Зургийн тайлбар маягаар бич
- Сэтгэл татах, visual байдалд тохирсон
- 4–6 хэштэг

---

## АГУУЛГЫН ТӨРЛҮҮД
1. **Асуудал/Шийдэл** — тодорхой өвдөлтийн цэг нэрлэж, бүтээгдэхүүн хэрхэн засдагийг харуул
2. **Өмнө/Дараа** — бүтээгдэхүүн ашиглахаас өмнө ба дараах байдлыг харуул
3. **Сургалтын зөвлөгөө** — бүтээгдэхүүний салбарт хэрэгтэй нэг зөвлөгөө
4. **Онцлог тодруулалт** — нэг тодорхой онцлог + нэг бодит ашиг тус
5. **Үйлд уриалах** — бүртгүүл, мессеж илгээ, үнэгүй туршаад үз

---

## ГАРАЛТЫН ФОРМАТ
Зөвхөн хүчинтэй JSON буцаа. Markdown, нэмэлт текст байхгүй.

{
  "advice": "3–5 өгүүлбэр стратегийн зөвлөгөө Монгол хэлээр. Аль платформыг тэргүүлэх, ямар агуулгын өнцөг хамгийн сайн ажилладаг, эхний 7 хоногт хийх нэг тодорхой үйлдэл.",
  "posts": [
    {
      "platform": "Facebook" | "Instagram",
      "contentType": "Асуудал/Шийдэл" | "Өмнө/Дараа" | "Сургалтын зөвлөгөө" | "Онцлог тодруулалт" | "Үйлд уриалах",
      "content": "Монгол хэл дээрх бүтэн постын агуулга",
      "scheduledDate": "YYYY-MM-DDTHH:mm:00+08:00"
    }
  ]
}

Яг 12 пост үүсгэ. scheduledDate-г хэрэглэгчийн эхлэх огнооноос эхлэн 30 хоногт жигд тараа (ойролцоогоор 2–3 хоног тутамд).
Тоо: 8 Facebook, 4 Instagram.

## ЦАГИЙН ХУВААРЬ — Улаанбаатарын цаг (UTC+8)
- **Facebook**: ажлын өдрүүд → 09:00–12:00; амралтын өдрүүд → 13:00–16:00. Мөн 22:00 хүчтэй.
- **Instagram**: ажлын өдрүүд → 12:00–14:00 эсвэл 19:00–21:00.

Лхагва гаригийн 22:00 — хамгийн өндөр engagement. Хамгийн чухал постыг энд тавь.
Цагийг байгалийн байдлаар өөрчил, бүх пост ижил цагтай байх ёсгүй.`,
        },
        {
          role: "user",
          content: [
            {
              type: "text" as const,
              text: `Generate a 30-day content plan for this product:

Product name: ${productName}
Description: ${description}
Target audience: ${targetAudience}
Start date: ${todayISO}${imageBase64s.length > 0 ? `\n\nThe user has provided ${imageBase64s.length} product image(s) above. Analyze them for visual details — colors, style, mood, product appearance — and use that context to make the posts more specific and visually grounded.` : ""}`,
            },
            ...imageBase64s.map((dataUrl) => ({
              type: "image_url" as const,
              image_url: { url: dataUrl, detail: "low" as const },
            })),
          ],
        },
      ],
    });

    const responseText = response.choices[0].message.content;
    if (!responseText) throw new Error("Empty response from AI");

    const aiResult = JSON.parse(responseText);

    const cleanAdvice = aiResult.advice.replace(/!/g, ".");
    const cleanPosts = aiResult.posts.map(
      (post: {
        platform: string;
        contentType: string;
        scheduledDate: string;
        content: string;
      }) => ({
        ...post,
        content: post.content.replace(/!/g, "."),
      }),
    );

    return NextResponse.json(
      { advice: cleanAdvice, posts: cleanPosts },
      { status: 200 },
    );
  } catch (error) {
    console.error("Маркетинг API алдаа:", error);
    return NextResponse.json(
      { error: "Сервер дээр алдаа гарлаа. Дахин оролдоно уу." },
      { status: 500 },
    );
  }
}
