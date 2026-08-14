import Image from "next/image";

import logoLight from "@/assets/logos/logo-light.png";
import { APP_URL, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Footer.
 *
 * Closes on an oversized wordmark rather than a dense link farm. On a
 * single-page site there are perhaps a dozen honest destinations, and a
 * four-column grid padded out to look substantial is the clearest possible
 * signal that a page is pretending to be a bigger company than it is — the
 * opposite of what this design is for.
 *
 * The link groups are deliberately short and every one of them resolves: either
 * an in-page anchor, the app, or a mailto. Nothing here is a placeholder route
 * that 404s.
 */

const GROUPS = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Missions", href: "#missions" },
      { label: "Maisons", href: "#maisons" },
      { label: "Editorial", href: "#editorial" },
    ],
  },
  {
    title: "Editions",
    links: [
      { label: "Signature", href: "#editions" },
      { label: "All Rounder", href: "#editions" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Open Snapi", href: APP_URL },
      { label: "Support", href: "mailto:support@snapi.app" },
    ],
  },
] as const;

const LINK = cn(
  "rounded-sm text-[13px] text-content-muted transition-colors duration-300",
  "hover:text-content focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
);

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-canvas">
      <div className="container-page py-20 sm:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_2fr]">
          <div>
            {/* Deliberately not `<Logo>`: that component is a link to `#top`, and a
                second "back to top" at the foot of the page duplicates a control the
                header already provides on every scroll position. The lockup is
                repeated rather than shared — but `.wordmark-optical` is the one part
                that must not drift between the two, which is why it is a utility
                rather than a number inlined twice. See `globals.css`. */}
            <div className="flex items-center gap-3">
              <Image
                src={logoLight}
                alt=""
                aria-hidden="true"
                sizes="64px"
                className="h-9 w-auto object-contain"
              />
              <span className="wordmark-optical text-lg font-semibold tracking-[-0.02em]">
                {siteConfig.name}
              </span>
            </div>

            <p className="mt-6 max-w-sm text-[13px] leading-relaxed text-content-muted">
              {siteConfig.description}
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {GROUPS.map((group) => (
              <div key={group.title}>
                <h3 className="text-eyebrow text-content-subtle">{group.title}</h3>
                <ul className="mt-5 flex flex-col gap-3.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className={LINK}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* The wordmark as a rule.
         *
         * Set in the display serif at a size that is unmistakably a graphic
         * rather than a heading, and clipped to the container so it reads as a
         * closing plate. `aria-hidden` — it says nothing the brand above has not
         * already said, and a screen reader announcing "Snapi" a third time on
         * the way out is noise. */}
        <div className="mt-20 overflow-hidden" aria-hidden="true">
          <p className="display-xl origin-left font-display text-[clamp(4rem,17vw,15rem)] leading-[0.8] font-normal text-content/[0.055] select-none">
            {siteConfig.name}
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-content-subtle">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>

          <p className="text-xs text-content-subtle">
            Photography is illustrative. Prices and availability are checked at the merchant.
          </p>
        </div>
      </div>
    </footer>
  );
}
