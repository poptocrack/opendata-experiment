import { Badge } from '@/components/ui/badge';
import { SmartText } from '@/components/smart-text';
import { Section } from './Section';
import type { Milestone } from './types';

type Props = {
  milestones: Milestone[];
};

export function RoadmapSection({ milestones }: Props) {
  return (
    <Section label="Roadmap" title="Jalons d'exécution">
      <div className="relative space-y-0">
        {milestones.map((m, i) => (
          <div key={i} className="relative pl-8 pb-8 last:pb-0">
            {i < milestones.length - 1 && (
              <div className="absolute left-[11px] top-6 bottom-0 w-px bg-border" />
            )}
            <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background">
              <span className="text-xs font-mono font-bold text-primary">{i + 1}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {m.phase}
                </Badge>
                <span className="text-xs text-muted-foreground">{m.duration}</span>
              </div>
              <h3 className="mt-1 font-semibold text-sm">
                <SmartText>{m.title}</SmartText>
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                <SmartText>{m.description}</SmartText>
              </p>
              {m.deliverables.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {m.deliverables.map((d, j) => (
                    <li key={j} className="flex gap-2 text-xs text-muted-foreground">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                      <SmartText>{d}</SmartText>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
