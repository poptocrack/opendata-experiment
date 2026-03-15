import { Hero } from "@/components/hero";
import { Methodology } from "@/components/methodology";
import { RankingTable } from "@/components/ranking-table";
import { OpportunitySummary } from "@/components/opportunity-summary";
import { Footer } from "@/components/footer";
import { getOpportunities } from "@/lib/queries";

export default async function Home() {
  const opportunities = await getOpportunities();

  return (
    <div className="min-h-screen">
      <Hero count={opportunities.length} />
      <Methodology />
      <RankingTable opportunities={opportunities} />

      <section>
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
        </div>
      </section>

      <Footer />
    </div>
  );
}
