import { Badge } from '@/components/ui/badge';
import { SmartText } from '@/components/smart-text';

export function Hero({ count }: { count: number }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <Badge variant="outline" className="mb-6">
          Recherche en cours , mis à jour régulièrement
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
            {count} opportunité{count > 1 ? 's' : ''} identifiée{count > 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            20+ datasets et 10+ APIs analysés
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Phase : exploration
          </span>
        </div>
      </div>
    </section>
  );
}
