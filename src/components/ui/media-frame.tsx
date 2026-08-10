import Image from "next/image";
import type * as React from "react";

import { cn } from "@/lib/utils";
import type { ImageSource } from "@/types/media";

/**
 * Aspect-ratio-reserved media box, used by the Missions grid and the editorial
 * spread.
 *
 * Two things it establishes, both expensive to retrofit:
 *
 *  1. **The box holds its aspect ratio.** Nothing reflows as a photograph
 *     decodes — no layout shift, no CLS penalty.
 *  2. **The scrim already exists.** Titles sit on `.media-scrim`, so they are
 *     legible over an arbitrary photograph from day one. Adding a scrim after the
 *     fact always means re-tuning every card's type colour at once.
 *
 * The corollary, and the rule that is easiest to break: **do not put
 * `border-border` on a MediaFrame, and do not use theme text colours inside one.**
 * These tiles are dark whatever the page is doing; a light border token rings them
 * with a pale halo on the cream canvas, and `text-content` renders a near-black
 * headline onto a dark photograph. Content over media is always white or
 * white-alpha.
 *
 * ## What was removed in cleanup
 *
 * `src` used to be optional, with a `.media-placeholder` studio-backdrop fallback
 * for `null` — carried over from the platform, where mock data ships without
 * imagery. Every call site here passes a real static import, so the branch and its
 * CSS were dead. `src` is now required, which also means TypeScript catches a
 * missing image rather than the page quietly rendering a grey rectangle.
 *
 * `priority` and `zoomOnHover` were props no caller ever set. The zoom is now
 * unconditional; the two `priority` images on this site are plain `next/image`
 * elements in the hero, not MediaFrames.
 *
 * Server Component — no `onError` fallback on purpose. These are curated editorial
 * assets, not user uploads; if one 404s that is a content bug that should be
 * visible, not silently patched over.
 */
export function MediaFrame({
  src,
  alt,
  className,
  children,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  scrim = true,
  focus,
}: {
  /** A static import, so Next can emit intrinsic dimensions and a blur placeholder. */
  src: ImageSource;
  /** Empty string only for art that a visible caption already describes. */
  alt: string;
  className?: string;
  children?: React.ReactNode;
  sizes?: string;
  scrim?: boolean;
  /**
   * `object-position` override, as a Tailwind class (e.g. `object-[50%_72%]`).
   *
   * Needed whenever a source is cropped into a differently-shaped card and the
   * subject is not centred — a centre crop of a low-framed shot silently removes
   * the thing the photo is of. Belongs to the **photo**, not the card, so it
   * follows the image if it moves to another slot.
   */
  focus?: string;
}) {
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      {/* 700ms, not 200ms: a slow settle reads as expensive. Fast transforms read
          as a web app. Assumes an ancestor carries `group`, which both call sites
          do. */}
      <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          // Blur-up only when a `blurDataURL` actually exists — i.e. a static
          // import of a raster file. Passing placeholder="blur" for a remote URL
          // or an SVG import throws at render time, so this is a guard, not an
          // optimisation.
          placeholder={typeof src === "object" && src.blurDataURL ? "blur" : undefined}
          className={cn("object-cover", focus)}
        />
      </div>

      {scrim ? <div className="media-scrim absolute inset-0" aria-hidden="true" /> : null}

      {/* Edge as an inset hairline rather than a border on the caller — an inset
          white/gold hairline reads as the edge of a print, where a border token
          would ring a dark tile with a pale halo on the cream canvas. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-white/10 transition-[box-shadow] duration-500 ring-inset group-hover:ring-gold/45"
      />

      {children}
    </div>
  );
}
