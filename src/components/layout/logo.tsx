import Image from "next/image";
import Link from "next/link";

import logoLight from "@/assets/logos/logo-light.png";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * The mark plus wordmark, linking to the top of the page.
 *
 * Only the light artwork is imported. The platform ships a light/dark pair and
 * renders both, letting a `dark:` variant hide one — necessary there because
 * next-themes resolves the theme after SSR, so picking in JS would flash the
 * wrong mark. This site is light-only, so shipping the second file would be two
 * KB spent to render nothing.
 *
 * `aria-hidden` on the image: the link already carries the accessible name, and
 * without it a screen reader announces the brand twice.
 *
 * No plate behind it. This artwork *is* the accent — a gold tile would flatten
 * it against its own colour.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="#top"
      aria-label={`${siteConfig.name} — back to top`}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        className,
      )}
    >
      {/* `sizes` is deliberately ~3× the width the mark actually occupies. It is
          a hint about layout width, and the browser multiplies it by the device
          pixel ratio before choosing a candidate — declaring the honest 22px
          makes a retina screen pick a 32px file for a 44px slot and the mark
          renders soft. Over-declaring costs a couple of KB. */}
      <Image
        src={logoLight}
        alt=""
        aria-hidden="true"
        priority
        sizes="64px"
        className="h-8 w-auto shrink-0 object-contain transition-transform duration-200 group-hover:scale-105"
      />
      {/* `transition-colors` because the header inverts its palette when it has
          no plate behind it (`.header-on-photo`), and this wordmark travels from
          white to near-black with it. Harmless in the footer, which never
          changes.

          `.wordmark-optical` is the vertical alignment. `items-center` above centres
          the two boxes, but the mark is a shopping bag — a thin handle over a solid
          body — whose centre of mass sits at 58% of its height rather than 50%, so
          box-centring leaves the word visibly high. See the note in `globals.css`;
          the shift is derived from the artwork's alpha channel, not eyeballed. */}
      <span className="wordmark-optical text-[17px] font-semibold tracking-[-0.02em] text-content transition-colors duration-300">
        {siteConfig.name}
      </span>
    </Link>
  );
}
