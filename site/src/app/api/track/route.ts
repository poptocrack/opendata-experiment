import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { path, referrer } = await req.json();

    if (!path || typeof path !== "string") {
      return NextResponse.json({ error: "path requis" }, { status: 400 });
    }

    // Device detection from User-Agent
    const ua = req.headers.get("user-agent") ?? "";
    const device = /Mobile|Android|iPhone/i.test(ua)
      ? "mobile"
      : /Tablet|iPad/i.test(ua)
        ? "tablet"
        : "desktop";

    // Country from Cloudflare/Caddy headers (if available)
    const country =
      req.headers.get("cf-ipcountry") ??
      req.headers.get("x-country") ??
      null;

    await prisma.pageView.create({
      data: {
        path,
        referrer: referrer || null,
        device,
        country,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
