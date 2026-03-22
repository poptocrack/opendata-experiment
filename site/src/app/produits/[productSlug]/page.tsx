import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getProductBySlug,
  getProductSlugs,
  type ProductWithDetail,
} from '@/lib/queries';
import { hasValidAccess } from '@/lib/access';
import { Footer } from '@/components/footer';
import { CtaAnalyse } from '@/components/cta-analyse';
import { Paywall } from '@/components/paywall';
import {
  ProductBreadcrumb,
  ProductHeader,
  ProductEmptyState,
  ProductDetailContent,
  ViabilityScoreCard,
  VisionCards,
} from '@/components/product-detail';
import type {
  Milestone,
  ValidationCheck,
  EarlyAdopter,
  TechStack,
  Risk,
  SearchVol,
  TamSamSom,
  CompetitorDeep,
  LegalConstraint,
  CacEstimate,
  ConfidenceLevels
} from '@/components/product-detail';

export async function generateStaticParams(): Promise<{ productSlug: string }[]> {
  try {
    const products = await getProductSlugs();
    return products.map((p) => ({ productSlug: p.slug }));
  } catch {
    // En dev, DATABASE_URL peut être absent — les pages seront rendues à la demande
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}): Promise<Metadata> {
  const { productSlug } = await params;
  const product = await getProductBySlug(productSlug);
  if (!product) return {};
  const detail = product.detail;
  return {
    title: product.text,
    description: detail?.oneLiner ?? `Idée de produit dans le secteur ${product.opportunity.sector}`,
    openGraph: {
      title: `${product.text} — Le Filon`,
      description: detail?.oneLiner ?? product.text,
      images: [{
        url: `/api/og/produit/${productSlug}`,
        width: 1200,
        height: 630,
        alt: product.text,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.text} — Le Filon`,
      description: detail?.oneLiner ?? product.text,
      images: [`/api/og/produit/${productSlug}`],
    },
  };
}

function parseDetail(detail: ProductWithDetail['detail']) {
  if (!detail) return null;
  return {
    milestones: (detail.milestones ? JSON.parse(detail.milestones) : []) as Milestone[],
    validationChecks: (detail.validationChecks
      ? JSON.parse(detail.validationChecks)
      : []) as ValidationCheck[],
    earlyAdopters: (detail.earlyAdopters ? JSON.parse(detail.earlyAdopters) : []) as EarlyAdopter[],
    techStack: detail.techStack ? (JSON.parse(detail.techStack) as TechStack) : null,
    risks: (detail.risks ? JSON.parse(detail.risks) : []) as Risk[],
    searchVolumes: (detail.searchVolume ? JSON.parse(detail.searchVolume) : []) as SearchVol[],
    tamSamSom: detail.tamSamSom ? (JSON.parse(detail.tamSamSom) as TamSamSom) : null,
    competitorDeeps: (detail.competitorDeep
      ? JSON.parse(detail.competitorDeep)
      : []) as CompetitorDeep[],
    legalConstraints: (detail.legalConstraints
      ? JSON.parse(detail.legalConstraints)
      : []) as LegalConstraint[],
    cacEstimates: (detail.cacEstimate ? JSON.parse(detail.cacEstimate) : []) as CacEstimate[],
    confidenceLevels: detail.confidenceLevels
      ? (JSON.parse(detail.confidenceLevels) as ConfidenceLevels)
      : null,
    viabilityScore: detail.viabilityScore
      ? JSON.parse(detail.viabilityScore) as Record<string, number | { score: number; detail?: string }>
      : null
  };
}

export const dynamic = 'force-dynamic';

export default async function ProductPage({
  params
}: Readonly<{
  params: Promise<{ productSlug: string }>;
}>) {
  const { productSlug } = await params;
  const product: ProductWithDetail | null = await getProductBySlug(productSlug);

  if (!product) notFound();

  const detail = product.detail;
  const opp = product.opportunity;
  const parsed = detail ? parseDetail(detail) : null;

  const access = await hasValidAccess();

  let mainContent;
  if (!detail || !parsed) {
    mainContent = <ProductEmptyState opportunitySlug={opp.slug} opportunityTitle={opp.title} />;
  } else if (access) {
    mainContent = <ProductDetailContent detail={detail} opp={opp} parsed={parsed} />;
  } else {
    // Free teaser: ViabilityScoreCard + VisionCards, then Paywall
    mainContent = (
      <>
        {parsed.viabilityScore && (
          <ViabilityScoreCard viabilityScore={parsed.viabilityScore} />
        )}
        <VisionCards
          problem={detail.problem}
          solution={detail.solution}
          uniqueValue={detail.uniqueValue}
        />
        <Paywall />
      </>
    );
  }

  return (
    <div className="min-h-screen">
      <ProductBreadcrumb opportunitySlug={opp.slug} opportunityTitle={opp.title} />

      <div className="mx-auto max-w-4xl px-6 py-10 space-y-10">
        <ProductHeader
          productTitle={product.text}
          sector={opp.sector}
          difficulty={opp.difficulty}
          detail={detail ? { timeToMvp: detail.timeToMvp, oneLiner: detail.oneLiner } : null}
        />

        {mainContent}
      </div>

      <div className="mx-auto max-w-4xl px-6 pb-12">
        <CtaAnalyse />
      </div>

      <Footer />
    </div>
  );
}
