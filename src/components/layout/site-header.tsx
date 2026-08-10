"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import * as React from "react";

import { Logo } from "@/components/layout/logo";
import { buttonVariants } from "@/components/ui/button";
import { APP_URL, headerNav } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Sticky header.
 *
 * Starts as bare type on the hero's canvas and gains a frosted plate plus a
 * hairline once the page has moved. A header that carries its own background
 * from the first pixel puts a horizontal seam across the top of the hero, which
 * is the one place a luxury page can least afford one — and a chrome that
 * *earns* its surface as you scroll is the whole reason the treatment exists.
 *
 * The threshold is 24px rather than 0: with a 0 threshold, the rubber-band
 * scroll on iOS toggles the plate on and off while the page is at rest.
 *
 * `passive: true` on the listener — this handler never calls `preventDefault`,
 * and without the flag the browser must wait for it before painting each frame.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }

    onScroll(); // Restore the correct state on a reload part-way down the page.
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const drawerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  /**
   * Drawer behaviour: Escape closes, background scroll locks, and focus is
   * trapped inside.
   *
   * The trap is the part that is usually missing. Without it, Tab walks straight
   * out of the open menu and into the page behind it — which is still on screen
   * but covered, so a keyboard or screen-reader user is now operating links they
   * cannot see, with no way to tell that they have left the menu. It is the most
   * common accessibility defect in mobile navigation and it costs about fifteen
   * lines to not have.
   *
   * Focus is also returned to the button that opened the drawer on close.
   * Skipping that drops the caret back to the top of the document, and the user
   * has to tab through the whole header again to get back to where they were.
   */
  React.useEffect(() => {
    if (!menuOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    function focusableWithin(container: HTMLElement) {
      return Array.from(
        container.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const drawer = drawerRef.current;
      if (!drawer) return;

      // The trigger is deliberately part of the cycle: it is the control that
      // closes the drawer, so a trap that excluded it would leave a keyboard
      // user able to reach every link and nothing that dismisses them.
      const focusable = [triggerRef.current, ...focusableWithin(drawer)].filter(
        (node): node is HTMLElement => node !== null,
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        // 300ms, matching every colour transition inside. The plate used to take
        // 500 while the links took 300, which left a window with dark type on a
        // half-formed plate — briefly unreadable, and in the one place on the page
        // a reader is guaranteed to be looking.
        "transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        // White at 82%, not the canvas cream it used to be. A warm bar appearing
        // across the top of the hero 24px into the scroll read as a colour cast
        // rather than as chrome. White is also the better neutral over the cream
        // sections further down: a translucent white plate there lightens what is
        // behind it, which is what frosted glass does, where a cream plate on
        // cream just looks like a flat band.
        scrolled &&
          "bg-[oklch(100%_0_0/0.82)] shadow-[0_1px_0_var(--color-border)] backdrop-blur-xl backdrop-saturate-150",
      )}
    >
      {/* The inverted palette goes on the bar, **not** on `<header>`.
       *
       * The mobile drawer is a sibling below this, and it carries its own cream
       * background. Putting the swap on the ancestor would give it white links on
       * cream — invisible, and only on a control most people never open, which is
       * exactly the kind of bug that ships. Scoping it here means the drawer keeps
       * the page palette and needs no reset. */}
      <div
        className={cn(
          "container-page flex h-20 items-center justify-between gap-6",
          // No plate yet, so the bar is sitting directly on the hero's scrimmed
          // cloth. One class re-points the palette for everything inside — see
          // `.header-on-photo` in `globals.css`. It deliberately does not compose
          // with `.on-photo`: the header needs a paler gold than that scope
          // supplies, and stacking two equal-specificity classes left the winner
          // decided by source order.
          !scrolled && "header-on-photo",
        )}
      >
        <Logo />

        {/* The nav is centred on wide screens and absent below `lg`, where the
            drawer carries it. Rendering it hidden at both sizes would duplicate
            every link in the accessibility tree. */}
        {/* `gap-7` at `lg`, `gap-9` above it. Five items again now Editorial has
            joined, and the emphasised extension link is semibold with an icon, so
            it measures wider than a plain label. At 1024px that leaves roughly 80px
            of slack — enough, and worth re-checking if a sixth item is ever added.
            A nav that wraps inside a fixed 80px bar overlaps the logo rather than
            growing the bar. */}
        {/* One emphasised link among four plain ones.
         *
         * The emphasis is entirely typographic — colour, weight, and a hairline
         * that is already drawn. No pill, no border, no fill: a bordered object
         * mid-row would read as a button that had wandered out of the actions
         * cluster, and the four links either side would have to make room for it.
         * Type alone is also the only treatment that survives the header's palette
         * inversion without a second set of values.
         *
         * Three differences, each doing separate work:
         *
         *  - **Gold** against the others' muted neutral. The accent already means
         *    "this is the expressive one" everywhere else on the page.
         *  - **Semibold** against medium, which reads before the colour does and
         *    is the part that still works if you cannot distinguish the hue.
         *  - **A standing hairline** where the others draw one only on hover, so it
         *    looks like a link at rest rather than only under the cursor.
         *
         * Hover moves the underline's opacity and nudges the arrow — not the text
         * colour. A gold that darkens on hover is correct on the white plate and
         * disappears on the dark hero, and one hover rule cannot be right for both. */}
        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex xl:gap-9">
          {headerNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              // `noopener` because the extension link opens in a new tab: without
              // it the destination gets a `window.opener` handle back to this
              // page and can navigate it. `noreferrer` keeps the referrer off
              // the outbound request.
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className={cn(
                "group/nav relative inline-flex items-center gap-1 rounded-sm text-[13px] whitespace-nowrap",
                "transition-colors duration-300",
                "after:absolute after:-bottom-1.5 after:left-1/2 after:h-px after:-translate-x-1/2 after:bg-gold",
                "after:transition-[width,opacity] after:duration-300",
                item.cta
                  ? cn(
                      "font-semibold text-gold",
                      // Already drawn, and firms up under the cursor.
                      "after:w-full after:opacity-60 hover:after:opacity-100",
                    )
                  : cn(
                      "font-medium text-content-muted hover:text-content",
                      // Grows from the centre on hover.
                      "after:w-0 after:opacity-100 hover:after:w-full",
                    ),
              )}
            >
              {item.label}

              {item.external ? (
                <>
                  <ArrowUpRight
                    className="size-3.5 shrink-0 transition-transform duration-300 group-hover/nav:translate-x-0.5 group-hover/nav:-translate-y-0.5"
                    aria-hidden="true"
                    strokeWidth={2}
                  />
                  {/* The arrow is decoration, so the change of context still has
                      to be announced. */}
                  <span className="sr-only"> (opens in a new tab)</span>
                </>
              ) : null}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={APP_URL}
            className={cn(
              "hidden rounded-sm text-[13px] font-medium text-content-muted transition-colors duration-300 hover:text-content sm:inline-flex",
              "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
            )}
          >
            Sign in
          </a>

          {/* `duration-300` overrides the variant's own 200ms so the button's
              inversion lands with the plate and the rest of the header rather than
              a beat ahead of it. */}
          <a
            href={APP_URL}
            className={cn(buttonVariants({ variant: "primary", size: "sm" }), "duration-300")}
          >
            Open Snapi
          </a>

          <button
            ref={triggerRef}
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className={cn(
              "grid size-9 place-items-center rounded-full text-content lg:hidden",
              "transition-colors duration-300 hover:bg-surface-raised",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            )}
          >
            {menuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Drawer. Kept out of the DOM entirely when closed rather than hidden with
          a class — an off-screen nav that is still focusable sends keyboard users
          on a tour of links they cannot see. */}
      {menuOpen ? (
        <div
          ref={drawerRef}
          id="mobile-menu"
          className="border-t border-border bg-canvas/95 backdrop-blur-xl lg:hidden"
        >
          <nav aria-label="Primary, mobile" className="container-page flex flex-col py-4">
            {headerNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "group/nav flex items-center gap-2 border-b border-border py-4",
                  "font-display text-2xl font-normal last:border-b-0",
                  // The same emphasis as the desktop row, carried through rather
                  // than left as a desktop-only flourish. The drawer owns its cream
                  // background whatever the header is doing, so this is always the
                  // bronze gold and always clears AA.
                  item.cta ? "text-gold" : "text-content",
                )}
              >
                {item.label}
                {item.external ? (
                  <>
                    <ArrowUpRight
                      className="size-4 shrink-0 transition-transform duration-300 group-hover/nav:translate-x-0.5 group-hover/nav:-translate-y-0.5"
                      aria-hidden="true"
                      strokeWidth={1.75}
                    />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </>
                ) : null}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
