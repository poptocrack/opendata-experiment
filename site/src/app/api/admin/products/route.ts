import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

function isAuthorized(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const secret = process.env.ADMIN_SECRET;
  const isDev = process.env.NODE_ENV === "development";
  return isDev || (secret && token === secret);
}

// GET — list all products with lock status
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.productIdea.findMany({
    select: {
      id: true,
      slug: true,
      text: true,
      unlocked: true,
      opportunity: { select: { title: true, sector: true } },
    },
    orderBy: [{ opportunity: { rank: "asc" } }, { order: "asc" }],
  });

  return NextResponse.json({ products });
}

// PATCH — toggle unlock status + revalidate the page
export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, unlocked } = await req.json();

  if (typeof id !== "number" || typeof unlocked !== "boolean") {
    return NextResponse.json({ error: "id (number) et unlocked (boolean) requis" }, { status: 400 });
  }

  const product = await prisma.productIdea.update({
    where: { id },
    data: { unlocked },
    select: { id: true, slug: true, unlocked: true },
  });

  // Revalidate the product page — Next.js regénère la page SSG en arrière-plan
  revalidatePath(`/produits/${product.slug}`);

  return NextResponse.json({ ok: true, id: product.id, unlocked: product.unlocked });
}
