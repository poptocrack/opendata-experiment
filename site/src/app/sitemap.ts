import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://lefilon.net";

  try {
    const opportunities = await prisma.opportunity.findMany({
      select: { slug: true, updatedAt: true },
    });

    const products = await prisma.productIdea.findMany({
      select: { slug: true },
    });

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 1,
      },
      ...opportunities.map((opp) => ({
        url: `${baseUrl}/opportunites/${opp.slug}`,
        lastModified: opp.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...products.map((p) => ({
        url: `${baseUrl}/produits/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return [{ url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
  }
}
