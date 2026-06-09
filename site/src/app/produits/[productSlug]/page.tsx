import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getProductBySlug,
  getProductSlugs,
  type ProductWithDetail,
} from '@/lib/queries';
import { hasValidAccess } from '@/lib/access';
import { isFreeSample } from '@/lib/sample';
import { Footer } from '@/components/footer';
import { CtaAnalyse } from '@/components/cta-analyse';
import { Paywall } from '@/components/paywall';
import { BuyAccessCTA } from '@/components/buy-access-cta';
import { SmartText } from '@/components/smart-text';
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

  // Accès payant uniquement (cookie d'achat vérifié côté serveur).
  // NB : on n'utilise PAS le flag DB `product.unlocked` pour le gating public —
  // la fiche offerte en démo est pilotée par le code (isFreeSample) pour rester
  // prévisible et indépendante de l'état de la base.
  const fullAccess = await hasValidAccess();
  // Fiche offerte en démo : visible par tous, mais on garde un CTA d'achat pour convertir.
  const sampleAccess = !fullAccess && isFreeSample(productSlug);

  let mainContent;
  if (!detail || !parsed) {
    mainContent = <ProductEmptyState opportunitySlug={opp.slug} opportunityTitle={opp.title} />;
  } else if (fullAccess) {
    mainContent = <ProductDetailContent detail={detail} opp={opp} parsed={parsed} />;
  } else if (sampleAccess) {
    // Échantillon gratuit : fiche complète + bannière + CTA d'achat pour les 89 autres.
    mainContent = (
      <>
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-sm text-amber-800 dark:text-amber-300">
          <svg className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V5a5 5 0 0 1 9.9-1" />
          </svg>
          <SmartText>
            Fiche exemple en accès libre — c&apos;est exactement le niveau de détail des 89 autres fiches, débloquées avec l&apos;accès complet.
          </SmartText>
        </div>
        <ProductDetailContent detail={detail} opp={opp} parsed={parsed} />
        <BuyAccessCTA
          source="sample-checkout"
          headline="Cette fiche vous a convaincu ? Débloquez les 89 autres."
          subtext="Même niveau de détail pour 90 idées de produit, classées par score de viabilité. Accès à vie, pas d'abonnement."
          showSampleLink={false}
        />
      </>
    );
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
