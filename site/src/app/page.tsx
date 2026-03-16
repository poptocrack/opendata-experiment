import { Hero } from "@/components/hero";
import { Methodology } from "@/components/methodology";
import { RankingTable } from "@/components/ranking-table";
import { OpportunitySummary } from "@/components/opportunity-summary";
import { NewsletterInline } from "@/components/newsletter-inline";
import { Footer } from "@/components/footer";
import { getOpportunities } from "@/lib/queries";

export default async function Home() {
  const opportunities = await getOpportunities();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Le Filon",
    url: "https://lefilon.net",
    description:
      "Étude de marché sur les opportunités de produits SaaS exploitant les données ouvertes françaises (data.gouv.fr). 17 secteurs, 90 idées de produit.",
    publisher: {
      "@type": "Organization",
      name: "Le Filon",
    },
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero count={opportunities.length} />

      {/* CTA direct vers les opportunités — réduit le drop */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-5xl px-6 py-8 text-center">
          <p className="text-lg font-semibold">
            {opportunities.length} secteurs analysés, {opportunities.reduce((acc, o) => acc + o.productIdeas.length, 0)} idées de produit avec fiche détaillée
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Chaque fiche contient : scope MVP, roadmap, validation terrain, analyse concurrentielle, chemin vers 10K€ MRR et score de viabilité.
          </p>
          <a
            href="#secteurs"
            className="mt-4 inline-block rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Explorer les secteurs
          </a>
        </div>
      </section>

      <Methodology />
      <RankingTable opportunities={opportunities} />

      <section id="secteurs">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Opportunités
          </h2>
          <p className="mt-2 text-2xl font-bold">Toutes les fiches</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {opportunities.map((opp) => (
              <OpportunitySummary key={opp.id} opp={opp} />
            ))}
          </div>

          <div className="mt-12">
            <NewsletterInline />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
