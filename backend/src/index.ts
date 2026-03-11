import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import { requireAuth } from "./middleware/requireAuth";
import { registerPatron } from "./routes/client";
import { getFinance, createFinance, saveAnalysis, getAnalyses } from "./routes/finance";
import { getPosts, createPost } from "./routes/posts";
import { Chat } from "./routes/ai/chat";
const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

app.post("/api/chat", Chat);

app.use(clerkMiddleware());

app.post("/api/onboarding", requireAuth, registerPatron);
app.get("/api/finance", requireAuth, getFinance);
app.post("/api/finance", requireAuth, createFinance);
app.get("/api/finance/analysis", requireAuth, getAnalyses);
app.post("/api/finance/analysis", requireAuth, saveAnalysis);
app.get("/api/posts", requireAuth, getPosts);
app.post("/api/posts", requireAuth, createPost);


const PORT = 8888;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
