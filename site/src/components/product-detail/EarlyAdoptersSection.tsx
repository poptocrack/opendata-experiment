import { Card, CardContent } from '@/components/ui/card';
import { SmartText } from '@/components/smart-text';
import { Section } from './Section';
import type { EarlyAdopter } from './types';

type Props = {
  earlyAdopters: EarlyAdopter[];
};

export function EarlyAdoptersSection({ earlyAdopters }: Props) {
  return (
    <Section label="Qui contacter" title="Premiers clients">
      <div className="grid gap-3 sm:grid-cols-2">
        {earlyAdopters.map((ea, i) => (
          <Card key={i}>
            <CardContent className="py-4">
              <div className="font-medium text-sm">
                <SmartText>{ea.who}</SmartText>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Où : </span>
                <SmartText>{ea.where}</SmartText>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Approche : </span>
                <SmartText>{ea.howToReach}</SmartText>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
