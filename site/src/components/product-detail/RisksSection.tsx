import { SmartText } from '@/components/smart-text';
import { Section } from './Section';
import type { Risk } from './types';

type Props = {
  risks: Risk[];
};

export function RisksSection({ risks }: Props) {
  return (
    <Section label="Risques" title="Risques et mitigations">
      <div className="space-y-2">
        {risks.map((r, i) => (
          <div
            key={i}
            className="flex gap-4 rounded-lg border border-border/50 p-3 text-sm"
          >
            <div className="flex-1">
              <span className="font-medium">
                <SmartText>{r.risk}</SmartText>
              </span>
            </div>
            <div className="flex-1 text-muted-foreground">
              <SmartText>{r.mitigation}</SmartText>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
