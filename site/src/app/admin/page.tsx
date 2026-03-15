"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type WaitlistEntry = {
  id: number;
  email: string;
  source: string | null;
  createdAt: string;
};

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWaitlist = useCallback(async (token: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/waitlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setError("Accès refusé");
        setAuthenticated(false);
        return;
      }
      const data = await res.json();
      setEntries(data.entries);
      setTotal(data.total);
      setAuthenticated(true);
      localStorage.setItem("admin_secret", token);
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("admin_secret");
    if (saved) {
      setSecret(saved);
      fetchWaitlist(saved);
    }
  }, [fetchWaitlist]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    fetchWaitlist(secret);
  }

  function handleLogout() {
    localStorage.removeItem("admin_secret");
    setAuthenticated(false);
    setSecret("");
    setEntries([]);
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-center">Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                placeholder="Secret admin"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                autoFocus
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? "..." : "Connexion"}
              </button>
              {error && (
                <p className="text-sm text-red-400 text-center">{error}</p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Group by source
  const bySource = entries.reduce(
    (acc, e) => {
      const key = e.source ?? "direct";
      if (!acc[key]) acc[key] = [];
      acc[key].push(e);
      return acc;
    },
    {} as Record<string, WaitlistEntry[]>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold">Admin — Waitlist</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="py-4 text-center">
              <div className="text-3xl font-bold font-mono text-primary">{total}</div>
              <div className="text-sm text-muted-foreground">inscrits total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <div className="text-3xl font-bold font-mono text-primary">
                {Object.keys(bySource).length}
              </div>
              <div className="text-sm text-muted-foreground">pages sources</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <div className="text-3xl font-bold font-mono text-primary">
                {entries.filter((e) => {
                  const d = new Date(e.createdAt);
                  const now = new Date();
                  return now.getTime() - d.getTime() < 24 * 60 * 60 * 1000;
                }).length}
              </div>
              <div className="text-sm text-muted-foreground">dernières 24h</div>
            </CardContent>
          </Card>
        </div>

        {/* By source */}
        {Object.entries(bySource)
          .sort((a, b) => b[1].length - a[1].length)
          .map(([source, items]) => (
            <div key={source}>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-sm font-semibold">{source}</h2>
                <Badge variant="outline" className="text-xs">
                  {items.length}
                </Badge>
              </div>
              <div className="space-y-1">
                {items.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between rounded border border-border/50 px-3 py-2 text-sm"
                  >
                    <span className="font-mono">{entry.email}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

        {total === 0 && (
          <p className="text-center text-muted-foreground py-12">
            Aucun inscrit pour l'instant.
          </p>
        )}
      </div>
    </div>
  );
}
