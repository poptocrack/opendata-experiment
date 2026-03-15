import { Card, CardContent } from '@/components/ui/card';
import type { ParsedProductDetail } from './types';

const SCORE_KEYS = ['demand', 'feasibility', 'market', 'competition', 'legal'] as const;
const LABELS: Record<(typeof SCORE_KEYS)[number], string> = {
  demand: 'Demande',
  feasibility: 'Faisabilité',
  market: 'Marché',
  competition: 'Concurrence',
  legal: 'Juridique'
};

function getVal(
  viabilityScore: NonNullable<ParsedProductDetail['viabilityScore']>,
  key: string
): number {
  const v = viabilityScore[key];
  return typeof v === 'object' && v !== null
    ? ((v as Record<string, unknown>).score as number)
    : ((v as number) ?? 0);
}

function getDetail(
  viabilityScore: NonNullable<ParsedProductDetail['viabilityScore']>,
  key: string
): string | undefined {
  const v = viabilityScore[key];
  return typeof v === 'object' && v !== null
    ? ((v as Record<string, unknown>).detail as string)
    : undefined;
}

type Props = {
  viabilityScore: NonNullable<ParsedProductDetail['viabilityScore']>;
};

export function ViabilityScoreCard({ viabilityScore }: Props) {
  const overall = getVal(viabilityScore, 'overall');
  const barColor = (val: number) =>
    val >= 70 ? 'bg-green-500' : val >= 50 ? 'bg-amber-500' : 'bg-red-500';
  const overallColor =
    overall >= 70 ? 'text-green-400' : overall >= 50 ? 'text-amber-400' : 'text-red-400';

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold">Score de viabilité</span>
          <span className={`text-2xl font-bold font-mono ${overallColor}`}>{overall}/100</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {SCORE_KEYS.map((key) => {
            const val = getVal(viabilityScore, key);
            const detail = getDetail(viabilityScore, key);
            return (
              <div key={key} className="text-center group/score relative">
                <div className="text-[10px] text-muted-foreground mb-1">{LABELS[key]}</div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barColor(val)}`}
                    style={{ width: `${val}%` }}
                  />
                </div>
                <div className="text-xs font-mono mt-0.5 cursor-help">{val}</div>
                {detail && (
                  <span className="pointer-events-none absolute left-1/2 z-100 -translate-x-1/2 whitespace-normal rounded-md border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg opacity-0 transition-opacity duration-150 group-hover/score:opacity-100 w-56 text-left font-normal bottom-[calc(100%+8px)]">
                    {detail}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
