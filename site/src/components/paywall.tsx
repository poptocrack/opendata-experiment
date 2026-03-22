"use client";

import { useState } from "react";
import { SmartText } from "@/components/smart-text";

function trackClick(label: string) {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path: `/cta/${label}`,
      referrer: window.location.pathname,
    }),
  }).catch(() => {});
}

export function Paywall() {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    trackClick("paywall-checkout");
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="relative mt-8">
      {/* Gradient blur overlay */}
      <div className="absolute -top-32 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />

      {/* Locked sections teaser */}
      <div className="space-y-3 mb-8">
        {[
          "Validation terrain — 3 hypothèses à vérifier avant de coder",
          "Premiers clients — Qui contacter, où, comment",
          "MVP — Scope du premier produit",
          "Roadmap — Jalons d'exécution vers 10K MRR",
          "Monétisation — Stratégie de prix et calcul du chemin vers 10K MRR",
          "Validation marché — TAM/SAM/SOM, concurrents, juridique, CAC",
          "Stack technique — Frontend, backend, database, APIs",
          "Risques et mitigations",
          "Niveaux de confiance — Transparence sur chaque donnée",
        ].map((section) => (
          <div
            key={section}
            className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 p-3 text-sm text-muted-foreground"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="shrink-0 text-muted-foreground/50"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <SmartText>{section}</SmartText>
          </div>
        ))}
      </div>

      <section className="relative border border-amber-500/30 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/25 p-8 md:p-12 text-center">
        {/* Lock icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 mb-6">
          <svg
            className="h-8 w-8 text-amber-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h3 className="text-2xl font-bold">
          <SmartText>Débloquez toutes les fiches produit</SmartText>
        </h3>

        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
          <SmartText>
            Accédez à l&apos;analyse complète : validation terrain, roadmap MVP,
            stratégie de monétisation, analyse concurrentielle, stack technique
            et chemin vers 10K€ MRR.
          </SmartText>
        </p>

        {/* Pricing */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="text-4xl font-bold text-foreground">79€<span className="text-base font-medium text-muted-foreground ml-1">HT</span></span>
          <span className="text-lg text-muted-foreground line-through">
            120€
          </span>
          <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
            Offre de lancement
          </span>
        </div>

        {/* Bullet points */}
        <ul className="mt-6 space-y-2 text-sm text-muted-foreground max-w-xs mx-auto">
          <li className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-green-500 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <SmartText>90+ fiches produit détaillées</SmartText>
          </li>
          <li className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-green-500 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <SmartText>Classement par score de viabilité</SmartText>
          </li>
          <li className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-green-500 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <SmartText>Accès à vie, pas d&apos;abonnement</SmartText>
          </li>
        </ul>

        {/* CTA Button */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="mt-8 inline-flex items-center justify-center rounded-md bg-amber-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-amber-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <SmartText>Redirection...</SmartText>
            </>
          ) : (
            "Obtenir l'accès"
          )}
        </button>

        <p className="mt-4 text-xs text-muted-foreground">
          <SmartText>
            Paiement sécurisé via Stripe. Satisfait ou remboursé sous 14 jours.
          </SmartText>
        </p>
        <p className="mt-3">
          <a href="/acces" className="text-xs text-muted-foreground underline hover:text-foreground transition-colors">
            J&apos;ai déjà un accès
          </a>
        </p>
      </section>
    </div>
  );
}
