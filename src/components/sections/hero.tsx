import Image from "next/image";

import goldCloth from "@/assets/hero/gold-cloth.jpg";
import winterDay from "@/assets/hero/winter-day.jpg";
import { HeroConversation } from "@/components/sections/hero-conversation";
import { HeroScrollStage } from "@/components/sections/hero-scroll-stage";
import { buttonVariants } from "@/components/ui/button";
import { RibbonDivider } from "@/components/ui/infinite-ribbon";
import { APP_URL } from "@/config/site";
import {
  PROBLEM_EYEBROW,
  PROBLEM_HEADLINE_LEAD,
  PROBLEM_HEADLINE_REST,
} from "@/content/problem";
import { cn } from "@/lib/utils";

/**
 * The hero, as a scroll transition.
 *
 * The composer is the fixed point. Everything else is staged around it: the
 * opening copy and its buttons lift away, the ribbons fade with them, the
 * photographic band climbs up from below the fold to become the ground the card
 * is sitting on, the card's glass turns from white frost to the platform's dark
 * hero material, and the tension copy resolves into the space the headline
 * vacated — with the results card arriving beneath it.
 *
 * The mechanics live in `HeroScrollStage` (one rAF loop, a handful of custom
 * properties) and `globals.css` (every layer's response). This file is only the
 * composition.
 *
 * ## Centring
 *
 * The opening state is centred by **normal flow**, not by measurement: the copy,
 * the buttons and the composer are flow siblings in a column, and the column is
 * centred in the space above the ribbons. That is correct on first paint, before
 * any script runs, and at every window size — where the previous
 * measure-and-offset approach was only correct once JS had run and had a visible
 * settling step.
 *
 * Only the *end* state needs arithmetic, because the balance inverts: a short
 * line of tension copy above and a tall results card below. `HeroScrollStage`
 * publishes that one offset as `--hero-shift-end`.
 *
 * ## The ribbons
 *
 * In flow at the foot of the stage rather than absolutely placed, so they can
 * never collide with the composer on a short window — the column simply centres
 * in whatever is left. They fade on `.hero-exit` with the rest of the opening
 * state, and keep their height while invisible so nothing above them moves.
 *
 * ## Fitting one viewport
 *
 * A pinned stage must contain both its states at any viewport height. Type and
 * spacing clamp against `svh` as well as `vw`, and the answer card's third row
 * appears only when there is both the width and the height for it — that row is
 * the ~70px that decides whether the end state fits a laptop.
 *
 * ## Layer order
 *
 * Gold cloth + scrim (z-0) → snow photograph (z-10) → content and ribbons
 * (z-20). The plate rises *over* the cloth and *under* the type, which is what
 * lets the opening copy fade out against whichever ground is behind it at that
 * moment.
 *
 * ## Everything here is pinned to light values
 *
 * The ground is a photograph at both ends of the transition, so the whole column
 * carries `.on-photo` and the type is white and white-alpha. Theme tokens inside
 * would be a bug even though the site is light: `text-content` is a near-black
 * tuned for cream, and the page's `--color-gold` is a bronze that renders almost
 * black on the cloth. Same rule as the mission cards and the closing panel —
 * anything sitting on a photograph takes its colours from the photograph.
 *
 * `--hero-glass` is pinned to its dark end for the same reason: the composer and
 * the results card are on a dark ground from the first frame, so there is no
 * light material for them to start from.
 *
 * There is no seam where the hero ends. By the time the stage un-pins the
 * photograph fills it, so the page hands over from plate to cream.
 */
