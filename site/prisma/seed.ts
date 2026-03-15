import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function loadJsonDir(dir: string) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((file) => JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8")));
}

async function seed() {
  const opportunities = loadJsonDir(path.join(__dirname, "opportunities"));
  const productDetails = loadJsonDir(path.join(__dirname, "products"));

  // Index product details by slug
  const detailsBySlug = new Map<string, any>();
  for (const detail of productDetails) {
    detailsBySlug.set(detail.productSlug, detail);
  }

  // Clear all
  await prisma.productDetail.deleteMany();
  await prisma.competitor.deleteMany();
  await prisma.targetCustomer.deleteMany();
  await prisma.productIdea.deleteMany();
  await prisma.api.deleteMany();
  await prisma.dataset.deleteMany();
  await prisma.signal.deleteMany();
  await prisma.opportunity.deleteMany();

  const slugCounts = new Map<string, number>();

  for (const opp of opportunities) {
    // Generate unique slugs for product ideas
    const productIdeasWithSlugs = opp.productIdeas.map(
      (text: string, i: number) => {
        let base = slugify(text);
        const count = slugCounts.get(base) || 0;
        const slug = count > 0 ? `${base}-${count}` : base;
        slugCounts.set(base, count + 1);
        return { text, slug, order: i };
      }
    );

    await prisma.opportunity.create({
      data: {
        id: opp.id,
        rank: opp.rank,
        title: opp.title,
        slug: opp.slug,
        sector: opp.sector ?? "autre",
        tagline: opp.tagline,
        status: opp.status,
        difficulty: opp.difficulty,
        marketSize: opp.marketSize,
        monetization: opp.monetization,
        context: opp.context,
        signals: {
          create: opp.signals.map((s: any, i: number) => ({ ...s, order: i })),
        },
        datasets: {
          create: opp.datasets.map((d: any, i: number) => ({ ...d, order: i })),
        },
        apis: {
          create: opp.apis.map((a: any, i: number) => ({ ...a, order: i })),
        },
        productIdeas: {
          create: productIdeasWithSlugs,
        },
        targetCustomers: {
          create: opp.targetCustomers.map((c: any, i: number) => ({
            ...c,
            order: i,
          })),
        },
        competitors: {
          create: opp.competitors.map((c: any, i: number) => ({
            ...c,
            order: i,
          })),
        },
        swot: opp.swot ? JSON.stringify(opp.swot) : null,
        personas: opp.personas ? JSON.stringify(opp.personas) : null,
      },
    });
  }

  // Seed product details
  let detailCount = 0;
  const allProducts = await prisma.productIdea.findMany();
  for (const product of allProducts) {
    const detail = detailsBySlug.get(product.slug);
    if (detail) {
      await prisma.productDetail.create({
        data: {
          productIdeaId: product.id,
          oneLiner: detail.oneLiner,
          problem: detail.problem,
          solution: detail.solution,
          uniqueValue: detail.uniqueValue,
          mvpScope: detail.mvpScope,
          timeToMvp: detail.timeToMvp,
          milestones: JSON.stringify(detail.milestones),
          validationChecks: JSON.stringify(detail.validationChecks),
          earlyAdopters: JSON.stringify(detail.earlyAdopters),
          pricingStrategy: detail.pricingStrategy,
          pathTo10kMrr: detail.pathTo10kMrr,
          techStack: JSON.stringify(detail.techStack),
          risks: JSON.stringify(detail.risks),
          inspirations: detail.inspirations ?? null,
          // Market validation fields (optional)
          searchVolume: detail.searchVolume ? JSON.stringify(detail.searchVolume) : null,
          tamSamSom: detail.tamSamSom ? JSON.stringify(detail.tamSamSom) : null,
          competitorDeep: detail.competitorDeep ? JSON.stringify(detail.competitorDeep) : null,
          legalConstraints: detail.legalConstraints ? JSON.stringify(detail.legalConstraints) : null,
          cacEstimate: detail.cacEstimate ? JSON.stringify(detail.cacEstimate) : null,
          viabilityScore: detail.viabilityScore ? JSON.stringify(detail.viabilityScore) : null,
          confidenceLevels: detail.confidenceLevels ? JSON.stringify(detail.confidenceLevels) : null,
        },
      });
      detailCount++;
    }
  }

  console.log(
    `Seeded ${opportunities.length} opportunities, ${allProducts.length} products, ${detailCount} product details`
  );
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
