import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { twMerge } from "tailwind-merge";
import { ThemeProvider } from "@/components/ThemeProvider";
import { profile } from "@/data/resume";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const fullTitle = `${profile.name} - ${profile.title} | MLOps · GenAI · RAG`;
const description =
  "Portfolio of Sathish Kumar, a Machine Learning Engineer building production AI systems - LLM/RAG applications, Neo4j knowledge graphs, and the MLOps that keeps them running.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.url),
  title: {
    default: fullTitle,
    template: `%s | ${profile.name}`,
  },
  description,
  keywords: [
    "Machine Learning Engineer",
    "MLOps",
    "GenAI",
    "RAG",
    "LLM",
    "Neo4j",
    "Knowledge Graph",
    "PyTorch",
    "Sathish Kumar",
  ],
  authors: [{ name: profile.name, url: profile.url }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: profile.url,
    title: fullTitle,
    description,
    siteName: `${profile.name} - Portfolio`,
  },
  twitter: {
    card: "summary_large_image",
    title: fullTitle,
    description,
  },
  robots: { index: true, follow: true },
};

// Accessibility: explicitly allow pinch / browser zoom (don't lock scale).
// initialScale 1, zoom up to 5×, user-scalable on - WCAG 1.4.4 friendly.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0D1117" },
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
  ],
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: profile.url,
  jobTitle: profile.title,
  email: `mailto:${profile.email}`,
  sameAs: [profile.github, profile.linkedin],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* No-JS fallback: framer-motion ships `opacity:0` on reveal elements
            for its scroll animation. If JS is off/blocked, force them visible
            so the whole page stays readable (not just the header). */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>
      </head>
      <body className={twMerge(inter.variable, jetbrainsMono.variable)}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:font-medium focus:text-canvas"
        >
          Skip to content
        </a>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
