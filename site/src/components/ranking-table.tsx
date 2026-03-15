import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SmartText } from "@/components/smart-text";
import type { OpportunityWithRelations } from "@/lib/queries";

export function RankingTable({ opportunities }: { opportunities: OpportunityWithRelations[] }) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Classement
        </h2>
        <p className="mt-2 text-2xl font-bold">Top opportunités</p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">#</th>
                <th className="pb-3 pr-4 font-medium">Opportunite</th>
                <th className="pb-3 pr-4 font-medium hidden sm:table-cell">Secteur</th>
                <th className="pb-3 pr-4 font-medium hidden md:table-cell">Difficulte</th>
                <th className="pb-3 font-medium hidden lg:table-cell">Monetisation</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opp) => (
                <tr key={opp.id} className="border-b border-border/50">
                  <td className="py-4 pr-4 font-mono font-bold text-primary/60">
                    {opp.rank}
                  </td>
                  <td className="py-4 pr-4">
                    <Link
                      href={`/opportunites/${opp.slug}`}
                      className="font-medium hover:underline"
                    >
                      <SmartText>{opp.title}</SmartText>
                    </Link>
                  </td>
                  <td className="py-4 pr-4 hidden sm:table-cell">
                    <Badge variant="outline" className="capitalize">
                      {opp.sector}
                    </Badge>
                  </td>
                  <td className="py-4 pr-4 hidden md:table-cell">
                    <Badge variant="outline" className="capitalize">
                      {opp.difficulty}
                    </Badge>
                  </td>
                  <td className="py-4 text-muted-foreground hidden lg:table-cell">
                    <SmartText>{opp.monetization}</SmartText>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
