import { Badge } from '@/components/ui/badge';
import { SmartText } from '@/components/smart-text';

export function Hero({ count }: { count: number }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <Badge variant="outline" className="mb-6">
          Recherche en cours — mis à jour régulièrement
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Opportunités cachées dans
          <br />
          <span className="text-primary/80">les données publiques françaises</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          <SmartText>
            Nous analysons les datasets de data.gouv.fr pour identifier des opportunités de création
            de produits répondant à des besoins réels, avec des personnes prêtes à payer.
          </SmartText>
        </p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {count} secteurs analysés
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            90 fiches produit détaillées
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Scores de viabilité et classement
          </span>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#secteurs"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Voir les opportunités
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </a>
          <a
            href="/classement"
            className="inline-flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-5 py-2.5 text-sm font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Classement par viabilité
          </a>
        </div>
      </div>
    </section>
  );
}
