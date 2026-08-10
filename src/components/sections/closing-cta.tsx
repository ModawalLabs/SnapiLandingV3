import Image from "next/image";

import closingImage from "@/assets/hero/hero3.jpg";
import { buttonVariants } from "@/components/ui/button";
import { APP_URL } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * The closing panel.
 *
 * Full-bleed photography with the ask over it — the shape every luxury site ends
 * on, because after a long scroll the reader is done reading and a final band of
 * body copy on cream simply gets skipped.
 *
 * ## Everything here is pinned to light values
 *
 * The panel carries `.on-photo`, the type is white and white-alpha, and the
 * button uses the `onPhoto` variant rather than `secondary`. Theme tokens inside
 * this block would be a bug even though the site is light-only: `text-content`
 * is a near-black tuned for cream, and over a scrimmed photograph it disappears
 * completely. The rule is about the *ground*, not the theme — anything sitting
 * on a photograph takes its colours from the photograph.
 *
 * The image is warm and lit from the left, so the scrim runs left-heavy rather
 * than bottom-up: a bottom-weighted `.media-scrim` here would darken the table
 * the bag is standing on and leave the headline sitting over the brightest part
 * of the frame.
 */
export function ClosingCta() {
  return (
    <section aria-labelledby="closing-heading" className="relative isolate">
      <div className="relative min-h-[32rem] w-full overflow-hidden sm:min-h-[38rem] lg:min-h-[44rem]">
        <Image
          src={closingImage}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          placeholder="blur"
          className="object-cover object-[60%_50%]"
        />

        {/* Two layers rather than one. The horizontal ramp carries the type; the
            faint overall wash keeps the right-hand side from blowing out against
            the cream section above it. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-black/15" />

        <div className="on-photo relative flex min-h-[32rem] items-center sm:min-h-[38rem] lg:min-h-[44rem]">
          <div className="container-page py-20">
            <div className="max-w-2xl">
              <p className="text-eyebrow text-gold">Ask it one thing</p>

              <h2
                id="closing-heading"
                className="mt-6 font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.05] font-normal tracking-[-0.008em] text-white"
              >
                The piece you have been describing to people already exists.
              </h2>

              <p className="mt-7 max-w-lg text-[1.0625rem] leading-relaxed text-white/75">
                Snapi finds it, prices it honestly, and waits with you until it is worth buying.
                Open it and describe one thing you have been looking for.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href={APP_URL}
                  className={cn(buttonVariants({ variant: "gold", size: "lg" }))}
                >
                  Open Snapi
                </a>

                <a
                  href="#top"
                  className={cn(buttonVariants({ variant: "onPhoto", size: "lg" }))}
                >
                  Back to the top
                </a>
              </div>

              {/* "Nothing sponsored, ever" was removed from the end of this line.
                  It was the page's strongest trust claim and also a commitment
                  about how the business makes money, which is not a thing a
                  landing page should assert on the business's behalf. Every other
                  claim on this page describes behaviour a reader can check. */}
              <p className="mt-8 text-xs text-white/55">No card. No sign-up wall.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
