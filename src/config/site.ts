/**
 * Single source of truth for product-level strings.
 *
 * Anything that appears in more than one place — the product name, the tagline,
 * the nav, the app URL — lives here so a copy change is one edit, not a grep.
 * Mirrors `snapi-platform/src/config/site.ts`; keep the two in step.
 */
export const siteConfig = {
  name: "Snapi",
  /** Kept in step with the hero headline — this string feeds every page title. */
  tagline: "Found, not searched.",
  /** Kept in step with the hero's support line, word for word after the dash. */
  description:
    "Snapi is an AI shopping concierge. Snap it, say it, or simply describe it — Snapi combs every maison and vetted reseller, prices it honestly, and tells you when to buy.",
  url: "https://snapi.app",
  locale: "en-US",
  /** Must track --color-canvas in globals.css. */
  themeColor: "#faf8f4",
  /**
   * Search terms, deliberately **not** rewritten to match the page's voice.
   *
   * The visible copy calls Snapi a concierge. Nobody types "AI shopping concierge"
   * into a search engine — they type "assistant" and "personal shopper", by a wide
   * margin. Keywords exist to be matched against what people actually search for,
   * not to be consistent with the headline above them, and a brand that renames its
   * own category is the one that most needs to keep the old word here.
   */
  keywords: [
    "AI shopping assistant",
    "AI personal shopper",
    "visual search",
    "price comparison",
    "luxury resale",
    "snap to shop",
  ],
} as const;

/**
 * Where "Open Snapi" goes.
 *
 * The platform is a separate deployment, so this is an absolute URL rather than
 * a route. One constant because it appears in the header, the hero, the closing
 * panel and the footer — four places to miss when the host changes.
 */
export const APP_URL = "https://app.snapi.app";

/**
 * The browser extension.
 *
 * ⚠️ PLACEHOLDER — this URL is invented and must be replaced before launch.
 *
 * The extension is not mentioned anywhere in the platform, so there is nothing
 * to derive a real destination from. It is a named constant rather than an
 * inline `href` so there is exactly one line to change, and so a search for
 * "PLACEHOLDER" finds it.
 *
 * If it should instead scroll to a section of this page, make it an anchor like
 * the rest of `headerNav` and build the section — a nav entry pointing at a page
 * that does not exist is the one thing the note below rules out.
 */
export const EXTENSION_URL = "https://chromewebstore.google.com/"; // PLACEHOLDER

/**
 * Header navigation.
 *
 * In-page anchors, not routes: this is a single-page site, and a nav that
 * promises pages which do not exist is worse than a short nav. The extension is
 * the one exception — it leaves the site entirely, so it is flagged `external`
 * and rendered with the attributes that implies.
 */
export interface HeaderNavItem {
  label: string;
  href: string;
  /**
   * Leaves the site. Rendered with `target="_blank"`, `rel="noopener noreferrer"`,
   * a visible ↗ and a screen-reader-only "opens in a new tab".
   *
   * Optional, and typed here rather than left to `as const` inference: with a
   * const assertion the array becomes a union in which only one member has this
   * key, and reading `item.external` while mapping is a type error.
   */
  external?: boolean;
  /**
   * Give this item the emphasised treatment: gold, semibold, and a standing gold
   * hairline where the others only draw one on hover.
   *
   * Deliberately a separate flag from `external`. The two happen to coincide on
   * one item today, and conflating them would mean any future outbound link
   * silently inherited the emphasis — which only works while there is exactly one
   * of them. `external` is *where it goes*; `cta` is *how loud it is*.
   *
   * Exactly one item should carry this. Two emphasised links in a five-item nav
   * is the same as none.
   */
  cta?: boolean;
}

export const headerNav: HeaderNavItem[] = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Missions", href: "#missions" },
  { label: "Maisons", href: "#maisons" },
  { label: "Editorial", href: "#editorial" },
  { label: "Snapi Extension", href: EXTENSION_URL, external: true, cta: true },
];
