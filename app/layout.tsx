import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

// Absolute base URL for resolving Open Graph and Twitter image paths.
//
// Set NEXT_PUBLIC_SITE_URL in production. The host fallbacks below matter
// because without one of them this resolves to localhost, which silently
// breaks every link preview: the page still renders fine, so nothing
// looks wrong until someone shares the URL.
//
// Netlify sets URL to the site's primary address at build time; Vercel
// sets VERCEL_URL for previews.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Anisur Khan · Full-Stack Engineer",
  description:
    "Full-stack engineer specializing in SaaS integrations and AI tooling. 5+ years building Salesforce, QuickBooks, HubSpot, USAePay, and Quire integrations on React + Java services.",
  keywords: [
    "Anisur Khan",
    "Full Stack Engineer",
    "SaaS Integrations",
    "Salesforce",
    "QuickBooks",
    "Claude API",
    "React",
    "Java",
    "Sacramento",
  ],
  authors: [{ name: "Anisur Khan" }],
  creator: "Anisur Khan",
  openGraph: {
    title: "Anisur Khan · Full-Stack Engineer",
    description:
      "Full-stack engineer specializing in SaaS integrations and AI tooling.",
    url: siteUrl,
    siteName: "Anisur Khan",
    images: [
      {
        url: "/profile.jpg",
        width: 800,
        height: 800,
        alt: "Anisur Khan",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anisur Khan · Full-Stack Engineer",
    description:
      "Full-stack engineer specializing in SaaS integrations and AI tooling.",
    images: ["/profile.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#5f5a54",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
