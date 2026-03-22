import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Signature invalide" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.customer_details?.email ?? session.customer_email ?? "unknown";
    const token = randomBytes(16).toString("hex");

    // Avoid duplicate entries for the same session
    const existing = await prisma.purchase.findUnique({
      where: { stripeSessionId: session.id },
    });

    if (!existing) {
      await prisma.purchase.create({
        data: {
          email,
          token,
          stripeSessionId: session.id,
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
