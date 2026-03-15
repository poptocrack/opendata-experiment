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

type ProductItem = {
  id: number;
  slug: string;
  text: string;
  unlocked: boolean;
  opportunity: { title: string; sector: string };
};

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [tab, setTab] = useState<"waitlist" | "products">("waitlist");
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const headers = useCallback(
    () => ({ Authorization: `Bearer ${secret}`, "Content-Type": "application/json" }),
    [secret]
  );

  const fetchAll = useCallback(
    async (token: string) => {
      setLoading(true);
      setError("");
      try {
        const h = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
        const [wRes, pRes] = await Promise.all([
          fetch("/api/admin/waitlist", { headers: h }),
          fetch("/api/admin/products", { headers: h }),
        ]);
        if (!wRes.ok || !pRes.ok) {
          setError("Accès refusé");
          setAuthenticated(false);
          return;
        }
        const wData = await wRes.json();
        const pData = await pRes.json();
        setEntries(wData.entries);
        setTotal(wData.total);
        setProducts(pData.products);
        setAuthenticated(true);
        localStorage.setItem("admin_secret", token);
      } catch {
        setError("Erreur de connexion");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const saved = localStorage.getItem("admin_secret");
    if (saved) {
      setSecret(saved);
      fetchAll(saved);
    }
  }, [fetchAll]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    fetchAll(secret);
  }

  function handleLogout() {
    localStorage.removeItem("admin_secret");
    setAuthenticated(false);
    setSecret("");
    setEntries([]);
    setProducts([]);
  }

  async function toggleUnlock(id: number, currentState: boolean) {
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ id, unlocked: !currentState }),
    });
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, unlocked: !currentState } : p))
    );
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
              {error && <p className="text-sm text-red-400 text-center">{error}</p>}
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Group waitlist by source
  const bySource = entries.reduce(
    (acc, e) => {
      const key = e.source ?? "direct";
      if (!acc[key]) acc[key] = [];
      acc[key].push(e);
      return acc;
    },
    {} as Record<string, WaitlistEntry[]>
  );

  // Group products by sector
  const bySector = products.reduce(
    (acc, p) => {
      const key = p.opportunity.sector;
      if (!acc[key]) acc[key] = [];
      acc[key].push(p);
      return acc;
    },
    {} as Record<string, ProductItem[]>
  );

  const unlockedCount = products.filter((p) => p.unlocked).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold">Admin</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Déconnexion
          </button>
        </div>
        <div className="mx-auto max-w-4xl px-6 flex gap-4">
          <button
            onClick={() => setTab("waitlist")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${tab === "waitlist" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Waitlist ({total})
          </button>
          <button
            onClick={() => setTab("products")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${tab === "products" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Produits ({unlockedCount}/{products.length} déverrouillés)
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8 space-y-8">
        {tab === "waitlist" && (
          <>
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
                    {entries.filter((e) => Date.now() - new Date(e.createdAt).getTime() < 86400000).length}
                  </div>
                  <div className="text-sm text-muted-foreground">dernières 24h</div>
                </CardContent>
              </Card>
            </div>

            {Object.entries(bySource)
              .sort((a, b) => b[1].length - a[1].length)
              .map(([source, items]) => (
                <div key={source}>
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-sm font-semibold">{source}</h2>
                    <Badge variant="outline" className="text-xs">{items.length}</Badge>
                  </div>
                  <div className="space-y-1">
                    {items.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between rounded border border-border/50 px-3 py-2 text-sm">
                        <span className="font-mono">{entry.email}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            {total === 0 && (
              <p className="text-center text-muted-foreground py-12">Aucun inscrit pour l'instant.</p>
            )}
          </>
        )}

        {tab === "products" && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {unlockedCount} produit{unlockedCount > 1 ? "s" : ""} déverrouillé{unlockedCount > 1 ? "s" : ""} sur {products.length}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => products.forEach((p) => !p.unlocked && toggleUnlock(p.id, false))}
                  className="text-xs px-3 py-1 rounded border border-border hover:bg-muted transition-colors"
                >
                  Tout déverrouiller
                </button>
                <button
                  onClick={() => products.forEach((p) => p.unlocked && toggleUnlock(p.id, true))}
                  className="text-xs px-3 py-1 rounded border border-border hover:bg-muted transition-colors"
                >
                  Tout verrouiller
                </button>
              </div>
            </div>

            {Object.entries(bySector)
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([sector, items]) => (
                <div key={sector}>
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-sm font-semibold capitalize">{sector}</h2>
                    <Badge variant="outline" className="text-xs">
                      {items.filter((p) => p.unlocked).length}/{items.length}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {items.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between rounded border border-border/50 px-3 py-2 text-sm"
                      >
                        <span className={product.unlocked ? "" : "text-muted-foreground"}>
                          {product.text.substring(0, 80)}{product.text.length > 80 ? "..." : ""}
                        </span>
                        <button
                          onClick={() => toggleUnlock(product.id, product.unlocked)}
                          className={`shrink-0 ml-3 px-3 py-1 rounded text-xs font-medium transition-colors ${
                            product.unlocked
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {product.unlocked ? "Déverrouillé" : "Verrouillé"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
}
