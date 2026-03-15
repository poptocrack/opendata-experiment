import { SmartText } from '@/components/smart-text';
import { Section } from './Section';
import type { ConfidenceLevels } from './types';

type Props = {
  confidenceLevels: ConfidenceLevels;
};

function labelForKey(key: string): string {
  if (key === 'tamSamSom') return 'TAM/SAM/SOM';
  if (key === 'cac') return 'CAC';
  if (key === 'searchVolume') return 'Volume recherche';
  return key;
}

function isVerifie(level: string): boolean {
  return level === 'verifie' || level === 'vérifié' || level === 'verifié';
}

function isEstime(level: string): boolean {
  return level === 'estime' || level === 'estimé';
}

export function ConfidenceLevelsSection({ confidenceLevels }: Props) {
  return (
    <Section label="Transparence" title="Niveau de confiance des données">
      <p className="text-xs text-muted-foreground mb-4">
        Chaque section est évaluée selon sa source :{' '}
        <strong className="text-green-400">vérifié</strong> (source publique vérifiable),{' '}
        <strong className="text-amber-400">estimé</strong> (calcul sur données publiques),{' '}
        <strong className="text-red-400">opiné</strong> (benchmark ou avis expert).
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {Object.entries(confidenceLevels).map(([key, entry]) => {
          const color = isVerifie(entry.level)
            ? 'text-green-400'
            : isEstime(entry.level)
              ? 'text-amber-400'
              : 'text-red-400';
          const bgColor = isVerifie(entry.level)
            ? 'bg-green-500/10 border-green-500/20'
            : isEstime(entry.level)
              ? 'bg-amber-500/10 border-amber-500/20'
              : 'bg-red-500/10 border-red-500/20';
          return (
            <div key={key} className={`rounded-lg border p-3 ${bgColor}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium capitalize">{labelForKey(key)}</span>
                <span className={`text-xs font-bold ${color}`}>{entry.level}</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">{entry.detail}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
