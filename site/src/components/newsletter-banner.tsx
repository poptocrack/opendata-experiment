"use client";

import { useState, useEffect } from "react";

export function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [dismissed, setDismissed] = useState(true); // hidden by default until check

  useEffect(() => {
    // Don't show if already subscribed or dismissed recently
    const sub = localStorage.getItem("newsletter_subscribed");
    const dis = localStorage.getItem("newsletter_dismissed");
    if (sub) return;
    if (dis) {
      const dismissedAt = parseInt(dis, 10);
      // Show again after 7 days
      if (Date.now() - dismissedAt < 7 * 86400000) return;
    }
    // Show after 30s on the page
    const timer = setTimeout(() => setDismissed(false), 30000);
    return () => clearTimeout(timer);
  }, []);

  if (dismissed && !submitted) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "newsletter-banner" }),
      });
    } catch {
      // silent
    }
    setSubmitted(true);
    localStorage.setItem("newsletter_subscribed", "1");
  }

  function handleDismiss() {
    setDismissed(true);
    localStorage.setItem("newsletter_dismissed", Date.now().toString());
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="mx-auto max-w-lg pointer-events-auto">
        <div className="rounded-lg border border-border bg-card shadow-lg p-4 relative">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground text-lg leading-none"
            aria-label="Fermer"
          >
            ×
          </button>

          {submitted ? (
            <p className="text-sm text-center py-2">
              Merci ! On vous tient au courant.
            </p>
          ) : (
            <>
              <p className="text-sm font-medium pr-6">
                Nouveaux secteurs et opportunités chaque semaine
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Recevez les nouvelles analyses directement par email. Pas de spam.
              </p>
              <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
                <input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
                >
                  S'inscrire
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
