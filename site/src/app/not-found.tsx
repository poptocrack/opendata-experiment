import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <span className="text-6xl font-bold font-mono text-primary/30">404</span>
      <h1 className="mt-4 text-xl font-bold">Page introuvable</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Cette page n'existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
