import Link from 'next/link';

type Props = {
  opportunitySlug: string;
  opportunityTitle: string;
};

export function ProductBreadcrumb({ opportunitySlug, opportunityTitle }: Props) {
  return (
    <div className="border-b border-border">
      <div className="mx-auto max-w-4xl px-6 py-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Accueil
        </Link>
        <span>/</span>
        <Link
          href={`/opportunites/${opportunitySlug}`}
          className="hover:text-foreground transition-colors"
        >
          {opportunityTitle}
        </Link>
        <span>/</span>
        <span className="text-foreground">Produit</span>
      </div>
    </div>
  );
}
