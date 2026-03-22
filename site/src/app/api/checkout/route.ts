import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: 7900,
            product_data: {
              name: "Le Filon — Accès complet à vie",
              description:
                "90+ fiches produit détaillées avec validation marché, roadmap MVP, score de viabilité et classement.",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://lefilon.net"}/acces?token={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://lefilon.net"}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session de paiement" },
      { status: 500 }
    );
  }
}
