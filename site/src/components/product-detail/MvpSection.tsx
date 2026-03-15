import { Card, CardContent } from '@/components/ui/card';
import { SmartText } from '@/components/smart-text';
import { Section } from './Section';

type Props = {
  mvpScope: string;
};

export function MvpSection({ mvpScope }: Props) {
  return (
    <Section label="MVP" title={<SmartText>MVP , Scope du premier produit</SmartText>}>
      <Card className="bg-muted/30">
        <CardContent className="py-4 text-sm leading-relaxed whitespace-pre-line">
          <SmartText>{mvpScope}</SmartText>
        </CardContent>
      </Card>
    </Section>
  );
}
