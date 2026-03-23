import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import { requireAuth } from "./middleware/requireAuth";
import {
  createCompany,
  deleteCompany,
  getAuditLog,
  getUsersofOrgbyId,
  readCompanydataById,
} from "./routes/admin";

import {
  registerMember,
  getCodeForMember,
  registerPatron,
} from "./routes/client";
import { getMembersInfo, DeleteMember, UpdateMember } from "./routes/company";
import {
  getFinance,
  createFinance,
  saveAnalysis,
  getAnalyses,
} from "./routes/finance";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  getPendingPosts,
  markPublished,
  requireApiKey,
  publishNow,
} from "./routes/posts";
import {
  getMarketingStrategy,
  saveMarketingStrategy,
} from "./routes/marketing";
import { Chat } from "./routes/ai/chat";
import { getCompanyData, getUsersData, adminAccess } from "./routes/admin";
import { AdminAuth } from "./middleware/adminAuth";
import { registerOrganization } from "./routes/client/regitserOrganization";

import { getCompany, updateCompany } from "./routes/company/updateOrganization";
import {
  getBillingStatus,
  createCheckout,
  stripeWebhook,
  createPortal,
} from "./routes/billing";
import { ActivityStatus, aiLimiting } from "./routes/client/activityStatus";

const app = express();
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  }),
);

// Stripe webhook needs raw body — register BEFORE express.json()
app.post(
  "/api/billing/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.post("/api/chat", Chat);

app.use(clerkMiddleware());
app.use(ActivityStatus);
//onboarding routes
app.post("/api/onboarding", requireAuth, registerPatron);
app.post("/api/onboarding/member", requireAuth, registerMember);
app.get("/api/onboarding/getcode", requireAuth, getCodeForMember);
app.post("/api/onboarding/org", requireAuth, registerOrganization);
//org executive personnel routes
app.get("/api/company/members", requireAuth, getMembersInfo);
app.delete("/api/company/members", requireAuth, DeleteMember);
app.post("/api/company/members", requireAuth, UpdateMember);
//finance routes

app.get("/api/finance", requireAuth, getFinance);
app.post("/api/finance", requireAuth, createFinance);
app.get("/api/finance/analysis", requireAuth, getAnalyses);
app.post("/api/finance/analysis", requireAuth, saveAnalysis);
//automation marketin routes?
app.get("/api/posts", requireAuth, getPosts);
app.post("/api/posts", requireAuth, createPost);
app.put("/api/posts/:id", requireAuth, updatePost);
// app.delete("/api/posts", requireAuth, deleteAllPosts);
app.delete("/api/posts/:id", requireAuth, deletePost);
app.post("/api/posts/:id/publish-now", requireAuth, publishNow);
app.get("/api/marketing/strategy", requireAuth, getMarketingStrategy);
app.post("/api/marketing/strategy", requireAuth, saveMarketingStrategy);
app.get("/api/facebook/pending-posts", requireApiKey, getPendingPosts);
app.post("/api/facebook/posts/:id/publish", requireApiKey, markPublished);

app.get("/api/company", requireAuth, getCompany);
app.put("/api/company", requireAuth, updateCompany);
app.get("/api/billing/status", requireAuth, getBillingStatus);
app.post("/api/billing/checkout", requireAuth, createCheckout);
app.post("/api/billing/portal", requireAuth, createPortal);
//admin routers
app.post("/api/admin", adminAccess);
app.get("/api/admin/companies", AdminAuth, getCompanyData);
app.get("/api/admin/companies/:orgId", AdminAuth, readCompanydataById);
app.post("/api/admin/companies", AdminAuth, createCompany);
app.delete("/api/admin/companies/:orgId", AdminAuth, deleteCompany);
app.get("/api/admin/clients", AdminAuth, getUsersData);
app.get("/api/admin/companies/:orgId/members", AdminAuth, getUsersofOrgbyId);

//activities log fetch request
app.get("/api/auditlog", getAuditLog);

//ai limiting
app.post("/api/limiting", requireAuth, aiLimiting);



const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
