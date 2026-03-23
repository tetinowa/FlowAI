import Stripe from "stripe";
import { Request, Response } from "express";
import prisma from "../../lib/prisma";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY)
    throw new Error("STRIPE_SECRET_KEY тохируулагдаагүй байна");
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

// GET /api/billing/status
export async function getBillingStatus(req: Request, res: Response) {
  try {
    const userId = req.clerkUserId;
    const client = await prisma.client.findUnique({ where: { id: userId } });
    if (!client?.orgId) return res.json({ success: true, patronage: "BASIC" });

    const org = await prisma.organization.findUnique({
      where: { id: client.orgId },
    });
    return res.json({ success: true, patronage: org?.patronage ?? "BASIC" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  }
}

// POST /api/billing/checkout
export async function createCheckout(req: Request, res: Response) {
  try {
    const stripe = getStripe();
    const userId = req.clerkUserId;
    const client = await prisma.client.findUnique({ where: { id: userId } });
    if (!client)
      return res.status(400).json({ error: "Client not found", userId });
    if (!client.orgId)
      return res.status(400).json({ error: "Client has no orgId", userId });

    const org = await prisma.organization.findUnique({
      where: { id: client.orgId },
    });
    if (!org)
      return res
        .status(400)
        .json({ error: "Org not found", orgId: client.orgId });

    let customerId = org.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: client.email,
        name: org.name,
        metadata: { orgId: org.id },
      });
      customerId = customer.id;
      // await prisma.organization.update({
      //   where: { id: org.id },
      //   data: { stripeCustomerId: customerId },
      // });
      await prisma.$transaction(async (tx) => {
        await tx.organization.update({
          where: { id: org.id },
          data: { stripeCustomerId: customerId },
        });

        await tx.auditLog.create({
          data: {
            clientId: userId as string, // real user triggered this
            action: "CREATE",
            target: "PATRONAGE",
            details: { orgId: org.id, customerId },
          },
        });
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/billing?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/billing?canceled=true`,
      metadata: { orgId: org.id },
    });

    res.json({ success: true, url: session.url });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ success: false, error: "Checkout үүсгэхэд алдаа гарлаа" });
  }
}

// POST /api/billing/webhook  (raw body)
export async function stripeWebhook(req: Request, res: Response) {
  const stripe = getStripe();
  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      (req as any).rawBody ?? req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orgId = session.metadata?.orgId;
    if (orgId && session.subscription) {
      await prisma.$transaction(async (tx) => {
        await tx.organization.update({
          where: { id: orgId },
          data: {
            patronage: "PRO",
            stripeSubscriptionId: session.subscription as string,
          },
        });

        await tx.auditLog.create({
          data: {
            clientId: "SYSTEM",
            action: "UPDATE",
            target: "PATRONAGE",
            details: {
              orgId,
              patronage: "PRO",
            },
          },
        });
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    await prisma.$transaction(async (tx) => {
      await tx.organization.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: { patronage: "BASIC", stripeSubscriptionId: null },
      });

      await tx.auditLog.create({
        data: {
          clientId: "SYSTEM",
          action: "UPDATE",
          target: "PATRONAGE",
          details: { subscriptionId: sub.id, patronage: "BASIC" },
        },
      });
    });
  }

  res.json({ received: true });
}

// POST /api/billing/portal
export async function createPortal(req: Request, res: Response) {
  try {
    const stripe = getStripe();
    const userId = req.clerkUserId;
    const client = await prisma.client.findUnique({ where: { id: userId } });
    if (!client?.orgId) return res.status(400).json({ error: "Org not found" });

    const org = await prisma.organization.findUnique({
      where: { id: client.orgId },
    });
    if (!org?.stripeCustomerId)
      return res.status(400).json({ error: "No Stripe customer" });

    const session = await stripe.billingPortal.sessions.create({
      customer: org.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/billing`,
    });

    res.json({ success: true, url: session.url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  }
}
