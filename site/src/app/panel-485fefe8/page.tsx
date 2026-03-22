"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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

type PurchaseItem = {
  id: number;
  email: string;
  stripeSessionId: string;
  createdAt: string;
};

type CtaData = Record<string, { total: number; sources: { page: string; clicks: number }[] }>;

type AnalyticsData = {
  totalViews: number;
  todayViews: number;
  weekViews: number;
  monthViews: number;
  topPages: { path: string; views: number }[];
  topReferrers: { referrer: string; views: number }[];
  deviceBreakdown: { device: string; views: number }[];
  dailyViews: { day: string; views: number }[];
  ctaClicks: CtaData;
};

export default function AdminPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const validTabs = ["analytics", "waitlist", "products", "purchases"] as const;
  type Tab = typeof validTabs[number];
  const initialTab = validTabs.includes(searchParams.get("tab") as Tab) ? (searchParams.get("tab") as Tab) : "analytics";

  const [secret, setSecret] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [tab, setTab] = useState<Tab>(initialTab);

  function changeTab(t: Tab) {
    setTab(t);
    router.replace(`?tab=${t}`, { scroll: false });
  }
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
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
        const [wRes, pRes, aRes, purchRes] = await Promise.all([
          fetch("/api/admin/waitlist", { headers: h }),
          fetch("/api/admin/products", { headers: h }),
          fetch("/api/admin/analytics", { headers: h }),
          fetch("/api/admin/purchases", { headers: h }),
        ]);
        if (!wRes.ok || !pRes.ok) {
          setError("Accès refusé");
          setAuthenticated(false);
          return;
        }
        const wData = await wRes.json();
        const pData = await pRes.json();
        const aData = aRes.ok ? await aRes.json() : null;
        const purchData = purchRes.ok ? await purchRes.json() : { purchases: [] };
        setEntries(wData.entries);
        setTotal(wData.total);
        setProducts(pData.products);
        setPurchases(purchData.purchases);
        setAnalytics(aData);
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
            onClick={() => changeTab("analytics")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${tab === "analytics" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Analytics {analytics ? `(${analytics.totalViews})` : ""}
          </button>
          <button
            onClick={() => changeTab("waitlist")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${tab === "waitlist" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Waitlist ({total})
          </button>
          <button
            onClick={() => changeTab("products")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${tab === "products" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Produits ({unlockedCount}/{products.length} déverrouillés)
          </button>
          <button
            onClick={() => changeTab("purchases")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${tab === "purchases" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Achats ({purchases.length})
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8 space-y-8">
        {tab === "analytics" && analytics && (
          <>
            {/* KPIs */}
            <div className="grid gap-4 sm:grid-cols-4">
              {[
                { label: "Aujourd'hui", value: analytics.todayViews },
                { label: "7 derniers jours", value: analytics.weekViews },
                { label: "30 derniers jours", value: analytics.monthViews },
                { label: "Total", value: analytics.totalViews },
              ].map((kpi) => (
                <Card key={kpi.label}>
                  <CardContent className="py-4 text-center">
                    <div className="text-3xl font-bold font-mono text-primary">{kpi.value}</div>
                    <div className="text-sm text-muted-foreground">{kpi.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Daily chart (text-based) */}
            {analytics.dailyViews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Vues par jour (30 derniers jours)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {analytics.dailyViews.map((d) => {
                      const max = Math.max(...analytics.dailyViews.map((x) => x.views), 1);
                      const width = Math.max((d.views / max) * 100, 2);
                      return (
                        <div key={d.day} className="flex items-center gap-3 text-xs">
                          <span className="w-20 text-muted-foreground shrink-0">{d.day.slice(5)}</span>
                          <div className="flex-1 h-4 bg-muted rounded overflow-hidden">
                            <div className="h-full bg-primary/60 rounded" style={{ width: `${width}%` }} />
                          </div>
                          <span className="w-8 text-right font-mono">{d.views}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Top pages */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Top pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analytics.topPages.map((p) => (
                      <div key={p.path} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground truncate max-w-[70%]">{p.path}</span>
                        <span className="font-mono">{p.views}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Referrers + Devices */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Referrers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analytics.topReferrers.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Aucun referrer</p>
                    ) : (
                      <div className="space-y-2">
                        {analytics.topReferrers.map((r) => (
                          <div key={r.referrer} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground truncate max-w-[70%]">{r.referrer}</span>
                            <span className="font-mono">{r.views}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Devices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      {analytics.deviceBreakdown.map((d) => (
                        <div key={d.device} className="text-center">
                          <div className="text-lg font-bold font-mono text-primary">{d.views}</div>
                          <div className="text-xs text-muted-foreground capitalize">{d.device}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* CTA Clicks */}
            {analytics.ctaClicks && Object.keys(analytics.ctaClicks).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Clics CTA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analytics.ctaClicks)
                      .sort((a, b) => b[1].total - a[1].total)
                      .map(([cta, data]) => (
                        <div key={cta}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{cta.replace("/cta/", "")}</span>
                            <Badge variant="outline">{data.total} clic{data.total > 1 ? "s" : ""}</Badge>
                          </div>
                          {data.sources.length > 0 && (
                            <div className="ml-4 space-y-1">
                              {data.sources
                                .sort((a, b) => b.clicks - a.clicks)
                                .map((s) => (
                                  <div key={s.page} className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span className="truncate max-w-[80%]">{s.page}</span>
                                    <span className="font-mono">{s.clicks}</span>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

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

        {tab === "purchases" && (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="py-4 text-center">
                  <div className="text-3xl font-bold font-mono text-primary">{purchases.length}</div>
                  <div className="text-sm text-muted-foreground">achats total</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4 text-center">
                  <div className="text-3xl font-bold font-mono text-primary">
                    {purchases.length * 79}€
                  </div>
                  <div className="text-sm text-muted-foreground">revenu total</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4 text-center">
                  <div className="text-3xl font-bold font-mono text-primary">
                    {purchases.filter((p) => Date.now() - new Date(p.createdAt).getTime() < 7 * 86400000).length}
                  </div>
                  <div className="text-sm text-muted-foreground">cette semaine</div>
                </CardContent>
              </Card>
            </div>

            {purchases.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">Aucun achat pour l&apos;instant.</p>
            ) : (
              <div className="space-y-1">
                {purchases.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded border border-border/50 px-3 py-2 text-sm">
                    <span className="font-mono">{p.email}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
