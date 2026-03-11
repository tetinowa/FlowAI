import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productName, description, targetAudience } = body;

    if (!productName || !description || !targetAudience) {
      return NextResponse.json(
        { error: "Бүтээгдэхүүний нэр, тайлбар болон зорилгот хэрэглэгчийн мэдээлэл шаардлагатай." },
        { status: 400 }
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
          content: `You are an expert marketing strategist and copywriter with 10+ years of experience growing B2B and B2C brands on social media.

Your task: Generate a high-quality 30-day content marketing plan based on the product info provided. Write compelling, platform-native content that drives real engagement.

Platform guidelines:
- LinkedIn: Professional tone, thought leadership, data-driven insights, industry trends, behind-the-scenes, success stories. Use line breaks for readability. Include relevant hashtags (3-5). 150-300 words.
- Facebook: Conversational, community-focused, storytelling, questions to spark discussion. Emojis where appropriate. Include hashtags (2-3). 100-200 words.
- Twitter: Punchy, concise, hook-first. Under 280 characters. 1-2 hashtags max. Can be a question, bold statement, or tip.

Content variety (mix these across the 5 posts):
1. Problem/Solution post — highlight the pain point your product solves
2. Social proof / testimonial-style — imagine a real customer story
3. Educational tip — teach something valuable related to your domain
4. Product feature spotlight — showcase a key capability
5. Call-to-action post — drive signups, demos, or conversations

Return ONLY valid JSON in this exact structure, no other text:
{
  "advice": "3-4 sentence strategic marketing advice specific to this product and audience. Be concrete and actionable.",
  "posts": [
    {
      "platform": "LinkedIn",
      "content": "Full post content here",
      "scheduledDate": "YYYY-MM-DD"
    }
  ]
}

Generate exactly 5 posts. Use platforms: "LinkedIn", "Facebook", "Twitter". Spread dates from ${todayISO} across 30 days. scheduledDate format: "YYYY-MM-DD".`,
        },
        {
          role: "user",
          content: `Create a marketing content plan for:\n\nProduct: ${productName}\nDescription: ${description}\nTarget audience: ${targetAudience}\n\nIMPORTANT: Write ALL post content and advice in Mongolian language (Монгол хэлээр). Make the content highly engaging, specific to this product, and tailored to each platform's best practices.`,
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
    console.error("Маркетинг API алдаа:", error);
    return NextResponse.json(
      { error: "Сервер дээр алдаа гарлаа. Дахин оролдоно уу." },
      { status: 500 }
    );
  }
}
