import Image from "next/image";

import editorialImage from "@/assets/edit/poolside-resort.jpg";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeader } from "@/components/ui/section";

/**
 * The four steps, as a numbered editorial list beside a photograph.
 *
 * Numbers in the display serif rather than in gold circles. A numbered badge is
 * the house style of every SaaS marketing page in existence, and the point of
 * this design is to look like none of them; a hairline-separated list with
 * oversized figures is how a print magazine sets a sequence.
 *
 * ## The heading counts what the reader does, not what the list contains
 *
 * It read "Four steps, and you only do the first one" while step 04 was Snapi
 * telling you when to buy. Once ordering took that slot the sentence was simply
 * false — the reader now does the first *and* the last — and a heading that
 * contradicts the list directly beneath it is worse than a duller one.
 *
 * "Snapi does the middle two" keeps the same promise and survives the change: the
 * shape of the argument is that the reader books the job and signs it off, and
 * everything expensive in between is handled. If a fifth step is ever added, this
 * heading has to be re-counted with it.
 *
 * The photograph is sticky on wide screens, so the reader's eye has a fixed
 * anchor while the steps move past it. Below `lg` it sits above the list — a
 * sticky element inside a short column just jitters.
 *
 * ## The photograph, and why it is this one
 *
 * This slot used to hold `street-style-fur-coat`, which Editions/Signature also
 * uses. That was fine while six sections sat between them; once Editions moved up
 * to follow What it is, the two became consecutive and read as one frame printed
 * twice rather than as two photographs.
 *
 * `poolside-resort` replaces it, and the swap pays three ways:
 *
 *  - **Repetition.** Its other use is a 23vw Missions tile three sections further
 *    down, heavily scrimmed and cropped differently. A large unscrimmed portrait
 *    and a small scrimmed tile do not twin the way two large panels do.
 *  - **Sharpness.** The box is portrait (4/5, then 3/4). The fur-coat frame is
 *    landscape 1600×1066, so cropping it to 3/4 left roughly 800×1066 of usable
 *    pixels against the ~1300×1730 this slot wants at 2× — a 1.6× upscale, visible
 *    as softness in the fabric. `poolside-resort` is natively 1200×1800 and lands
 *    within a rounding error of the requirement.
 *  - **Meaning.** Two people doing nothing while the work happens elsewhere is the
 *    literal argument of the heading above it.
 */

const STEPS = [
  {
    title: "You ask",
    body: "A photo, a voice note, a link, or a sentence. Snapi turns it into a brief: the piece, the constraints you stated, and the ones you implied.",
  },
  {
    title: "It reads the market",
    body: "Authorised boutiques, department stores, and vetted resale — checked for real stock in your size, not a listing that has been dead since spring.",
  },
  {
    // Absorbed the old step 04. "It tells you when to buy" was its own step until
    // ordering took the fourth slot, and it is the page's most credible claim —
    // an assistant that will tell you *not* to buy is the thing an affiliate feed
    // structurally cannot say. It belongs beside the price comparison anyway: the
    // timing verdict is an output of the price history, not a separate stage.
    title: "It compares, and tells you when",
    body: "Landed cost, not the sticker: duties, shipping, seller history, and what the same reference actually closed at recently. Anything over your ceiling is flagged, never hidden — and if the answer is not yet, it says so and keeps the search open.",
  },
  {
    title: "You place the order",
    body: "Snapi hands you to the seller it recommends — the authorised boutique, or the vetted reseller it has already checked — at the price it quoted you. The last call is yours, and it is the only part of this worth doing yourself.",
  },
] as const;

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="bg-surface-sunken/40"
    >
      <div className="container-page">
        <Reveal>
          <SectionHeader
            headingId="how-it-works-heading"
            eyebrow="How it works"
            title="Four steps. Snapi does the middle two."
            description="You ask, and you decide. Everything in between is Snapi’s — the sweeping, the cross-checking, the price history you would dig up yourself if you had the afternoon and the patience."
          />
        </Reveal>

        <div className="mt-20 grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <Reveal className="order-2 lg:order-1">
            <ol className="border-t border-border">
              {STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="grid grid-cols-[3rem_1fr] gap-x-6 border-b border-border py-8 sm:grid-cols-[4.5rem_1fr]"
                >
                  {/* Tabular figures so the column of numbers is a straight edge
                      rather than a ragged one. */}
                  <span
                    className="tabular font-display text-[2.25rem] leading-none font-normal text-gold sm:text-[3rem]"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h3 className="font-display text-[1.5rem] leading-tight font-normal text-content">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-content-muted">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-28">
              {/* Not a MediaFrame: nothing sits on this image, so it needs no
                  scrim, and a scrim with no type on it just makes a photograph
                  dark for no reason. */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl shadow-premium-lg sm:aspect-[3/4]">
                <Image
                  src={editorialImage}
                  alt="Two guests in white linen resting on striped daybeds under palm shadow at a resort poolside."
                  fill
                  sizes="(min-width: 1024px) 45vw, 92vw"
                  placeholder="blur"
                  // Slightly above centre. The frame is 1200×1800 and this box
                  // crops it by height at both breakpoints, so the only question
                  // is which end to sacrifice: 45% keeps the seated pair whole and
                  // spends the loss on empty stone at the foot.
                  className="object-cover object-[50%_45%]"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-black/10 ring-inset"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
