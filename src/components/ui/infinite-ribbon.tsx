import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Infinite scrolling ribbon. Ported from the platform.
 *
 * The `-50%` translate is only seamless because the track holds exactly twice
 * `repeat` copies; changing one without the other makes the loop visibly jump.
 *
 * Keyframes live in `globals.css` rather than an inline `<style>` — the crossed
 * layout mounts two of these, and a component-local stylesheet would inject the
 * same rules twice. `globals.css` also already neutralises every animation under
 * `prefers-reduced-motion`, so there is no local block here to drift out of step
 * with the global one.
 *
 * Width is caller-controlled. A rotated full-width bar leaves triangular gaps at
 * the left and right edges of its container, so callers that rotate must
 * oversize (e.g. `w-[112%]`) inside a clipping parent — see `RibbonDivider`.
 */

/**
 * Tones are deliberately fixed values rather than palette tokens, on the same
 * reasoning as the `onPhoto` button variant: a printed ribbon is a physical object,
 * and an object does not change colour because the UI did.
 *
 * `bg-ink` was the obvious token and is wrong here — `ink` is the *action*
 * surface, and reusing it would couple a decorative strip to the button colour.
 * The ink fill sits at 20% lightness: plainly near-black against the cream
 * canvas, while staying unmistakably the darker, receding half of the pair. The
 * gold hairline does the rest of that separation work.
 */
const TONE = {
  gold: "bg-[oklch(80%_0.13_85)] text-[oklch(20%_0.025_70)]",
  ink: "bg-[oklch(20%_0.007_60)] text-[oklch(96%_0.003_85)] ring-1 ring-[oklch(80%_0.13_85/0.3)] ring-inset",
} as const;

export function InfiniteRibbon({
  repeat = 5,
  duration = 10,
  reverse = false,
  rotation = 0,
  tone = "gold",
  decorative = false,
  children,
  className,
}: {
  repeat?: number;
  /** Seconds for one full cycle. Higher is slower. */
  duration?: number;
  reverse?: boolean;
  rotation?: number;
  tone?: "gold" | "ink";
  /**
   * Hide from assistive tech entirely and skip the screen-reader copy.
   *
   * Set this on every ribbon after the first in a crossed group: they carry the
   * same words, so without it each one announces the whole list again.
   */
  decorative?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const repeatCount = Math.max(1, Math.floor(repeat));

  return (
    <div
      className={cn("w-full max-w-full overflow-hidden py-2.5", TONE[tone], className)}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden={decorative || undefined}
    >
      {/* Announced once, as static text. The visible track is duplicated and
          would otherwise be read out `repeat * 2` times. */}
      {decorative ? null : <span className="sr-only">{children}</span>}

      <div
        aria-hidden="true"
        className="flex w-max whitespace-nowrap"
        style={{
          animationName: reverse ? "marquee-reverse" : "marquee",
          animationDuration: `${Math.max(0.1, duration)}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        {Array.from({ length: repeatCount * 2 }, (_, index) => (
          <span className="mr-8 inline-block select-none" key={index}>
            {children}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Crossed ribbon pair that closes the hero.
 *
 * Rendered as the hero's bottom edge, not as a sibling section, so the strips
 * lie over the photograph rather than on the canvas below it.
 *
 * Three pieces of geometry that are easy to get wrong:
 *
 * 1. **Both bars share one vertical centre.** Two lines through `(cx, y₁)` and
 *    `(cx, y₂)` with slopes `±m` meet at `x = cx + (y₁ − y₂) / 2m` — so they only
 *    cross at the horizontal centre when `y₁ = y₂`. Offsetting one bar downward
 *    (the obvious way to stack them) silently slides the crossing point sideways
 *    and the whole lockup reads as off-centre.
 *
 * 2. **The bars are 112% wide, centred.** Rotating a 100%-wide bar leaves a
 *    triangular wedge of bare canvas at each end. Oversizing inside a clipped
 *    parent is what makes them appear to run past both edges.
 *
 * 3. **Band height tracks width, via `aspect-ratio`.** A bar rotated by θ sweeps
 *    `width·sin θ + height·cos θ` vertically — ~150px at 1150px wide, ~195px at
 *    1630px. A fixed height is therefore correct at exactly one viewport size and
 *    clips the bars' ends at every other, which reads as "the strip doesn't reach
 *    the edge". `aspect-[6.5/1]` keeps the band proportional to that sweep, and
 *    `min-h` covers narrow screens where the ratio alone would be too short.
 *
 * Speed is ~45 px/second — slow enough to read a label as it passes. Duration
 * covers half the track (`repeat` copies), so it must be re-derived if `repeat`
 * or the label set changes; the two are coupled.
 */

const RIBBON_LABELS = [
  "Investment Pieces",
  "Archive Finds",
  "Quiet Luxury",
  "Seasonal Highlights",
] as const;

const SEPARATOR = "✦";

function ribbonLine(labels: readonly string[], offset: number) {
  // Rotate the second line's starting point so the bars aren't mirror images of
  // each other where they cross.
  const ordered = [...labels.slice(offset), ...labels.slice(0, offset)];
  return ordered.map((label) => `${label}  ${SEPARATOR}  `).join("");
}

const TYPE = "text-[11px] font-semibold tracking-[0.2em] uppercase sm:text-xs";

/**
 * Centring wrapper. The rotation lives in an inline `transform` on the ribbon
 * itself, and an inline style beats a utility class — so `-translate-*` on the
 * ribbon would be silently discarded. Centring has to happen on a parent.
 */
const CENTERED = "absolute top-1/2 left-1/2 w-[112%] -translate-x-1/2 -translate-y-1/2";

export function RibbonDivider() {
  return (
    /**
     * `w-full` alongside `aspect-ratio` is load-bearing. Leave the width implicit
     * and the ratio resolves the other way — deriving WIDTH from the clamped
     * `min-height` — which makes the band 112 × 6.5 = 728px wide on a 390px phone
     * and scrolls the whole page sideways.
     */
    // The band is slimmer than the app's. It now closes the hero's opening
    // state rather than a full-bleed photograph, so it shares a fixed viewport
    // with the headline, the buttons and the composer — and every pixel it takes
    // is one the composition above it does not get. `aspect-[7/1]` with a 132px
    // cap keeps the crossing legible without eating the stage.
    <div className="pointer-events-none relative isolate aspect-[7/1] max-h-[132px] min-h-[84px] w-full overflow-hidden">
      {/* Behind. `decorative` because the gold bar below already exposes the same
          words to assistive tech — without it the list is announced twice. */}
      <div className={CENTERED}>
        <InfiniteRibbon
          tone="ink"
          reverse
          rotation={-1}
          duration={52}
          repeat={4}
          decorative
          className={TYPE}
        >
          {ribbonLine(RIBBON_LABELS, 2)}
        </InfiniteRibbon>
      </div>

      {/* In front, and the one that carries the accessible copy. */}
      <div className={CENTERED}>
        <InfiniteRibbon
          tone="gold"
          rotation={3}
          duration={58}
          repeat={4}
          className={`shadow-premium ${TYPE}`}
        >
          {ribbonLine(RIBBON_LABELS, 0)}
        </InfiniteRibbon>
      </div>
    </div>
  );
}
