import { SmartText } from '@/components/smart-text';
import { Section } from './Section';

type Props = {
  inspirations: string;
};

export function InspirationsSection({ inspirations }: Props) {
  return (
    <Section label="Inspirations" title="Produits similaires">
      <p className="text-sm text-muted-foreground leading-relaxed">
        <SmartText>{inspirations}</SmartText>
      </p>
    </Section>
  );
}
