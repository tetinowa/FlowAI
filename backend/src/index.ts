import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import { requireAuth } from "./middleware/requireAuth";
import { registerPatron } from "./routes/client";
import { getFinance, createFinance, saveAnalysis, getAnalyses } from "./routes/finance";
import { getPosts, createPost, getPendingPosts, markPublished, requireApiKey } from "./routes/posts";
import { Chat } from "./routes/ai/chat";
import { getCompany, updateCompany } from "./routes/company/updateOrganization";
import { getBillingStatus, createCheckout, stripeWebhook, createPortal } from "./routes/billing";

const app = express();
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true,
}));

// Stripe webhook needs raw body — register BEFORE express.json()
app.post("/api/billing/webhook", express.raw({ type: "application/json" }), stripeWebhook);

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
app.get("/api/facebook/pending-posts", requireApiKey, getPendingPosts);
app.post("/api/facebook/posts/:id/publish", requireApiKey, markPublished);
app.get("/api/company", requireAuth, getCompany);
app.put("/api/company", requireAuth, updateCompany);
app.get("/api/billing/status", requireAuth, getBillingStatus);
app.post("/api/billing/checkout", requireAuth, createCheckout);
app.post("/api/billing/portal", requireAuth, createPortal);


const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
