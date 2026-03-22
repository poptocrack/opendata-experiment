import type { MetadataRoute } from "next";
import { getOpportunities, getProductSlugs } from "@/lib/queries";

const BASE_URL = "https://lefilon.net";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [opportunities, productSlugs] = await Promise.all([
    getOpportunities(),
    getProductSlugs(),
  ]);

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...opportunities.map((opp) => ({
      url: `${BASE_URL}/opportunites/${opp.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...productSlugs.map((product) => ({
      url: `${BASE_URL}/produits/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
