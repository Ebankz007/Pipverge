import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-code",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pipverge — Intelligent trading. Smarter decisions. Better execution.",
    template: "%s · Pipverge",
  },
  description:
    "Pipverge is a trading-intelligence platform: structured market signals, automated strategies, and performance analytics for forex, gold, and index traders.",
  applicationName: "Pipverge",
  keywords: [
    "trading intelligence",
    "forex signals",
    "gold signals",
    "expert advisor",
    "market analysis",
    "risk management",
    "trading tools",
  ],
  authors: [{ name: "Pipverge" }],
  openGraph: {
    type: "website",
    siteName: "Pipverge",
    title: "Pipverge — Intelligent trading. Smarter decisions. Better execution.",
    description:
      "Structured market signals, automated strategies, and performance analytics for forex, gold, and index traders.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Pipverge — Intelligent trading. Smarter decisions. Better execution.",
    description:
      "Structured market signals, automated strategies, and performance analytics for forex, gold, and index traders.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        {/* Reveal animations start hidden; without JS they must never stay hidden. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#14161c",
              border: "1px solid #262a33",
              color: "#f4f4f5",
            },
          }}
        />
      </body>
    </html>
  );
}
