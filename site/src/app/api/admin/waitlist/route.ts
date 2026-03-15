import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const secret = process.env.ADMIN_SECRET;

  const isDev = process.env.NODE_ENV === "development";
  if (!isDev && (!secret || token !== secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await prisma.waitlistEntry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    total: entries.length,
    entries,
  });
}
