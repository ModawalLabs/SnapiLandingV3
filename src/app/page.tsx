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
 *  4. **Editions** — two photographic worlds. Placed here, directly after the
 *     description, because the *first* thing a reader wants after "what is it"
 *     is "which one is it for me". It is also the page's earliest off-ramp for
 *     someone who is not shopping for a Kelly, and an off-ramp is worthless at
 *     the bottom of a page they have already decided to leave.
 *  5. **How it works** — the mechanism, in four steps.
 *  6. **Pull quote** — the turn into the dark chapter, and the page's one piece
 *     of writing with no product in it.
 *  7. **Missions** — the differentiator, on near-black. Everything above is a
 *     better search box; this is the part a competitor cannot ship by adding a
 *     chat window.
 *  8. **Maisons** — coverage, for the reader who now believes it works and wants
 *     to know whether it covers what they buy.
 *  9. **Editorial** — The Edit as a magazine spread, carrying the editor's letter
 *     inside it. The page's only first-person voice, and the one place it argues
 *     rather than demonstrates.
 * 10. **Closing CTA** — the ask, over photography.
 *
 * ## Rhythm
 *
 * Moving Editions up fixed the page's worst structural problem rather than
 * trading it for another one, which is worth recording because the reverse was
 * the obvious risk.
 *
 * **What it fixed:** the tail used to be three photographic bands with nothing
 * between them — Editions' two dark full-bleed panels, then the closing CTA's
 * third — which read as one long dark stretch instead of two moments. The page now
 * ends Editorial (light, tapering) → Closing CTA (one dark photographic panel), so
 * the close lands as an arrival.
 *
 * **What it did not break:** Editions is dark, and it now sits between two light
 * sections instead of between two dark ones. That is a gain in both directions —
 * What it is → How it works was a long flat cream stretch, and Editions is exactly
 * the kind of full-bleed inversion that breaks one.
 *
 * So: light, dark inversion at 4, light through 5, dark for 6–7, light through 9,
 * one photographic close. A long page with no inversion reads as flat however good
 * the typography is, and the eye needs to arrive somewhere rather than merely
 * continue.
 *
 * Maisons and Editorial are still two light sections back to back. Maisons closes
 * on a full-bleed ink ribbon, so the break is already there — and Editorial's own
 * internal taper gives it enough shape not to need help from its neighbours.
 *
 * **The one cost, and it was paid rather than deferred:** Editions/Signature and
 * How it works both used `street-style-fur-coat`. Six sections apart that read as
 * two frames; adjacent it reads as one frame printed twice. How it works moved to
 * `poolside-resort` — see the note there, which is also a sharpness win. If those
 * two sections are ever separated again, that swap can stand: it is the better
 * image for the slot on its own merits.
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
        <Editions />
        <HowItWorks />
        <PullQuote />
        <Missions />
        <Maisons />
        <Editorial />
        <ClosingCta />
      </main>

      <SiteFooter />
    </>
  );
}
