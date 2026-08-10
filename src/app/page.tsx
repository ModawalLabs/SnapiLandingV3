import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ClosingCta } from "@/components/sections/closing-cta";
import { Editions } from "@/components/sections/editions";
import { Editorial } from "@/components/sections/editorial";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Maisons } from "@/components/sections/maisons";
import { Missions } from "@/components/sections/missions";
import { PullQuote } from "@/components/sections/pull-quote";
import { TheProblem } from "@/components/sections/the-problem";
import { WhatItIs } from "@/components/sections/what-it-is";

/**
 * The landing page.
 *
 * ## The order is an argument
 *
 *  1. **Hero** — the claim, and a conversation that answers itself, so the
 *     product is understood before it is explained. It is also a pinned scroll
 *     transition: the opening copy lifts away, the photographic band climbs up
 *     to become the composer's ground, and the tension copy resolves over it.
 *  2. **The problem** — the same tension copy, as an ordinary section. Renders
 *     **only** under `prefers-reduced-motion`, where the hero does not pin and
 *     the transition never happens. Exactly one of the two is ever visible.
 *  3. **What it is** — the plain-English answer, because "Found, not searched"
 *     is a promise and not a description.
 *  4. **How it works** — the mechanism, in four steps.
 *  5. **Pull quote** — the turn into the dark chapter, and the page's one piece
 *     of writing with no product in it.
 *  6. **Missions** — the differentiator, on near-black. Everything above is a
 *     better search box; this is the part a competitor cannot ship by adding a
 *     chat window.
 *  7. **Maisons** — coverage, for the reader who now believes it works and wants
 *     to know whether it covers what they buy.
 *  8. **Editorial** — The Edit as a magazine spread, carrying the editor's letter
 *     inside it. The page's only first-person voice, and the one place it argues
 *     rather than demonstrates.
 *  9. **Editions** — two photographic worlds; the off-ramp for someone who is
 *     not shopping for a Kelly.
 * 10. **Closing CTA** — the ask, over photography.
 *
 * ## Rhythm
 *
 * Light through step 4, dark for 5 and 6, light again through 8, then
 * photographic to the end. A long page with no inversion reads as flat however
 * good the typography is, and the eye needs to arrive somewhere rather than
 * merely continue.
 *
 * Maisons and Editorial are two light sections back to back, which would normally
 * be a flat stretch. Maisons closes on a full-bleed ink ribbon, so the break is
 * already there — and Editorial's own internal taper gives it enough shape not to
 * need help from its neighbours.
 *
 * **The tail is now three photographic bands with nothing between them.** Editions
 * is two dark full-bleed panels and the closing CTA is a third, where a light
 * section used to sit in between. It reads as one long dark stretch rather than as
 * two moments. If nothing goes back into that slot, the closing panel is the thing
 * to change — a lighter grade, or type on cream over a photographic band, would
 * give the page an ending instead of a fade-out.
 *
 * ## Three sections that used to be here
 *
 * A **price-intelligence** section sat between Missions and the letter. Removed
 * rather than relocated: the hero's conversation already shows landed prices, an
 * over-budget row and a "not yet" verdict, so it demonstrated a second time what
 * the page opens with. No loss.
 *
 * An **FAQ** and a **trust** section sat between Editions and the close, and those
 * two removals compound. Between them the page has lost every answer to the
 * questions a reader asks before believing an assistant that decides what they
 * buy: how Snapi makes money, what it costs, what happens to a photo they snap,
 * whether an over-budget result is hidden from them, whether it will ever tell
 * them to wait. The product still does all of it — the hero's conversation
 * demonstrates two of them in plain sight — but the page no longer says so
 * anywhere, and a reader who wants to check has nothing to read.
 *
 * That is a gap rather than a simplification. Worth restoring in some form before
 * launch, even as a short band above the closing CTA. The only upside is that the
 * three FAQ answers flagged `data-needs-sign-off` went with it, so nothing
 * commercially unapproved is on the page.
 *
 * ## Client boundaries
 *
 * Every section is a Server Component except the two that genuinely need the
 * client: the header (scroll state, drawer, focus trap) and the hero's
 * conversation (typewriter, input, the demo loop). `Reveal` is a client leaf, so
 * its Server Component parents stay on the server and only the wrapper ships.
 */
export default function Page() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="flex-1">
        <Hero />
        <TheProblem />
        <WhatItIs />
        <HowItWorks />
        <PullQuote />
        <Missions />
        <Maisons />
        <Editorial />
        <Editions />
        <ClosingCta />
      </main>

      <SiteFooter />
    </>
  );
}
