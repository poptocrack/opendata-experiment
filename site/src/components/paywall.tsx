"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SmartText } from "@/components/smart-text";

type FreePreview = {
  oneLiner: string;
  problem: string;
  solution: string;
  uniqueValue: string;
  timeToMvp: string;
  viabilityScore: string | null;
};

export function Paywall({ freePreview }: { freePreview: FreePreview }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const viabilityScore = freePreview.viabilityScore
    ? JSON.parse(freePreview.viabilityScore)
    : null;

  const getVal = (key: string) => {
    if (!viabilityScore) return 0;
    const v = viabilityScore[key];
    return typeof v === "object" && v !== null
      ? (v as Record<string, unknown>).score as number
      : (v as number) ?? 0;
  };

  const overall = getVal("overall");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: window.location.pathname }),
      });
      if (res.ok) setSubmitted(true);
    } catch {
      // Fallback silencieux
      setSubmitted(true);
    }
  }

  return (
    <div className="space-y-10">
      {/* Score de viabilité (visible) */}
      {viabilityScore && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Score de viabilité</span>
              <span
                className={`text-2xl font-bold font-mono ${overall >= 70 ? "text-green-400" : overall >= 50 ? "text-amber-400" : "text-red-400"}`}
              >
                {overall}/100
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {(["demand", "feasibility", "market", "competition", "legal"] as const).map(
                (key) => {
                  const val = getVal(key);
                  const color =
                    val >= 70 ? "bg-green-500" : val >= 50 ? "bg-amber-500" : "bg-red-500";
                  const labels: Record<string, string> = {
                    demand: "Demande",
                    feasibility: "Faisabilité",
                    market: "Marché",
                    competition: "Concurrence",
                    legal: "Juridique",
                  };
                  return (
                    <div key={key} className="text-center">
                      <div className="text-[10px] text-muted-foreground mb-1">{labels[key]}</div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full ${color}`} style={{ width: `${val}%` }} />
                      </div>
                      <div className="text-xs font-mono mt-0.5">{val}</div>
                    </div>
                  );
                }
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Problem / Solution / Unique Value (visible) */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">
              Problème
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed">
            <SmartText>{freePreview.problem}</SmartText>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">
              Solution
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed">
            <SmartText>{freePreview.solution}</SmartText>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">
              Avantage unique
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed">
            <SmartText>{freePreview.uniqueValue}</SmartText>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Locked sections teaser */}
      <div className="space-y-3">
        {[
          "Validation terrain — 3 hypothèses à vérifier avant de coder",
          "Premiers clients — Qui contacter, où, comment",
          "MVP — Scope du premier produit",
          "Roadmap — Jalons d'exécution vers 10K MRR",
          "Monétisation — Stratégie de prix et calcul du chemin vers 10K MRR",
          "Validation marché — Volumes de recherche, TAM/SAM/SOM, concurrents, juridique, CAC",
          "Stack technique — Frontend, backend, database, APIs",
          "Risques et mitigations",
          "Niveaux de confiance — Transparence sur chaque donnée",
        ].map((section) => (
          <div
            key={section}
            className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 p-3 text-sm text-muted-foreground"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-muted-foreground/50">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            {section}
          </div>
        ))}
      </div>

      {/* CTA */}
      <Card className="border-primary/20 bg-card shadow-xl">
        <CardContent className="py-8 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Contenu premium
          </Badge>

          {submitted ? (
            <>
              <h3 className="text-xl font-bold">Merci !</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Tu seras notifié(e) dès que l'accès sera disponible.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold">Accède à la fiche complète</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                Roadmap d'exécution, validation terrain, chemin vers 10K MRR,
                analyse concurrentielle détaillée, stack technique et scoring de viabilité.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 flex gap-2 max-w-sm mx-auto">
                <input
                  type="email"
                  placeholder="ton@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Rejoindre la waitlist
                </button>
              </form>
              <p className="mt-3 text-xs text-muted-foreground">
                Pas de spam. Notification unique à l'ouverture.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
