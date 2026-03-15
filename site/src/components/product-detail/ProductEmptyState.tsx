import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { SmartText } from '@/components/smart-text';

type Props = {
  opportunitySlug: string;
  opportunityTitle: string;
};

export function ProductEmptyState({ opportunitySlug, opportunityTitle }: Props) {
  return (
    <Card className="border-dashed">
      <CardContent className="py-12 text-center text-muted-foreground">
        <p className="text-lg font-medium">
          <SmartText>Fiche produit en cours de rédaction</SmartText>
        </p>
        <p className="mt-2 text-sm">
          Cette idée est identifiée dans le secteur{' '}
          <Link
            href={`/opportunites/${opportunitySlug}`}
            className="underline hover:text-foreground"
          >
            {opportunityTitle}
          </Link>
          . Le détail arrive bientôt.
        </p>
      </CardContent>
    </Card>
  );
}
