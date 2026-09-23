import Image from "next/image";

import boutiqueWindow from "@/assets/hero/hero2.jpg";
import { Reveal } from "@/components/ui/reveal";

/**
 * A full-bleed pull-quote plate.
 *
 * Two jobs, both structural rather than informational.
 *
 * First, **rhythm**. It is the page's turn into the dark chapter: cream up to
 * here, then this plate, then Missions on near-black, then back into light. A
 * long light page with no inversion reads as flat however good the typography
 * is, and the eye needs somewhere to rest before the section that matters most.
 *
 * Second, **voice**. Everything else on the page is Snapi explaining itself. One
 * line of writing that is simply *about clothes*, with no product in it at all,
 * is what separates a house from a startup — and this one is lifted verbatim
 * from the platform's own editorial, so the two properties sound like the same
 * writer.
 *
 * The image is a boutique window at night: dark, warm, and with the subject
 * hard-centred, so heavy type can sit over it without hunting for a clear
 * region. It carries no `alt` because the quote is the content; describing the
 * mannequins would only make a screen reader read past the sentence to reach it.
 */
export function PullQuote() {
  return (
    <section aria-label="On buying well" className="relative isolate">
      <Reveal variant="image" className="block">
        <div className="relative min-h-[26rem] w-full overflow-hidden sm:min-h-[32rem] lg:min-h-[38rem]">
          <Image
            src={boutiqueWindow}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            placeholder="blur"
            className="object-cover object-center"
          />

          {/* Heavier than it looks necessary in isolation, and that is correct:
              the source is a lit shop window with specular highlights on the
              glass, and white display type over an unscrimmed highlight is
              unreadable at exactly the moment someone stops to read it. */}
          <div aria-hidden="true" className="absolute inset-0 bg-black/60" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40"
          />

          <figure className="on-photo absolute inset-0 flex items-center">
            <div className="container-page">
              <blockquote className="mx-auto max-w-4xl text-center">
                {/* The opening mark is set as decoration rather than as part of
                    the sentence: it is oversized and half-transparent, so leaving
                    it in the text flow would push the first line off-centre. */}
                <span
                  aria-hidden="true"
                  className="block font-display text-[5rem] leading-[0.5] text-gold/40 select-none"
                >
                  “
                </span>

                <p className="mt-8 font-display text-[clamp(1.75rem,4.6vw,3.5rem)] leading-[1.16] font-normal tracking-[-0.005em] text-white">
                  The best thing you can say about a coat is that you eventually stopped
                  <br /> noticing it.
                </p>
              </blockquote>

              <figcaption className="mt-10 text-center">
                <span className="text-eyebrow text-gold">From The Edit</span>
                <span className="mt-3 block text-[13px] text-white/60">
                  Curated weekly on Snapi
                </span>
              </figcaption>
            </div>
          </figure>
        </div>
      </Reveal>
    </section>
  );
}
