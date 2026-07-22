import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Aurora } from "./components/Aurora";

// Absolute base URL for resolving Open Graph and Twitter image paths.
// Vercel sets VERCEL_URL automatically for preview deployments.
// Override SITE_URL in production env to "https://anisurkhan.com".
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
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
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Inline script to set the theme before paint. Prevents the flash of wrong theme.
const themeScript = `(function(){try{var s=localStorage.getItem('theme');var t=s||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Aurora />
        {children}
      </body>
    </html>
  );
}
