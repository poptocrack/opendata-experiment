import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function isAuthorized(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const secret = process.env.ADMIN_SECRET;
  const isDev = process.env.NODE_ENV === "development";
  return isDev || (secret && token === secret);
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const purchases = await prisma.purchase.findMany({
    select: {
      id: true,
      email: true,
      stripeSessionId: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ purchases });
}
