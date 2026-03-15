import { notFound } from 'next/navigation';
import {
  getProductBySlug,
  getProductSlugs,
  type ProductWithDetail,
} from '@/lib/queries';
import { Footer } from '@/components/footer';
import {
  ProductBreadcrumb,
  ProductHeader,
  ProductEmptyState,
  ProductDetailContent
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
  const products = await getProductSlugs();
  return products.map((p) => ({ productSlug: p.slug }));
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

        {detail && parsed ? (
          <ProductDetailContent detail={detail} opp={opp} parsed={parsed} />
        ) : (
          <ProductEmptyState opportunitySlug={opp.slug} opportunityTitle={opp.title} />
        )}
      </div>

      <Footer />
    </div>
  );
}
