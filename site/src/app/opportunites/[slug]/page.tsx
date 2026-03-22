import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getOpportunityBySlug, getOpportunities } from '@/lib/queries';
import { OpportunityCard } from '@/components/opportunity-card';
import { NewsletterInline } from '@/components/newsletter-inline';
import { CtaAnalyse } from '@/components/cta-analyse';
import { Footer } from '@/components/footer';

export async function generateStaticParams() {
  try {
    const opportunities = await getOpportunities();
    return opportunities.map((o) => ({ slug: o.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const opp = await getOpportunityBySlug(slug);
  if (!opp) return {};
  return {
    title: opp.title,
    description: opp.tagline,
    openGraph: {
      title: `${opp.title} — Le Filon`,
      description: opp.tagline,
      images: [{
        url: `/api/og/secteur/${slug}`,
        width: 1200,
        height: 630,
        alt: opp.title,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${opp.title} — Le Filon`,
      description: opp.tagline,
      images: [`/api/og/secteur/${slug}`],
    },
  };
}

export default async function OpportunityPage({
  params
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const opp = await getOpportunityBySlug(slug);

  if (!opp) notFound();

  const all = await getOpportunities();
  const currentIndex = all.findIndex((o) => o.slug === slug);
  const prev = currentIndex > 0 ? all[currentIndex - 1] : null;
  const next = currentIndex < all.length - 1 ? all[currentIndex + 1] : null;

  return (
    <div className="min-h-screen">
      <div className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Toutes les opportunites
          </Link>
        </div>
      </div>

      <section>
        <div className="mx-auto max-w-5xl px-6 py-10">
          <OpportunityCard opp={opp} />

          <div className="mt-8">
            <CtaAnalyse />
          </div>

          <div className="mt-8">
            <NewsletterInline />
          </div>

          <div className="mt-8 flex items-center justify-between">
            {prev ? (
              <Link
                href={`/opportunites/${prev.slug}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                &larr; {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/opportunites/${next.slug}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {next.title} &rarr;
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
