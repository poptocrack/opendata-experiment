import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SmartText } from '@/components/smart-text';
import { Section } from './Section';

type Props = {
  pricingStrategy: string;
  pathTo10kMrr: string;
};

export function MonetizationSection({ pricingStrategy, pathTo10kMrr }: Props) {
  return (
    <Section label="Monétisation" title={<SmartText>Chemin vers 10K MRR</SmartText>}>
      <div className="space-y-4">
        <Card className="bg-muted/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Stratégie de prix
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed">
            <SmartText>{pricingStrategy}</SmartText>
          </CardContent>
        </Card>
        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-400">
              <SmartText>Chemin vers 10K MRR</SmartText>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed">
            <SmartText>{pathTo10kMrr}</SmartText>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
