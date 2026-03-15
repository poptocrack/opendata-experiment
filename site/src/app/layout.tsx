import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeToggle } from '@/components/theme-toggle';
import { Analytics } from '@/components/analytics';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Le Filon — Opportunités cachées dans les données publiques françaises',
    template: '%s | Le Filon',
  },
  description:
    'Étude de marché sur les opportunités de produits SaaS exploitant les données ouvertes de data.gouv.fr. 16 secteurs, 85 idées de produit avec validation marché.',
  metadataBase: new URL('https://lefilon.net'),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Le Filon',
    title: 'Le Filon — Opportunités cachées dans les données publiques françaises',
    description:
      '16 secteurs analysés, 85 idées de produit avec roadmap, validation marché et score de viabilité. Basé sur les données ouvertes data.gouv.fr.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Le Filon — Opportunités open data françaises',
    description:
      '85 idées de produits SaaS basées sur les données publiques françaises. Étude de marché complète.',
  },
  keywords: [
    'open data',
    'data.gouv.fr',
    'opportunités',
    'SaaS',
    'idées business',
    'données publiques',
    'étude de marché',
    'France',
    'entrepreneur',
    'indie hacker',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem("theme");document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeToggle />
        <Analytics />
        {children}
      </body>
    </html>
  );
}
