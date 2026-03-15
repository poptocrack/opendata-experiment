import { Card, CardContent } from '@/components/ui/card';
import { SmartText } from '@/components/smart-text';
import { Section } from './Section';
import type { ValidationCheck } from './types';

type Props = {
  validationChecks: ValidationCheck[];
};

export function ValidationTerrainSection({ validationChecks }: Props) {
  return (
    <Section label="Avant de coder" title="Validation terrain">
      <div className="space-y-3">
        {validationChecks.map((v, i) => (
          <Card key={i} className="bg-muted/30">
            <CardContent className="py-4">
              <div className="font-medium text-sm">
                <SmartText>{v.check}</SmartText>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Comment : </span>
                <SmartText>{v.how}</SmartText>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                <span className="font-medium text-green-400">Critère de succès : </span>
                <SmartText>{v.successCriteria}</SmartText>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
