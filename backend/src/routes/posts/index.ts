import type { RequestHandler } from "express";
import prisma from "../../lib/prisma";

export const getPosts: RequestHandler = async (req, res) => {
  const orgId = req.clerkUserId!;
  try {
    const posts = await prisma.post.findMany({
      where: { orgId },
      orderBy: { publishedAt: "desc" },
      take: 10,
    });
    return res.json({ success: true, data: posts });
  } catch (e) {
    return res.status(500).json({ success: false, message: e });
  }
};

export const createPost: RequestHandler = async (req, res) => {
  const orgId = req.clerkUserId!;
  const { title, content, platform, scheduledDate } = req.body;
  try {
    const post = await prisma.post.create({
      data: {
        orgId,
        title: title || content?.slice(0, 60) || "Untitled",
        content: content || "",
        platform,
        publishedAt: scheduledDate ? new Date(scheduledDate) : new Date(),
      },
    });

    // n8n webhook — auto post руу илгээнэ
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          content: content || "",
          scheduledDate: scheduledDate || new Date().toISOString(),
          postId: post.id,
        }),
      }).catch((err) => console.error("n8n webhook алдаа:", err));
    }

    return res.status(201).json({ success: true, data: post });
  } catch (e) {
    return res.status(500).json({ success: false, message: e });
  }
};
