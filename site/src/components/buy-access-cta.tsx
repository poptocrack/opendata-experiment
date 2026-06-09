"use client";

import { useState } from "react";
import { SmartText } from "@/components/smart-text";
import { FREE_SAMPLE_SLUG } from "@/lib/sample";

function trackClick(label: string) {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: `/cta/${label}`, referrer: window.location.pathname }),
  }).catch(() => {});
}

/**
 * CTA d'achat réutilisable (offre 79€ accès à vie).
 * `source` sert d'étiquette de tracking pour mesurer quelle page convertit.
 * `showSampleLink` affiche un lien vers la fiche exemple gratuite (dé-risque l'achat).
 */
export function BuyAccessCTA({
  source,
  headline = "Débloquez les 90 fiches produit",
  subtext = "Validation terrain, roadmap MVP, analyse concurrentielle et chemin vers 10K€ MRR pour chaque idée.",
  showSampleLink = true,
}: {
  source: string;
  headline?: string;
  subtext?: string;
  showSampleLink?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    trackClick(source);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const { url } = await res.json();
      if (url) window.location.href = url;
      else setLoading(false);
    } catch {
      setLoading(false);
    }
  }

  return (
    <section className="border border-amber-500/30 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/25 p-8 md:p-10 text-center">
      <h3 className="text-xl font-bold">
        <SmartText>{headline}</SmartText>
      </h3>
      <div className="mt-4 flex items-center justify-center gap-3">
        <span className="text-3xl font-bold">
          79€<span className="text-sm font-medium text-muted-foreground ml-1">HT</span>
        </span>
        <span className="text-lg text-muted-foreground line-through">120€</span>
        <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
          Offre de lancement
        </span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto">
        <SmartText>{subtext}</SmartText>
      </p>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="mt-6 inline-flex items-center justify-center rounded-md bg-amber-600 px-8 py-3 text-sm font-semibold text-white hover:bg-amber-700 transition-colors disabled:opacity-60"
      >
        {loading ? "Redirection..." : "Obtenir l'accès à vie"}
      </button>
      <p className="mt-3 text-xs text-muted-foreground">
        <SmartText>Paiement sécurisé Stripe — satisfait ou remboursé sous 14 jours.</SmartText>
      </p>
      {showSampleLink && (
        <p className="mt-3">
          <a
            href={`/produits/${FREE_SAMPLE_SLUG}`}
            className="text-xs text-amber-700 dark:text-amber-400 underline hover:text-amber-900 dark:hover:text-amber-300 transition-colors"
          >
            👁 Voir une fiche complète en exemple (gratuit)
          </a>
        </p>
      )}
    </section>
  );
}
