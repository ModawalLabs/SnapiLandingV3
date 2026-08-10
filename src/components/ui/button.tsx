import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Button styling, as a variant function rather than a component.
 *
 * There is no `<Button>` here, and that is deliberate rather than an omission.
 * Every action on this page is an `<a>` — the four `Open Snapi` links, `Sign in`,
 * `See how it works`, the edition links, `Read your Edit`. A component that
 * rendered `<button>` was written first, exported, and never once used; the
 * `buttonVariants(...)` string it was built around is what every call site
 * actually wants. Add the component back the day there is a real `<button>` on
 * the page, not before.
 *
 * Variant naming follows the palette's intent, not its colour: `primary` is the
 * high-contrast ink action, `gold` is the one expressive action per view. **If two
 * gold buttons are visible at once, one of them is wrong.**
 *
 * Reduced from seven variants to four and five sizes to three during cleanup.
 * `outline`, `ghost`, `link`, `icon` and `icon-sm` were ported from the platform
 * and never used on a page with this few controls — and an unused variant is worse
 * than a missing one, because the next person assumes it has been looked at.
 */
export const buttonVariants = cva(
  cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full whitespace-nowrap",
    "font-medium transition-[background-color,color,border-color,box-shadow,transform] duration-200",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "active:scale-[0.98]",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ),
  {
    variants: {
      variant: {
        primary: "bg-ink text-ink-content shadow-premium-sm hover:bg-ink-hover",
        gold: "bg-gold-solid text-gold-content shadow-premium-sm hover:bg-gold-solid-hover",
        secondary:
          "border border-border bg-surface text-content shadow-premium-sm hover:border-border-strong hover:bg-surface-raised",
        /**
         * For use over photography only. Fixed white-alpha values rather than
         * theme tokens — a photograph does not change colour because the page is
         * light, so anything sitting on one must not either.
         */
        onPhoto:
          "border border-white/25 bg-white/10 text-white backdrop-blur-md hover:border-white/45 hover:bg-white/20",
      },
      size: {
        sm: "h-9 px-4 text-[13px]",
        md: "h-11 px-5 text-sm",
        lg: "h-13 px-7 text-[15px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);
