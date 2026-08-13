import type { Metadata, Viewport } from "next";
import { Geist, Oranienbaum } from "next/font/google";

import { siteConfig } from "@/config/site";

import "./globals.css";

/**
 * Fonts are self-hosted at build time by next/font — no runtime request to
 * Google, and `display: swap` keeps text visible while they load.
 *
 * **Two families, not three.** `Geist_Mono` was here from the `create-next-app`
 * scaffold, wired to `--font-geist-mono`, bridged into Tailwind's `--font-mono`,
 * and applied to `<html>` — and `font-mono` appears nowhere on the page. It was a
 * whole family being subset, self-hosted and preloaded for zero glyphs. There is no
 * monospace type on a luxury marketing page: no code, no data tables, no counters.
 * The one place lining figures matter (the price column) uses `.tabular`, which is
 * `font-variant-numeric` on Geist rather than a second family.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Display serif, shared with the platform so the two properties read as one
 * brand.
 *
 * Loaded here (not per-section) because next/font must be called at module
 * scope, but it is only *applied* via `font-display` on editorial surfaces —
 * body copy and all UI chrome stay on Geist. Long-form serif on screen is
 * markedly harder to read; the serif is here to carry the brand, not the copy.
 *
 * One weight, latin subset: ~15 KB. Oranienbaum ships a single 400, so any
 * `font-semibold` on it makes the browser synthesise a fake bold — smeared
 * stems and broken serifs at display size.
 */
const oranienbaum = Oranienbaum({
  variable: "--font-oranienbaum",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.name,
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Do not lock zoom — pinch-to-zoom is an accessibility requirement.
  maximumScale: 5,
  themeColor: siteConfig.themeColor,
};

/**
 * Root layout carries only document-level concerns: fonts, metadata, and the
 * skip link. The header and footer belong to the page, so a future route (a
 * legal page, a story) can render a different shell without unpicking this.
 *
 * Typed as `React.ReactNode` rather than Next's generated `LayoutProps<"/">`:
 * that global only exists after `.next/types` has been generated, so relying on
 * it makes a clean-checkout `tsc --noEmit` fail in CI.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${oranienbaum.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        {/* First tab stop on the page — lets keyboard users skip the nav. */}
        <a
          href="#main"
          className="sr-only z-100 rounded-md bg-gold-solid px-4 py-2 text-sm font-semibold text-gold-content shadow-premium focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
        >
          Skip to content
        </a>

        {children}
      </body>
    </html>
  );
}
