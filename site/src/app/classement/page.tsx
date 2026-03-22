import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { hasValidAccess } from "@/lib/access";
import { SmartText } from "@/components/smart-text";
import { Footer } from "@/components/footer";
import { ClassementPaywall } from "./classement-paywall";

export const metadata: Metadata = {
  title: "Classement des produits par viabilité | Le Filon",
  description:
    "Tous les produits SaaS identifiés, classés par score de viabilité. Trouvez l'idée la plus viable pour vous lancer.",
};

export const dynamic = "force-dynamic";

type RankedProduct = {
  slug: string;
  text: string;
  sector: string;
  overallScore: number;
  views: number;
};

function scoreColor(score: number) {
  if (score >= 70) return "text-green-500";
  if (score >= 50) return "text-amber-500";
  return "text-red-500";
}

function scoreBg(score: number) {
  if (score >= 70) return "bg-green-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
}

export default async function ClassementPage() {
  const access = await hasValidAccess();

  const products = await prisma.productIdea.findMany({
    include: {
      detail: {
        select: { viabilityScore: true },
      },
      opportunity: {
        select: { sector: true },
      },
    },
  });

  const viewCounts = await prisma.pageView.groupBy({
    by: ["path"],
    where: {
      path: { startsWith: "/produits/" },
    },
    _count: { id: true },
  });

  const viewMap = new Map<string, number>();
  for (const v of viewCounts) {
    const slug = v.path.replace("/produits/", "");
    viewMap.set(slug, (viewMap.get(slug) ?? 0) + v._count.id);
  }

  const ranked: RankedProduct[] = products
    .map((p) => {
      let overallScore = 0;
      if (p.detail?.viabilityScore) {
        try {
          const vs = JSON.parse(p.detail.viabilityScore);
          const overall = vs.overall;
          overallScore =
            typeof overall === "object" && overall !== null
              ? (overall.score ?? 0)
              : (overall ?? 0);
        } catch {
          // ignore
        }
      }
      return {
        slug: p.slug,
        text: p.text,
        sector: p.opportunity.sector,
        overallScore,
        views: viewMap.get(p.slug) ?? 0,
      };
    })
    .sort((a, b) => b.overallScore - a.overallScore);

  const visibleRows = access ? ranked : ranked.slice(0, 10);
  const hiddenCount = ranked.length - visibleRows.length;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        <div>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
            <SmartText>Classement des produits par viabilité</SmartText>
          </h1>
          <p className="mt-2 text-muted-foreground">
            <SmartText>
              {`${ranked.length} produits classés du plus au moins viable. Score composite basé sur la demande, la faisabilité, le marché, la concurrence et le juridique.`}
            </SmartText>
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-semibold w-12">#</th>
                <th className="px-4 py-3 text-left font-semibold">
                  <SmartText>Produit</SmartText>
                </th>
                <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">
                  <SmartText>Secteur</SmartText>
                </th>
                <th className="px-4 py-3 text-center font-semibold w-24">
                  <SmartText>Score</SmartText>
                </th>
                <th className="px-4 py-3 text-center font-semibold w-20 hidden md:table-cell">
                  <SmartText>Vues</SmartText>
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((product, index) => (
                <tr
                  key={product.slug}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3">
                    {access ? (
                      <Link
                        href={`/produits/${product.slug}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        <SmartText>{product.text}</SmartText>
                      </Link>
                    ) : (
                      <span className="font-medium select-none blur-[6px]">
                        {product.text}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {access ? (
                      <SmartText>{product.sector}</SmartText>
                    ) : (
                      <span className="select-none blur-[6px]">{product.sector}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-2 w-12 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${scoreBg(product.overallScore)}`}
                          style={{ width: `${product.overallScore}%` }}
                        />
                      </div>
                      <span
                        className={`font-mono font-bold text-xs ${scoreColor(product.overallScore)}`}
                      >
                        {product.overallScore}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground font-mono text-xs hidden md:table-cell">
                    {product.views}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!access && hiddenCount > 0 && (
            <div className="relative">
              <div className="absolute -top-16 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
              <div className="border-t border-border bg-muted/30 px-4 py-3 text-center text-sm text-muted-foreground">
                + {hiddenCount} produits masqués
              </div>
            </div>
          )}
        </div>

        {!access && <ClassementPaywall />}
      </div>
      <Footer />
    </div>
  );
}
