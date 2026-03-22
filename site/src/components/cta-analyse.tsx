"use client";

import { SmartText } from "@/components/smart-text";

function trackClick(label: string) {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: `/cta/${label}`, referrer: window.location.pathname }),
  }).catch(() => {});
}

export function CtaAnalyse() {
  return (
    <section className="border border-border rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 p-8 md:p-10">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400">
          Analyse sur mesure
        </p>
        <h3 className="mt-3 text-2xl font-bold">
          <SmartText>Votre secteur n&apos;est pas couvert ?</SmartText>
        </h3>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          <SmartText>
            Je réalise une analyse sectorielle complète sur votre marché : datasets open data exploitables,
            concurrents, idées de produit avec roadmap MVP, validation marché et chemin vers 10K€ MRR.
            Livraison sous 48h.
          </SmartText>
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href="mailto:tristandebroise@gmail.com?subject=Analyse%20sectorielle%20sur%20mesure&body=Bonjour%2C%0A%0AJe%20suis%20int%C3%A9ress%C3%A9(e)%20par%20une%20analyse%20sectorielle%20sur%20le%20secteur%20%3A%20%5B%C3%A0%20compl%C3%A9ter%5D%0A%0AMerci%20!"
            onClick={() => trackClick("analyse-email")}
            className="inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-700 transition-colors"
          >
            Commander une analyse — 249€
          </a>
          <a
            href="https://www.linkedin.com/in/tristan-debroise/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick("analyse-linkedin")}
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
          >
            Me contacter sur LinkedIn
          </a>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          <SmartText>
            Format identique aux fiches du site. Paiement après livraison si satisfait.
          </SmartText>
        </p>
      </div>
    </section>
  );
}
