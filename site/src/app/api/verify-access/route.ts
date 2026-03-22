import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("lefilon_access")?.value;

  if (!token) {
    return NextResponse.json({ hasAccess: false });
  }

  const purchase = await prisma.purchase.findUnique({
    where: { token },
  });

  return NextResponse.json({ hasAccess: !!purchase });
}
