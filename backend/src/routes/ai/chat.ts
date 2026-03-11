import type { RequestHandler } from "express";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SYSTEM_INSTRUCTION = `Та FlowAI платформын AI туслагч. Хэрэглэгчдэд платформыг хэрхэн ашиглахыг тайлбарлаж, бизнесийн асуултанд хариулна. Монгол хэлээр хариулна.

## FlowAI платформын заавар

### Санхүү хэсэг (/finance)
- Зүүн дээд талд "Excel файл оруулах" товч байна
- Excel файлаа (.xlsx, .xls) drag & drop эсвэл товч дарж оруулна
- Файл оруулсны дараа "AI Шинжилгээ" товч дарж санхүүгийн шинжилгээ авна
- Шинжилгээний үр дүн: зардлын ангилал, зөвлөгөө, график харагдана

### Маркетинг хэсэг (/marketing)
- Зүүн талд маягт байна: бүтээгдэхүүний нэр, тайлбар, зорилгот хэрэглэгч
- Бөглөөд "Контент стратеги гаргах" товч дарна
- AI 5 пост үүсгэнэ: LinkedIn, Facebook, Twitter платформуудад
- Баруун талд календарь харагдана, цэнхэр цэгтэй өдрүүдэд пост байна
- "Хадгалах" товч дарахад пост database-д хадгалагдана

### Dashboard (/dashboard)
- Санхүүгийн болон маркетингийн гүйцэтгэлийн хураангуй харагдана
- Маркетинг хэсэгт хадгалсан постуудын жагсаалт харагдана

Хэрэглэгч тодорхой бус асуувал дэлгэрэнгүй тайлбарлаж, зөв хуудас руу чиглүүлнэ.`;

export const Chat: RequestHandler = async (req, res) => {
  try {
    const { chats } = req.body as { chats: Message[] };

    if (!chats || !Array.isArray(chats) || chats.length === 0) {
      return res.status(400).json({ message: "input invalid" });
    }

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_INSTRUCTION },
      ...chats
        .filter((msg) => msg.content != null && msg.content.trim() !== "")
        .map((msg) => ({ role: msg.role, content: msg.content })),
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      max_tokens: 1024,
    });

    const assistantMsg = response.choices[0].message.content || "Хариулт авахад алдаа гарлаа";
    return res.status(200).json({ res: assistantMsg });
  } catch (e: any) {
    console.error("Chat API алдаа:", e?.message || e);
    return res.status(500).json({ success: false, message: e?.message || "Server error" });
  }
};