export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-heading">
      <HeroScrollStage>
        {/* The ground: gold cloth under a scrim.
         *
         * `priority` sits here rather than on the snowy plate below, because
         * *this* is what is on screen at rest and therefore the hero's largest
         * contentful paint. The plate is off-screen until the reader scrolls.
         *
         * The scrim is a flat 0.78 — see `.hero-cloth-scrim` in `globals.css`
         * for the contrast arithmetic, for why it is uniform rather than ramped,
         * and for why 0.78 is a floor rather than a preference. The cloth is a
         * high-key image and its lit folds are what set that floor.
         *
         * No opacity fade as the plate rises: the plate is opaque and covers
         * this completely by the end, so a fade would only risk showing the
         * body's cream through the part it has not reached yet. */}
        <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          <Image
            src={goldCloth}
            alt=""
            fill
            priority
            sizes="100vw"
            // Next's default re-encode is q75, which was quietly the binding
            // constraint here — a carefully encoded source is pointless if the
            // optimiser then flattens it. 90 is declared in `next.config.ts`;
            // Next 16 rejects any quality not on that allowlist.
            quality={90}
            placeholder="blur"
            className="object-cover object-center"
          />

          <div className="hero-cloth-scrim absolute inset-0" />
        </div>

        {/* The photograph, climbing. Under reduced motion `.hero-rise` becomes
            `position: relative` with a 2.5 aspect ratio, so this drops back into
            normal flow beneath the content as an ordinary banner. */}
        <div className="hero-rise absolute inset-0 z-10 overflow-hidden">
          <Image
            src={winterDay}
            alt="A woman in a black wool coat and wide-brimmed hat on a snow-covered promenade."
            fill
            // `eager` because the plate is needed within one swipe of load, and
            // lazy-loading an element that is inside the stage's bounds but
            // transform-shifted below it is a coin-flip across browsers — a
            // blank plate rising up the screen is far worse than the bytes.
            //
            // Next preloads this alongside the cloth and gives neither a
            // `fetchpriority` hint, so they do compete. That is an accepted cost,
            // not an oversight: the alternative is a hero that visibly tears on
            // the way into the transition.
            loading="eager"
            /**
             * Over 100vw, and deliberately.
             *
             * `sizes` describes the box, but `object-cover` on an image far wider
             * than its container does not render at the box's width. This frame
             * is 2.51:1 in a stage that is nearer 1.8:1, so it is scaled to match
             * the stage's *height* and the sides are cropped — the rendered image
             * is `stageHeight × 2.51` across, which on a 1440 × 800 stage is
             * about 2000px, or 140vw. Declaring 100vw asks for a variant a third
             * too small and it arrives visibly soft.
             *
             * The narrow value is capped well below the honest figure: a 390px
             * phone with a tall stage would need ~430vw, and serving that is not
             * worth it for a background at 3× device pixel ratio.
             */
            sizes="(min-width: 768px) 150vw, 250vw"
            // Left at Next's default 75 rather than the cloth's 90. This sits
            // under an 0.78 veil and a vignette, so barely a fifth of its tonal
            // range survives to be judged — and it is the one image on the page
            // that phones download at well over 100vw.
            placeholder="blur"
            // The subject is hard right in a 2.51:1 frame, so a centre crop on
            // anything but a very wide stage keeps the empty promenade and loses
            // her. `72%` centres the face on a phone, where only ~23% of the
            // width survives the crop; `58%` on wide stages lets more of the
            // receding lamps back in while still framing her comfortably.
            // Vertical is irrelevant — the frame is always taller-cropped by
            // width, never by height — and is set only for clarity.
            className="object-cover object-[72%_50%] lg:object-[58%_50%]"
          />

          {/* Vignette plus veil — see `.hero-plate-scrim` in `globals.css` for
              the contrast arithmetic and for why this one is graded while the
              cloth's is flat. The old inline `via-black/25` was nowhere near
              enough: over fog at 0.85 luminance it left white type at under 2:1,
              which is illegible, and it was the same failure with the previous
              photograph — the higher-resolution plate only makes it easier to
              see. */}
          <div aria-hidden="true" className="hero-plate-scrim absolute inset-0" />

          {/* The travelling edge — the plate's leading boundary dissolves into
              the page rather than arriving as a hard horizontal seam. It clears
              once the photograph has landed.
              A *dark* warm gradient, and its opening stop matches the cloth
              scrim's alpha exactly, so the plate's leading edge starts at the
              tone of the ground it is covering and there is nothing to see at the
              join. Keep the two in step: if `.hero-cloth-scrim` changes, this
              changes. It used to fade from the page's white; against the cloth
              that drew a bright band across the front of the plate — the opposite
              of dissolving into it. */}
          <div
            aria-hidden="true"
            className="hero-edge absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[oklch(8%_0.02_70/0.78)] to-transparent"
          />
        </div>

        {/* Content column and ribbons. A flex column so the ribbons take real
            space at the foot and the content centres in the remainder — no
            overlap is possible however short the window gets. */}
        <div className="relative z-20 flex h-full flex-col motion-reduce:h-auto">
          <div className="flex flex-1 items-center py-6 motion-reduce:py-28">
            <div className="container-page">
              {/* `.on-photo` on the whole column, not just the tension copy.
                  Everything here now sits on a scrimmed photograph, and the
                  page's `--color-gold` is a dark bronze tuned to clear AA against
                  a cream canvas — on the cloth it renders almost black. The scope
                  pins gold *and* the `--foil-*` range to their bright variants,
                  so the eyebrow and the foil on "Found," both survive with no
                  per-element override. */}
              <div
                data-hero-anchor
                className="hero-anchor on-photo relative mx-auto flex w-full max-w-3xl flex-col text-center"
              >
                {/* Everything above the composer. The opening copy and the CTA
                    row are flow siblings here; the tension copy is absolutely
                    placed over them and bottom-aligned, so both states share one
                    baseline against the composer's top edge and neither can
                    move it. */}
                <div data-hero-above className="relative w-full">
                  <div className="hero-exit">
                    <p className="text-eyebrow animate-rise text-gold">
                      AI-assisted personal shopping
                    </p>

                    {/* `font-normal`, not semibold: Oranienbaum ships a single
                        400 weight, so anything heavier makes the browser
                        synthesise a fake bold — smeared stems and broken serifs
                        at display size. The clamp takes `svh` as well as `vw` so
                        the headline shrinks with a short window rather than
                        being cropped by it. */}
                    <h1
                      id="hero-heading"
                      // `text-white`, not `text-content`. A photograph does not
                      // get lighter because the page is, so anything sitting on
                      // one takes fixed light values — the same rule the mission
                      // cards and the closing panel follow.
                      className="mx-auto mt-[clamp(0.75rem,2.2svh,1.5rem)] max-w-4xl animate-rise font-display text-[clamp(2.25rem,min(6vw,8svh),4.5rem)] leading-[1.04] font-normal tracking-[-0.008em] text-white"
                      style={{ animationDelay: "70ms" }}
                    >
                      <span className="text-foil">Found,</span>
                      <br />
                      not searched.
                    </h1>

                    {/* Hidden on the smallest screens, where the vertical budget
                        goes to the answer card — which demonstrates this
                        sentence far better than the sentence does. */}
                    <p
                      // `white/85`, raised from 75 when the scrim was lightened.
                      // This is the lightest small text on the cloth, so it is
                      // what sets the scrim's floor — see `.hero-cloth-scrim`.
                      // At 75 it drops below AA over the lit folds.
                      className="mx-auto mt-[clamp(0.75rem,2svh,1.5rem)] hidden max-w-xl animate-rise text-[15px] leading-relaxed text-white/85 sm:block sm:text-[1.0625rem]"
                      style={{ animationDelay: "120ms" }}
                    >
                      Snap it, say it, or simply describe it. Snapi searches every maison and
                      vetted reseller, compares the real price, and tells you when to buy.
                    </p>

                    <div
                      className="mt-[clamp(1.25rem,3svh,2.25rem)] flex animate-rise flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4"
                      style={{ animationDelay: "180ms" }}
                    >
                      {/* The one gold fill above the fold. A second would halve
                          the value of both — see the note in `button.tsx`. */}
                      <a
                        href={APP_URL}
                        className={cn(buttonVariants({ variant: "gold", size: "lg" }))}
                      >
                        Open Snapi
                      </a>

                      {/* `onPhoto`, not `secondary`. The secondary variant is a
                          white card with a cream border — correct on a cream
                          page, a bright slab on the cloth. This one is fixed
                          white-alpha over glass, which is what a photographic
                          ground needs.

                          Hidden on phones: the scroll transition now performs
                          this link's job, and the row costs vertical space the
                          pinned stage does not have. */}
                      <a
                        href="#how-it-works"
                        className={cn(
                          buttonVariants({ variant: "onPhoto", size: "lg" }),
                          "hidden sm:inline-flex",
                        )}
                      >
                        See how it works
                      </a>
                    </div>
                  </div>

                  {/* `.on-photo` now comes from the column above, so it is not
                      repeated here. */}
                  <div data-hero-intro className="hero-intro absolute inset-x-0 bottom-0">
                    <p className="text-eyebrow text-gold">{PROBLEM_EYEBROW}</p>

                    <p className="mx-auto mt-[clamp(0.75rem,2.2svh,1.5rem)] max-w-3xl font-display text-[clamp(1.5rem,min(4.4vw,6svh),3rem)] leading-[1.14] font-normal tracking-[-0.005em] text-white">
                      {PROBLEM_HEADLINE_LEAD}{" "}
                      <span className="text-white/55">{PROBLEM_HEADLINE_REST}</span>
                    </p>
                  </div>
                </div>

                {/* ---- the fixed point ---- */}
                <div
                  className="mt-[clamp(1.5rem,3.5svh,2.5rem)] animate-rise"
                  style={{ animationDelay: "240ms" }}
                >
                  <HeroConversation />
                </div>
              </div>
            </div>
          </div>

          {/* The ribbons close the opening state and leave with it. `shrink-0`
              so they keep their height while invisible — collapsing them would
              re-centre the column mid-transition and drag the composer with it.

              Because they keep that height, the content above centres in
              `stageHeight − ribbonHeight`, which is correct while they are
              visible and half a band too high once they are not. `measure()`
              reads this element and hands that half back at the end of the
              transition, which is why it is tagged. */}
          <div data-hero-ribbon className="hero-exit shrink-0">
            <RibbonDivider />
          </div>
        </div>
      </HeroScrollStage>
    </section>
  );
}
