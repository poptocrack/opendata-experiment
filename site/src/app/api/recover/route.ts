import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    const purchase = await prisma.purchase.findFirst({
      where: { email: email.toLowerCase().trim() },
      orderBy: { createdAt: "desc" },
    });

    if (!purchase) {
      // Don't reveal whether the email exists
      return NextResponse.json({ ok: true });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://lefilon.net";
    const magicLink = `${baseUrl}/acces?magic=${purchase.token}`;

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Le Filon <noreply@lefilon.net>",
      to: email.toLowerCase().trim(),
      subject: "Votre lien d'accès — Le Filon",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
          <h2 style="font-size: 20px; margin-bottom: 16px;">Retrouvez votre accès</h2>
          <p style="color: #666; line-height: 1.6;">
            Cliquez sur le bouton ci-dessous pour retrouver votre accès complet à Le Filon.
            Ce lien est valable indéfiniment.
          </p>
          <a href="${magicLink}" style="display: inline-block; margin-top: 24px; background: #d97706; color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600;">
            Accéder à Le Filon
          </a>
          <p style="color: #999; font-size: 13px; margin-top: 32px;">
            Si vous n'avez pas demandé ce lien, ignorez cet email.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Recovery email error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
