import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "Session ID manquant" },
        { status: 400 }
      );
    }

    // Verify session with Stripe
    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Paiement non confirmé" },
        { status: 400 }
      );
    }

    // Check if purchase already exists for this session
    const existing = await prisma.purchase.findUnique({
      where: { stripeSessionId: sessionId },
    });

    if (existing) {
      return NextResponse.json({ token: existing.token });
    }

    // Create purchase (in case webhook hasn't fired yet)
    const email =
      session.customer_details?.email ??
      session.customer_email ??
      "unknown";
    const token = randomBytes(16).toString("hex");

    const purchase = await prisma.purchase.create({
      data: {
        email,
        token,
        stripeSessionId: sessionId,
      },
    });

    return NextResponse.json({ token: purchase.token });
  } catch (error) {
    console.error("Activate error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'activation" },
      { status: 500 }
    );
  }
}
