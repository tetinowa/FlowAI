"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const express_2 = require("@clerk/express");
const requireAuth_1 = require("./middleware/requireAuth");
const client_1 = require("./routes/client");
const finance_1 = require("./routes/finance");
const posts_1 = require("./routes/posts");
const chat_1 = require("./routes/ai/chat");
const updateOrganization_1 = require("./routes/company/updateOrganization");
const billing_1 = require("./routes/billing");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
}));
// Stripe webhook needs raw body — register BEFORE express.json()
app.post("/api/billing/webhook", express_1.default.raw({ type: "application/json" }), billing_1.stripeWebhook);
app.use(express_1.default.json());
app.post("/api/chat", chat_1.Chat);
app.use((0, express_2.clerkMiddleware)());
app.post("/api/onboarding", requireAuth_1.requireAuth, client_1.registerPatron);
app.get("/api/finance", requireAuth_1.requireAuth, finance_1.getFinance);
app.post("/api/finance", requireAuth_1.requireAuth, finance_1.createFinance);
app.get("/api/finance/analysis", requireAuth_1.requireAuth, finance_1.getAnalyses);
app.post("/api/finance/analysis", requireAuth_1.requireAuth, finance_1.saveAnalysis);
app.get("/api/posts", requireAuth_1.requireAuth, posts_1.getPosts);
app.post("/api/posts", requireAuth_1.requireAuth, posts_1.createPost);
app.get("/api/facebook/pending-posts", posts_1.requireApiKey, posts_1.getPendingPosts);
app.post("/api/facebook/posts/:id/publish", posts_1.requireApiKey, posts_1.markPublished);
app.get("/api/company", requireAuth_1.requireAuth, updateOrganization_1.getCompany);
app.put("/api/company", requireAuth_1.requireAuth, updateOrganization_1.updateCompany);
app.get("/api/billing/status", requireAuth_1.requireAuth, billing_1.getBillingStatus);
app.post("/api/billing/checkout", requireAuth_1.requireAuth, billing_1.createCheckout);
app.post("/api/billing/portal", requireAuth_1.requireAuth, billing_1.createPortal);
const PORT = 8888;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
