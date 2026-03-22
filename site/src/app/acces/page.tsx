"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SmartText } from "@/components/smart-text";

type Status = "idle" | "loading" | "success" | "error" | "email-sent";

export default function AccesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    }>
      <AccesContent />
    </Suspense>
  );
}

function AccesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");

  // Activation: from Stripe redirect (?token=SESSION_ID) or magic link (?magic=TOKEN)
  useEffect(() => {
    const sessionId = searchParams.get("token");
    const magicToken = searchParams.get("magic");

    if (magicToken) {
      // Magic link: set cookie directly
      const maxAge = 10 * 365 * 24 * 60 * 60;
      document.cookie = `lefilon_access=${magicToken}; path=/; max-age=${maxAge}; samesite=lax`;
      setStatus("success");
      setTimeout(() => router.push("/classement"), 2000);
      return;
    }

    if (sessionId) {
      activateFromStripe(sessionId);
    }
    // If neither, show the recovery form (status stays "idle")
  }, [searchParams, router]);

  async function activateFromStripe(sessionId: string) {
    setStatus("loading");
    try {
      const res = await fetch("/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur inconnue");
      }
      const { token } = await res.json();
      const maxAge = 10 * 365 * 24 * 60 * 60;
      document.cookie = `lefilon_access=${token}; path=/; max-age=${maxAge}; samesite=lax`;
      setStatus("success");
      setTimeout(() => router.push("/classement"), 2000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erreur lors de l'activation");
    }
  }

  async function handleRecover(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      await fetch("/api/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      setStatus("email-sent");
    } catch {
      setStatus("error");
      setErrorMsg("Erreur lors de l'envoi. Réessayez.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">

        {status === "idle" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
              <svg className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">
              <SmartText>Retrouver mon accès</SmartText>
            </h1>
            <p className="text-muted-foreground">
              <SmartText>
                Entrez l&apos;email utilisé lors de votre achat. Vous recevrez un lien pour retrouver votre accès.
              </SmartText>
            </p>
            <form onSubmit={handleRecover} className="space-y-3">
              <input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-amber-500 transition-colors"
              />
              <button
                type="submit"
                className="w-full rounded-md bg-amber-600 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-700 transition-colors"
              >
                Envoyer le lien d&apos;accès
              </button>
            </form>
          </>
        )}

        {status === "loading" && (
          <>
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
            <h1 className="text-2xl font-bold">
              <SmartText>Activation en cours...</SmartText>
            </h1>
            <p className="text-muted-foreground">
              <SmartText>Vérification de votre paiement.</SmartText>
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">
              <SmartText>Accès activé !</SmartText>
            </h1>
            <p className="text-muted-foreground">
              <SmartText>Redirection vers le classement...</SmartText>
            </p>
          </>
        )}

        {status === "email-sent" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
              <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">
              <SmartText>Email envoyé !</SmartText>
            </h1>
            <p className="text-muted-foreground">
              <SmartText>
                Si un achat est associé à cette adresse, vous recevrez un lien d&apos;accès dans quelques instants. Vérifiez vos spams.
              </SmartText>
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
              <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">
              <SmartText>Erreur</SmartText>
            </h1>
            <p className="text-muted-foreground">
              <SmartText>{errorMsg}</SmartText>
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="inline-block rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Réessayer
            </button>
          </>
        )}
      </div>
    </div>
  );
}
