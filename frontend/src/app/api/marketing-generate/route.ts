import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function translateToMongolian(text: string): Promise<string> {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      source: "en",
      target: "mn",
      format: "text",
    }),
  });

  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(data.error?.message ?? "Translation failed");
  }

  return data.data.translations[0].translatedText;
}

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

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a social media marketer creating posts for a Mongolian brand. Write all posts in natural, engaging English — they will be translated into Mongolian afterward, so write clearly and avoid idioms or slang that don't translate well.

## GOAL
Generate 15 ready-to-publish social media posts for the given product. Posts must feel human, specific, and platform-native — not like ad copy or a brochure.

---

## STRICT DO NOT LIST
❌ No fake customer quotes or made-up testimonials
❌ No feature lists with colons: "Features: X, Y, Z"
❌ No generic CTAs like "Order today and get a discount!"
❌ No vague claims like "a huge difference in your experience"
❌ No self-introductions like "Hi, I'm a student at X university"
❌ No idioms or culturally specific slang that won't survive translation
❌ No exclamation marks anywhere — use periods or commas instead. Mongolians don't use "!" in casual writing.
❌ No overly enthusiastic or hype-y tone. Keep it calm, direct, and grounded. Think a knowledgeable friend, not a salesperson.

---

## PLATFORM RULES

### Facebook (7 posts) — 80–130 words
- First line must stop the scroll — bold statement or short relatable moment
- Middle: one short story, tip, or real situation
- End: a comment-bait question OR a simple link CTA
- 1–2 emojis, placed naturally
- 2–3 hashtags

### Twitter/X (5 posts) — STRICT max 220 characters (leaving room for translation expansion)
- One idea. One punch. Done.
- No feature lists
- First line must stand alone
- 1 hashtag max

### LinkedIn (3 posts) — 150–200 words
- Open with a specific observation or relatable situation, not a question
- Share a concrete insight, number, or before/after scenario
- End with a genuine question that invites comments
- Professional but human — like a founder talking to their network
- 3–5 hashtags at the bottom

---

## CONTENT TYPES — distribute across all 15 posts, no type used more than 4 times

1. **Problem/Solution** — name a specific pain point, show how the product fixes it
2. **Before/After** — describe what life looks like before vs after using the product, from the brand's perspective. No fake customer voice.
3. **Educational tip** — one genuinely useful tip related to the product's domain
4. **Feature spotlight** — ONE specific feature + ONE concrete real-world benefit
5. **Call-to-action** — drive a specific next step: sign up, DM, try free, visit site

Vary the content types across platforms. Do not repeat the same angle back-to-back.

---

## GOOD EXAMPLES (match this quality)

**LinkedIn — Problem/Solution:**
Most wired earphones fail at the same two things: the cable breaks within months, and the audio cuts out at the worst moments.

We built around those exact failure points. Reinforced braided cable, stable analog connection, no battery to die on you mid-session.

If you've gone through three pairs of earphones this year — what kept breaking first?

#AudioGear #EverydayTech #MongoliaStartup

---

**Twitter — Educational tip:**
AUX beats Bluetooth for gaming. Zero compression, zero latency.
If your game has audio cues, this matters. #GamingAudio

---

**Facebook — Before/After:**
Most people pick earphones based on how they look.
Then the cable frays. The sound cuts out. The whole thing dies in six months.

After switching to a reinforced AUX option? The cable outlasts the phone.

What's the longest you've kept a pair of earphones alive? 👇 #EarphoneTips

---

## OUTPUT FORMAT
Return ONLY valid JSON. No markdown, no extra text.

{
  "advice": "3–5 sentences of strategic advice in English, specific to this product and audience. Name which platform to prioritize, what content angle works best, and one concrete first-week action.",
  "posts": [
    {
      "platform": "LinkedIn" | "Facebook" | "Twitter",
      "contentType": "Problem/Solution" | "Before/After" | "Educational tip" | "Feature spotlight" | "Call-to-action",
      "content": "Full post content in English",
      "scheduledDate": "YYYY-MM-DDTHH:mm:00+08:00"
    }
  ]
}

Generate exactly 15 posts. Spread scheduledDate evenly across 30 days starting from the user's start date (roughly every 2 days).
Distribution: 7 Facebook, 5 Twitter, 3 LinkedIn.

## SCHEDULING — all times are Asia/Ulaanbaatar (UTC+8)
Based on real engagement data for this timezone, assign the best posting time per platform:

- **Facebook**: weekdays → 09:00–12:00; weekends → 13:00–16:00. Also strong at 22:00 any day.
- **Twitter**: weekdays only → 11:00–15:00. Also strong at 22:00 on weekdays.
- **LinkedIn**: weekdays only → 08:00–17:00 (business hours). Prefer morning (08:00–10:00) or 22:00.

Overall peak for all platforms: **Wednesday at 22:00** (100% engagement score). Use this slot for your highest-priority posts.

Pick specific times within these windows — do not use identical times for every post. Vary them naturally.

Set scheduledDate as a full datetime string: "YYYY-MM-DDTHH:mm:00+08:00".`,
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

    const safeTranslate = (text: string) =>
      translateToMongolian(text).catch(() => text);

    const [translatedAdvice, ...translatedContents] = await Promise.all([
      safeTranslate(aiResult.advice),
      ...aiResult.posts.map((post: { content: string }) => safeTranslate(post.content)),
    ]);

    const translatedPosts = aiResult.posts.map(
      (
        post: {
          platform: string;
          contentType: string;
          scheduledDate: string;
          content: string;
        },
        i: number,
      ) => ({
        ...post,
        content: translatedContents[i],
      }),
    );

    const cleanAdvice = translatedAdvice.replace(/!/g, ".");
    const cleanPosts = translatedPosts.map(
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
