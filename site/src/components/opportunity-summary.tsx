import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, DifficultyBadge } from "@/components/badge-tooltip";
import { SmartText } from "@/components/smart-text";
import type { OpportunityWithRelations } from "@/lib/queries";

export function OpportunitySummary({ opp }: { opp: OpportunityWithRelations }) {
  return (
    <Link href={`/opportunites/${opp.slug}`}>
      <Card className="border-border/50 bg-card/50 backdrop-blur hover:border-border transition-colors">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="outline" className="font-mono text-xs">
              #{opp.rank}
            </Badge>
            <StatusBadge status={opp.status} />
            <DifficultyBadge difficulty={opp.difficulty} />
            <Badge variant="outline" className="text-xs">
              {opp.sector}
            </Badge>
          </div>
          <CardTitle className="text-lg"><SmartText>{opp.title}</SmartText></CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            <SmartText>{opp.tagline}</SmartText>
          </CardDescription>
          <div className="mt-3 flex flex-wrap gap-3">
            {opp.signals.slice(0, 2).map((signal) => (
              <div
                key={signal.label}
                className="text-xs"
              >
                <span className="font-mono font-bold text-primary">
                  {signal.value}
                </span>{" "}
                <span className="text-muted-foreground"><SmartText>{signal.label}</SmartText></span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span>{opp.datasets.length} dataset{opp.datasets.length > 1 ? "s" : ""}</span>
            {opp.apis.length > 0 && (
              <span>{opp.apis.length} API{opp.apis.length > 1 ? "s" : ""}</span>
            )}
            <span><SmartText>{opp.monetization}</SmartText></span>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
