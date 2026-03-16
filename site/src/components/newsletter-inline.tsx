"use client";

import { useState } from "react";

export function NewsletterInline() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "newsletter-inline" }),
      });
    } catch {
      // silent
    }
    setSubmitted(true);
    localStorage.setItem("newsletter_subscribed", "1");
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-6 text-center">
        <p className="text-sm font-medium text-green-400">Inscrit ! On vous tient au courant des prochaines analyses.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium">Nouveaux secteurs chaque semaine</p>
          <p className="text-xs text-muted-foreground mt-1">
            Recevez les nouvelles analyses et opportunités par email. Pas de spam.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 shrink-0">
          <input
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-48 rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
}
