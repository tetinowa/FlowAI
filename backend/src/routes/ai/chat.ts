import type { RequestHandler } from "express";
import { GoogleGenAI } from "@google/genai";
const apiKey = process.env.GENAI_API_KEY;
type Message = {
  role: "user" | "assistant";
  content: string;
};

export const Chat: RequestHandler = async (req, res) => {
  const { chats } = req.body as { chats: Message[] };
  console.log(chats);
  const history = chats.slice(0, -1).map((msg: Message) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));
  try {
    if (!apiKey) {
      return res.status(500).json({ message: "ApiKey issue" });
    }
    const ai = new GoogleGenAI({ apiKey });
    if (!chats) {
      return res.status(401).json({ message: "input invalid" });
    }
    const chat = ai.chats.create({
      model: "gemini-2.0-flash",
      history,
      config: {
        systemInstruction:
          "Та бизнесийн AI зөвлөгч. Санхүү, маркетингийн асуултад Монгол хэлээр хариулна.",
        maxOutputTokens: 1024,
      },
    });

    const lastMessage = chats[chats.length - 1];
    const response = await chat.sendMessage({ message: lastMessage.content });
    const assistantMsg = response.text || "error";

    return res.status(200).json({ res: assistantMsg });
  } catch (e) {
    return res.status(500).json({ success: false, message: e });
  }
};
