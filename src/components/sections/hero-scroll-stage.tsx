"use client";

import * as React from "react";

/**
 * The hero's scroll track and its pinned stage.
 *
 * A tall track holds the scroll distance; a `sticky` child one viewport high
 * holds still inside it while that distance is consumed. Everything the reader
 * sees moving is driven by a single number — how far through the track they are
 * — published as CSS custom properties on the stage.
 *
 * ## Why custom properties and not a motion library
 *
 * The obvious build is Framer Motion's `useScroll` + `useTransform` + a handful
 * of `motion.div`s. It is worse here on three counts:
 *
 *  1. **Cost, in the worst possible place.** It puts ~35 KB of JavaScript in
 *     front of the largest contentful paint. This hero *is* the LCP.
 *  2. **A React render per frame.** `useTransform` drives values through
 *     component state, so a 120 Hz trackpad flick asks React to reconcile 120
 *     times a second. Writing a custom property asks the style engine to
 *     recalculate, and nothing else.
 *  3. **The animation stops being inspectable.** With the values in CSS you can
 *     scrub `--hero-rise` in devtools and watch the whole composition respond.
 *
 * So: one rAF-coalesced scroll handler writes five numbers; every layer is a
 * plain CSS rule reading them. No component in the hero re-renders while
 * scrolling.
 *
 * ## The five signals
 *
 * They deliberately overlap rather than running in sequence — a transition whose
 * stages start only when the previous one has finished reads as a slideshow.
 *
 *  - `--hero-exit`      the opening copy leaving          (0 → 0.34)
 *  - `--hero-exit-fast` the answer card and CTAs leaving  (0 → 0.20)
 *  - `--hero-rise`      the photograph climbing           (0.10 → 0.72)
 *  - `--hero-edge`      the soft edge on the plate's leading boundary
 *  - `--hero-intro`     the tension copy arriving         (0.50 → 0.86)
 *
 * `--hero-glass` is declared in `globals.css` but no longer written here: the
 * hero's ground is scrimmed gold cloth, so it is dark at both ends and the
 * composer stays on one material throughout.
 *
 * The card and CTAs clear *first* (0.20) because they sit below the composer,
 * which is where the photograph arrives from. Fading them on the same curve as
 * the headline above would put live links on top of an incoming photograph.
 *
 * ## Reduced motion
 *
 * The loop never starts, so no property is ever written and every layer holds
 * its declared default. The CSS then unpins the stage entirely under
 * `prefers-reduced-motion` and lays the hero out in normal flow — see the
 * `motion-reduce:` variants in `hero.tsx` and the block in `globals.css`. The
 * tension copy is not lost: `<TheProblem>` renders as an ordinary section for
 * exactly these readers.
 */

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);

/** Map a progress value onto a sub-range, clamped to 0…1 outside it. */
const between = (progress: number, from: number, to: number) =>
  clamp01((progress - from) / (to - from));

/**
 * easeInOutCubic.
 *
 * A linear map from scroll position to opacity is what makes most scroll
 * animations feel mechanical: the reader's own scrolling already has
 * acceleration, and layering an un-eased response on top of it reads as the page
 * being dragged rather than as anything moving under its own weight. Easing the
 * ends is most of the difference between "scroll-linked" and "considered".
 */
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Whether the results card has been revealed.
 *
 * The one piece of scroll state that has to reach React rather than staying in
 * CSS: the conversation's demo loop behaves differently either side of it. Held
 * back until the card is on screen, the loop only cycles prompts — there is no
 * point "answering" into a card nobody can see, and a reader arriving at the
 * reveal would catch the sequence mid-way. Once revealed it runs in full, so
 * scrolling into it means watching Snapi think and then answer.
 *
 * A context rather than a prop so the value crosses `hero.tsx`, which is a
 * Server Component and cannot thread client state through.
 *
 * Flipped on a threshold, not per frame, so this costs two renders across an
 * entire pass rather than one per scroll event.
 */
const HeroRevealContext = React.createContext(false);

export function useHeroRevealed() {
  return React.useContext(HeroRevealContext);
}

/** Progress at which the card starts fading in — must match `--hero-intro`. */
const REVEAL_AT = 0.5;

