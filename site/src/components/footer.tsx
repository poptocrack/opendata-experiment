import { SmartText } from '@/components/smart-text';

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-5xl px-6 py-12 space-y-6">
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-amber-400">Disclaimer</span> — Cette étude est basée
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
              <a
                href="/classement"
                className="underline hover:text-foreground"
              >
                Classement des produits
              </a>{' '}
              ·{' '}
              Données issues de{' '}
              <a
                href="https://www.data.gouv.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                data.gouv.fr
              </a>{' '}
              — Licence Ouverte / Open Licence
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              <SmartText>Analyse automatisée via MCP (Model Context Protocol)</SmartText>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/in/tristan-debroise/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a
              href="mailto:tristandebroise@gmail.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </a>
            <span className="text-xs text-muted-foreground/60">
              <SmartText>Dernière mise à jour : mars 2026</SmartText>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
