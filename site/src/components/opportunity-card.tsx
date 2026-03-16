import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { StatusBadge, DifficultyBadge } from '@/components/badge-tooltip';
import { SmartText } from '@/components/smart-text';
import type { OpportunityWithRelations } from '@/lib/queries';

export function OpportunityCard({ opp }: { opp: OpportunityWithRelations }) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur" id={opp.slug}>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="outline" className="font-mono text-xs">
            #{opp.rank}
          </Badge>
          <StatusBadge status={opp.status} />
          <DifficultyBadge difficulty={opp.difficulty} />
        </div>
        <CardTitle className="text-xl">
          <SmartText>{opp.title}</SmartText>
        </CardTitle>
        <CardDescription className="text-base leading-relaxed">
          <SmartText>{opp.tagline}</SmartText>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Signals */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Signaux détectés
          </h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {opp.signals.map((signal) => (
              <div
                key={signal.label}
                className="rounded-lg border border-border/50 bg-muted/30 p-3"
              >
                <div className="font-mono text-lg font-bold text-primary">{signal.value}</div>
                <div className="text-sm font-medium">
                  <SmartText>{signal.label}</SmartText>
                </div>
                {signal.detail && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    <SmartText>{signal.detail}</SmartText>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Datasets */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Datasets utilises
          </h4>
          <div className="space-y-2">
            {opp.datasets.map((ds) => (
              <div key={ds.id} className="rounded-lg border border-border/50 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <a
                      href={`https://www.data.gouv.fr/datasets/${ds.datasetId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:underline"
                    >
                      {ds.name}
                    </a>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      <SmartText>{ds.description}</SmartText>
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-xs">
                    {ds.updateFrequency}
                  </Badge>
                </div>
                <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                  <span>{ds.visits} visites</span>
                  <span>{ds.downloads} telechargements</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* APIs */}
        {opp.apis.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                APIs disponibles
              </h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {opp.apis.map((api) => (
                  <div
                    key={api.name}
                    className="rounded-lg border border-border/50 bg-muted/20 p-3"
                  >
                    <div className="font-medium text-sm">{api.name}</div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      <SmartText>{api.description}</SmartText>
                    </p>
                    <code className="mt-2 block text-xs text-primary/70 truncate">
                      {api.baseUrl}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Product ideas */}
        <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              {opp.productIdeas.length} idées de produit — fiches détaillées
            </h4>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {opp.productIdeas.map((idea) => (
              <Link
                key={idea.id}
                href={`/produits/${idea.slug}`}
                className="group flex items-start gap-2 rounded-md border border-border/50 bg-card/80 p-3 text-sm hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60 group-hover:bg-primary" />
                <span className="group-hover:text-foreground transition-colors">
                  {idea.text}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <Separator />

        {/* Customers & pricing */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Clients ciblés
            </h4>
            <div className="space-y-2">
              {opp.targetCustomers.map((c) => (
                <div key={c.segment} className="flex items-center justify-between text-sm">
                  <span>
                    <SmartText>{c.segment}</SmartText>
                  </span>
                  <span className="font-mono text-muted-foreground">{c.priceRange}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Concurrence
            </h4>
            <div className="space-y-2">
              {opp.competitors.map((c) => (
                <div key={c.name} className="text-sm">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-muted-foreground">
                    {' '}
                    , <SmartText>{c.weakness}</SmartText>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Context */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Contexte & analyse
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <SmartText>{opp.context}</SmartText>
          </p>
        </div>

        {/* SWOT */}
        {opp.swot &&
          (() => {
            const swot = JSON.parse(opp.swot) as {
              strengths: string[];
              weaknesses: string[];
              opportunities: string[];
              threats: string[];
            };
            return (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Analyse SWOT
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3">
                      <div className="text-xs font-bold text-green-400 mb-2">Forces</div>
                      <ul className="space-y-1">
                        {swot.strengths.map((s, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-green-500" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                      <div className="text-xs font-bold text-red-400 mb-2">Faiblesses</div>
                      <ul className="space-y-1">
                        {swot.weaknesses.map((s, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-red-500" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
                      <div className="text-xs font-bold text-blue-400 mb-2">Opportunites</div>
                      <ul className="space-y-1">
                        {swot.opportunities.map((s, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-blue-500" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                      <div className="text-xs font-bold text-amber-400 mb-2">Menaces</div>
                      <ul className="space-y-1">
                        {swot.threats.map((s, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}

        {/* Personas */}
        {opp.personas &&
          (() => {
            const personas = JSON.parse(opp.personas) as {
              name: string;
              role: string;
              age: string;
              context: string;
              painPoints: string[];
              currentSolution: string;
              budget: string;
              channels: string[];
            }[];
            return (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Personas cibles
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {personas.map((p, i) => (
                      <div key={i} className="rounded-lg border border-border/50 p-3">
                        <div className="font-medium text-sm">
                          {p.name}, {p.age}
                        </div>
                        <div className="text-xs text-primary/80">{p.role}</div>
                        <p className="mt-2 text-xs text-muted-foreground">{p.context}</p>
                        <div className="mt-2">
                          <div className="text-[10px] font-semibold text-muted-foreground uppercase">
                            Frustrations
                          </div>
                          <ul className="mt-1 space-y-0.5">
                            {p.painPoints.map((pp, j) => (
                              <li key={j} className="text-[11px] text-muted-foreground">
                                - {pp}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-2 text-[11px] text-muted-foreground">
                          <span className="font-medium text-foreground">Aujourd'hui : </span>
                          {p.currentSolution}
                        </div>
                        <div className="mt-1 text-[11px] text-muted-foreground">
                          <span className="font-medium text-foreground">Budget : </span>
                          {p.budget}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {p.channels.map((c, j) => (
                            <span key={j} className="text-[10px] rounded bg-muted px-1.5 py-0.5">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            );
          })()}
      </CardContent>
    </Card>
  );
}