export function HeroScrollStage({ children }: { children: React.ReactNode }) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = React.useState(false);

  React.useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    // Checked once rather than subscribed to: someone changing this preference
    // mid-scroll is not a case worth carrying a listener for, and a reload
    // applies it.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let wasPast: boolean | null = null;

    /**
     * Where the anchor has to sit at each end of the transition.
     *
     * Only the composer is in the anchor's layout box — the copy above and the
     * card-plus-buttons below are absolutely placed — so the stage's flex
     * centring puts the *composer* dead centre and lets the rest hang off its
     * edges. That is right at the end of the transition and wrong at the start,
     * where roughly 450px of card and buttons hang below against 250px of copy
     * above and the whole composition sits low.
     *
     * So two offsets are published and the CSS interpolates between them:
     *
     *  - `--hero-shift-rest`: lifts the anchor by half the imbalance, which
     *    optically centres the full composition on load.
     *  - `--hero-shift-end`:  lets it fall back so the composer is centred once
     *    everything around it has gone, nudged down by half the arriving tension
     *    copy so that pair is centred rather than the card alone.
     *
     * Measured, not guessed: the card's height moves with the viewport (row
     * heights are `svh`-clamped and the third row disappears below `sm`), so a
     * constant would be correct at exactly one window size.
     *
     * Rects are read relative to the anchor's own rect, so the anchor's
     * translate cancels out of every difference and the numbers stay stable
     * whatever the current scroll position is. Run on mount, on resize, and from
     * a `ResizeObserver` — never per frame, since reading geometry inside a
     * scroll handler is the classic way to turn a compositor animation back into
     * a janky one.
     */
    /**
     * How far the column has to move to keep the *end* state centred.
     *
     * The opening state needs no arithmetic at all — the copy, the buttons and
     * the composer are flow siblings in a centred column, so the browser centres
     * them correctly on first paint, before this script exists.
     *
     * The end state does, because the balance inverts. What is visible then is a
     * short line of tension copy (`I`), the composer, and a tall results card
     * (`C`) hanging out of flow below it. Working in the column's own
     * coordinates, with `A` the height of the block above the composer and `g`
     * the card's offset from its foot, the visible span runs from `A − I` to
     * `A + m + F + g + C`. Setting the midpoint of that against the column's own
     * centre, `(A + m + F) / 2`, the `m` and `F` terms cancel and the correction
     * reduces to `(I − A − g − C) / 2` — negative, i.e. upward, which is what you
     * would expect when the tall thing has moved from above the composer to
     * below it.
     *
     * ## Plus half the ribbon band
     *
     * That alone leaves the end state sitting visibly high, and the reason is
     * outside the column entirely. The ribbons are `shrink-0` in the stage's flex
     * column, so they reserve their height for good, and the content therefore
     * centres in `stageHeight − ribbonHeight`. While the ribbons are on screen
     * that is exactly right. By the end of the transition they are fully
     * transparent — still occupying the space, no longer using it — so that band
     * is dead, and the true centre has moved down by half of it:
     *
     *     shift = (I − A − g − C) / 2  +  R / 2
     *
     * The ribbons cannot simply be collapsed instead: their height leaving the
     * flow would re-centre the column mid-scroll and drag the composer with it,
     * and the composer holding still is what the whole transition rests on.
     *
     * Every term is an `offsetHeight` or an `offsetTop`. Those ignore transforms,
     * so the fade-and-drift on `.hero-exit`, `.hero-intro` and `.hero-reveal`
     * cannot skew a measurement taken mid-scroll — which
     * `getBoundingClientRect` would have.
     */
    function measure() {
      if (!stage) return;

      const above = stage.querySelector<HTMLElement>("[data-hero-above]");
      const intro = stage.querySelector<HTMLElement>("[data-hero-intro]");
      const form = stage.querySelector<HTMLElement>("[data-hero-form]");
      const below = stage.querySelector<HTMLElement>("[data-hero-below]");
      const card = stage.querySelector<HTMLElement>("[data-hero-card]");
      const ribbon = stage.querySelector<HTMLElement>("[data-hero-ribbon]");
      if (!above || !intro || !form || !below || !card) return;

      // `below` is `top: 100%` of a box whose height is the form's, plus a
      // margin — so this difference is that margin, without hardcoding it.
      const gap = below.offsetTop - form.offsetHeight;

      // Optional: the ribbons could be removed from the hero without this
      // measurement becoming wrong, only unnecessary.
      const reclaimed = ribbon ? ribbon.offsetHeight / 2 : 0;

      const shift =
        (intro.offsetHeight - above.offsetHeight - gap - card.offsetHeight) / 2 + reclaimed;

      stage.style.setProperty("--hero-shift-end", `${shift.toFixed(1)}px`);
    }

    function write() {
      frame = 0;
      if (!track || !stage) return;

      const rect = track.getBoundingClientRect();
      // The scrollable span is the track minus the pinned stage. Guard the
      // zero case: on a viewport taller than the track (or before layout has
      // settled) this would otherwise divide by zero and write NaN into every
      // property, which CSS discards silently and invisibly.
      const span = rect.height - window.innerHeight;
      const progress = span <= 0 ? 0 : clamp01(-rect.top / span);

      stage.style.setProperty("--hero-exit", ease(between(progress, 0, 0.34)).toFixed(4));
      stage.style.setProperty("--hero-exit-fast", ease(between(progress, 0, 0.2)).toFixed(4));
      stage.style.setProperty("--hero-rise", ease(between(progress, 0.1, 0.72)).toFixed(4));
      stage.style.setProperty("--hero-edge", (1 - between(progress, 0.6, 0.74)).toFixed(4));
      stage.style.setProperty("--hero-intro", ease(between(progress, 0.5, 0.86)).toFixed(4));
      // `--hero-glass` is deliberately not written. The hero's ground is dark at
      // both ends now, so the composer and card stay on the dark material
      // throughout — see the note on the token in `globals.css`.

      /**
       * Opacity alone does not stop a link being clickable, and the CTA row is
       * fully transparent for two thirds of this transition while sitting over
       * the photograph. Without this, a reader mid-way through the hero can
       * click "See how it works" by accident on something they cannot see.
       *
       * A data attribute rather than a sixth custom property because
       * `pointer-events` cannot be interpolated — it is a threshold, so it is
       * written as one, and only when it actually flips.
       */
      const past = progress > 0.36;
      if (past !== wasPast) {
        wasPast = past;
        if (past) stage.dataset.heroPast = "";
        else delete stage.dataset.heroPast;
      }

      // The one value that leaves CSS. Guarded so React only sees a render when
      // the threshold is actually crossed — twice per pass, not once per frame.
      setRevealed((current) => {
        const next = progress > REVEAL_AT;
        return next === current ? current : next;
      });
    }

    function onScroll() {
      // Coalesce to one write per frame. A scroll listener can fire several
      // times between paints, and each extra call is a full style recalculation
      // thrown away.
      if (!frame) frame = requestAnimationFrame(write);
    }

    function onResize() {
      measure();
      onScroll();
    }

    measure();
    write();

    /**
     * The anchor's height changes once after mount even without a resize: the
     * display serif and the answer card's own web font swap in, and the card's
     * measured height moves with them. A `ResizeObserver` catches that, plus any
     * later change, without polling.
     */
    const anchor = stage.querySelector<HTMLElement>("[data-hero-anchor]");
    const observer = anchor ? new ResizeObserver(measure) : null;
    if (anchor && observer) observer.observe(anchor);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      ref={trackRef}
      // The track's height *is* the transition's length: viewport + travel.
      // 240svh gives 140svh of travel on phones, 300svh gives 200svh on desktop
      // — roughly one thumb-swipe and two wheel-flicks respectively. `svh`, not
      // `vh`: on mobile `vh` measures the viewport with the browser chrome
      // hidden, so the pinned stage is taller than what is actually on screen
      // and the composition is cropped until the user scrolls.
      className="relative h-[240svh] motion-reduce:h-auto lg:h-[300svh]"
    >
      <div
        ref={stageRef}
        className="hero-stage sticky top-0 h-svh overflow-hidden motion-reduce:static motion-reduce:h-auto motion-reduce:overflow-visible"
      >
        <HeroRevealContext.Provider value={revealed}>{children}</HeroRevealContext.Provider>
      </div>
    </div>
  );
}
