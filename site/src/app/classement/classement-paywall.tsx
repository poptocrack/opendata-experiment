"use client";

import { useState } from "react";
import { SmartText } from "@/components/smart-text";

function trackClick(label: string) {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: `/cta/${label}`, referrer: window.location.pathname }),
  }).catch(() => {});
}

export function ClassementPaywall() {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    trackClick("classement-checkout");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      setLoading(false);
    }
  }

  return (
    <section className="border border-amber-500/30 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/25 p-8 md:p-10 text-center">
      <h3 className="text-xl font-bold">
        <SmartText>Débloquez les noms et accédez aux fiches complètes</SmartText>
      </h3>
      <div className="mt-4 flex items-center justify-center gap-3">
        <span className="text-3xl font-bold">79€</span>
        <span className="text-lg text-muted-foreground line-through">120€</span>
        <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
          Offre de lancement
        </span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        <SmartText>Accès à vie. 90+ fiches produit détaillées avec roadmap, validation marché et chemin vers 10K€ MRR.</SmartText>
      </p>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="mt-6 inline-flex items-center justify-center rounded-md bg-amber-600 px-8 py-3 text-sm font-semibold text-white hover:bg-amber-700 transition-colors disabled:opacity-60"
      >
        {loading ? "Redirection..." : "Obtenir l'accès"}
      </button>
    </section>
  );
}
