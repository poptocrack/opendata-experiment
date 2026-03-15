import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SmartText } from '@/components/smart-text';
import type {
  SearchVol,
  TamSamSom,
  CompetitorDeep,
  CacEstimate,
  LegalConstraint
} from './types';

type Props = {
  searchVolumes: SearchVol[];
  tamSamSom: TamSamSom | null;
  competitorDeeps: CompetitorDeep[];
  cacEstimates: CacEstimate[];
  legalConstraints: LegalConstraint[];
};

export function MarketValidationSection({
  searchVolumes,
  tamSamSom,
  competitorDeeps,
  cacEstimates,
  legalConstraints
}: Props) {
  const hasContent =
    searchVolumes.length > 0 ||
    tamSamSom ||
    competitorDeeps.length > 0 ||
    legalConstraints.length > 0 ||
    cacEstimates.length > 0;

  if (!hasContent) return null;

  return (
    <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-blue-400 mb-6">
        Validation marché
      </h2>
      <div className="space-y-8">
        {searchVolumes.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3">Demande (volume de recherche)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">Mot-clé</th>
                    <th className="pb-2 pr-4 font-medium">Volume/mois</th>
                    <th className="pb-2 pr-4 font-medium hidden sm:table-cell">Difficulté</th>
                    <th className="pb-2 font-medium hidden md:table-cell">Intent</th>
                  </tr>
                </thead>
                <tbody>
                  {searchVolumes.map((sv, i) => (
                    <tr key={i} className="border-b border-border/30">
                      <td className="py-2 pr-4 font-mono text-xs">{sv.keyword}</td>
                      <td className="py-2 pr-4 font-bold text-primary">{sv.monthlyVolume}</td>
                      <td className="py-2 pr-4 hidden sm:table-cell">{sv.difficulty}</td>
                      <td className="py-2 hidden md:table-cell">
                        <Badge variant="outline" className="text-[10px]">
                          {sv.intent}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tamSamSom && (
          <div>
            <h3 className="text-sm font-semibold mb-3">Taille de marché</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <Card className="bg-muted/30">
                <CardContent className="py-3">
                  <div className="text-xs text-muted-foreground">
                    <SmartText>TAM (marché total)</SmartText>
                  </div>
                  <div className="mt-1 font-bold text-primary">
                    <SmartText>{tamSamSom.tam}</SmartText>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="py-3">
                  <div className="text-xs text-muted-foreground">
                    <SmartText>SAM (marché adressable)</SmartText>
                  </div>
                  <div className="mt-1 font-bold text-primary">
                    <SmartText>{tamSamSom.sam}</SmartText>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="py-3">
                  <div className="text-xs text-muted-foreground">
                    <SmartText>SOM (objectif 18 mois)</SmartText>
                  </div>
                  <div className="mt-1 font-bold text-primary">
                    <SmartText>{tamSamSom.som}</SmartText>
                  </div>
                </CardContent>
              </Card>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              <SmartText>{tamSamSom.methodology}</SmartText>
            </p>
          </div>
        )}

        {competitorDeeps.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3">Analyse concurrentielle</h3>
            <div className="space-y-3">
              {competitorDeeps.map((c, i) => (
                <Card key={i} className="bg-muted/20">
                  <CardContent className="py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-medium text-sm">
                          <SmartText>{c.name}</SmartText>
                        </span>
                        {c.url && (
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-xs text-primary/70 hover:underline"
                          >
                            {c.url}
                          </a>
                        )}
                      </div>
                      {c.trafficEstimate && (
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          {c.trafficEstimate}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2 text-xs">
                      {c.pricing && (
                        <div>
                          <span className="text-muted-foreground">Prix : </span>
                          <SmartText>{c.pricing}</SmartText>
                        </div>
                      )}
                      {c.reviews && (
                        <div>
                          <span className="text-muted-foreground">Avis : </span>
                          <SmartText>{c.reviews}</SmartText>
                        </div>
                      )}
                      {c.strengths && (
                        <div>
                          <span className="text-green-400">Forces : </span>
                          <span className="text-muted-foreground">
                            <SmartText>{c.strengths}</SmartText>
                          </span>
                        </div>
                      )}
                      {c.weaknesses && (
                        <div>
                          <span className="text-red-400">Faiblesses : </span>
                          <span className="text-muted-foreground">
                            <SmartText>{c.weaknesses}</SmartText>
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {cacEstimates.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3">
              <SmartText>Coût d'acquisition (CAC)</SmartText>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">Canal</th>
                    <th className="pb-2 pr-4 font-medium">
                      <SmartText>CAC estimé</SmartText>
                    </th>
                    <th className="pb-2 pr-4 font-medium hidden sm:table-cell">Taux conv.</th>
                    <th className="pb-2 pr-4 font-medium hidden md:table-cell">
                      <SmartText>LTV</SmartText>
                    </th>
                    <th className="pb-2 font-medium hidden md:table-cell">
                      <SmartText>LTV/CAC</SmartText>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cacEstimates.map((cac, i) => (
                    <tr key={i} className="border-b border-border/30">
                      <td className="py-2 pr-4">{cac.channel}</td>
                      <td className="py-2 pr-4 font-mono font-bold">
                        <SmartText>{cac.cacEstimate}</SmartText>
                      </td>
                      <td className="py-2 pr-4 hidden sm:table-cell">{cac.conversionRate}</td>
                      <td className="py-2 pr-4 hidden md:table-cell">{cac.ltv}</td>
                      <td className="py-2 hidden md:table-cell">
                        <Badge variant="outline" className="text-xs">
                          {cac.ltvCacRatio}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {legalConstraints.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3">Contraintes juridiques</h3>
            <div className="space-y-2">
              {legalConstraints.map((lc, i) => {
                const statusColor =
                  lc.status === 'ok'
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : lc.status === 'bloquant'
                      ? 'bg-red-500/20 text-red-400 border-red-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30';
                return (
                  <div key={i} className="rounded-lg border border-border/50 p-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className={statusColor}>{lc.status}</Badge>
                      <span className="font-medium">
                        <SmartText>{lc.topic}</SmartText>
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      <SmartText>{lc.detail}</SmartText>
                    </p>
                    {lc.source && (
                      <p className="mt-1 text-[10px] text-muted-foreground/60">
                        Source : <SmartText>{lc.source}</SmartText>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
