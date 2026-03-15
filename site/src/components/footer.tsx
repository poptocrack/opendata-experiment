import { SmartText } from '@/components/smart-text';

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-5xl px-6 py-12 space-y-6">
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-amber-400">Disclaimer</span> , Cette étude est basée
            sur des données secondaires (open data data.gouv.fr, sites publics, recherche web).
            Aucune interview prospect n'a été réalisée. Les hypothèses de marché (volumes de
            recherche, CAC, TAM/SAM/SOM) sont des estimations qui nécessitent une validation terrain
            avant investissement. Les prix des concurrents et les métriques de trafic ont été
            relevés en mars 2026 et peuvent avoir évolué.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Données issues de{' '}
              <a
                href="https://www.data.gouv.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                data.gouv.fr
              </a>{' '}
              , Licence Ouverte / Open Licence
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              <SmartText>Analyse automatisée via MCP (Model Context Protocol)</SmartText>
            </p>
          </div>
          <p className="text-xs text-muted-foreground/60">
            <SmartText>Dernière mise à jour : mars 2026</SmartText>
          </p>
        </div>
      </div>
    </footer>
  );
}
