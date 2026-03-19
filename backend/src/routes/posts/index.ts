import type { RequestHandler } from "express";
import { Request, Response } from "express";
import prisma from "../../lib/prisma";

// n8n API key шалгах middleware
function requireApiKey(req: Request, res: Response, next: Function) {
  const key = Array.isArray(req.headers["x-api-key"])
    ? req.headers["x-api-key"][0]
    : req.headers["x-api-key"];
  if (!process.env.N8N_API_KEY || key !== process.env.N8N_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// GET /api/facebook/pending-posts  — n8n дуудна
export const getPendingPosts: RequestHandler = async (_req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        platform: "FACEBOOK",
        published: false,
        publishedAt: { lte: new Date() }, // scheduled time хэтэрсэн
      },
      include: { org: { select: { name: true } } },
      orderBy: { publishedAt: "asc" },
    });
    return res.json({ success: true, data: posts });
  } catch (e) {
    return res.status(500).json({ success: false, message: e });
  }
};

// POST /api/facebook/posts/:id/publish  — n8n Facebook-д нийтэлсний дараа дуудна
export const markPublished: RequestHandler = async (req, res) => {
  const id = req.params.id as string;
  try {
    const post = await prisma.post.update({
      where: { id },
      data: { published: true },
    });
    return res.json({ success: true, data: post });
  } catch (e) {
    return res.status(500).json({ success: false, message: e });
  }
};

export { requireApiKey };

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

export const updatePost: RequestHandler = async (req, res) => {
  const orgId = req.clerkUserId!;
  const id = req.params.id as string;
  const { content } = req.body;
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.orgId !== orgId) return res.status(404).json({ success: false, message: "Not found" });
    const updated = await prisma.post.update({ where: { id }, data: { content } });
    return res.json({ success: true, data: updated });
  } catch (e) {
    return res.status(500).json({ success: false, message: e });
  }
};

export const deletePost: RequestHandler = async (req, res) => {
  const orgId = req.clerkUserId!;
  const id = req.params.id as string;
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.orgId !== orgId) return res.status(404).json({ success: false, message: "Not found" });
    await prisma.post.delete({ where: { id } });
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ success: false, message: e });
  }
};

export const publishNow: RequestHandler = async (req, res) => {
  const orgId = req.clerkUserId!;
  const id = req.params.id as string;
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.orgId !== orgId) return res.status(404).json({ success: false, message: "Not found" });

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!n8nWebhookUrl) return res.status(503).json({ success: false, message: "N8N_WEBHOOK_URL not configured" });

    await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform: post.platform,
        content: post.content,
        images: post.images,
        postId: post.id,
        publishNow: true,
      }),
    });

    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ success: false, message: e });
  }
};

export const createPost: RequestHandler = async (req, res) => {
  const orgId = req.clerkUserId!;
  const { title, content, platform, scheduledDate, images } = req.body;
  try {
    const post = await prisma.post.create({
      data: {
        orgId,
        title: title || content?.slice(0, 60) || "Untitled",
        content: content || "",
        platform,
        images: Array.isArray(images) ? images : [],
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
