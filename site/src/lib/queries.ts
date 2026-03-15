import type {
  ProductIdea,
  ProductDetail,
  Dataset,
  Api,
  TargetCustomer,
  Competitor,
} from "@prisma/client";
import { prisma } from "./db";

/** Forme de l'opportunité telle que retournée par getProductBySlug (inclut les champs utilisés par la page produit) */
export type OpportunityForProduct = {
  slug: string;
  title: string;
  sector: string;
  difficulty: string;
  datasets: Dataset[];
  apis: Api[];
  targetCustomers: TargetCustomer[];
  competitors: Competitor[];
};

/** Type explicite pour éviter les erreurs d'inférence de Prisma.ProductIdeaGetPayload */
export type ProductWithDetail = ProductIdea & {
  detail: ProductDetail | null;
  opportunity: OpportunityForProduct;
};

const productBySlugInclude = {
  detail: true,
  opportunity: {
    include: {
      datasets: { orderBy: { order: "asc" as const } },
      apis: { orderBy: { order: "asc" as const } },
      targetCustomers: { orderBy: { order: "asc" as const } },
      competitors: { orderBy: { order: "asc" as const } },
    },
  },
} as const;

const opportunityInclude = {
  signals: { orderBy: { order: "asc" as const } },
  datasets: { orderBy: { order: "asc" as const } },
  apis: { orderBy: { order: "asc" as const } },
  productIdeas: {
    orderBy: { order: "asc" as const },
    include: { detail: true },
  },
  targetCustomers: { orderBy: { order: "asc" as const } },
  competitors: { orderBy: { order: "asc" as const } },
};

export async function getOpportunities() {
  return prisma.opportunity.findMany({
    orderBy: { rank: "asc" },
    include: opportunityInclude,
  });
}

export async function getOpportunityBySlug(slug: string) {
  return prisma.opportunity.findUnique({
    where: { slug },
    include: opportunityInclude,
  });
}

export async function getProductSlugs(): Promise<{ slug: string }[]> {
  return prisma.productIdea.findMany({
    select: { slug: true },
    orderBy: { order: "asc" },
  });
}

export async function getProductBySlug(
  productSlug: string
): Promise<ProductWithDetail | null> {
  const result = await prisma.productIdea.findUnique({
    where: { slug: productSlug },
    include: productBySlugInclude,
  });
  return result as ProductWithDetail | null;
}

export type OpportunityWithRelations = NonNullable<
  Awaited<ReturnType<typeof getOpportunityBySlug>>
>;
