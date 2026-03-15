import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const entry = await prisma.waitlistEntry.upsert({
      where: { email: email.toLowerCase().trim() },
      update: {},
      create: {
        email: email.toLowerCase().trim(),
        source: source ?? null,
      },
    });

    return NextResponse.json({ ok: true, id: entry.id });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
