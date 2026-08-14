import Image from "next/image";

import allRounderWorld from "@/assets/hero/hero1.1.jpg";
import signatureWorld from "@/assets/edit/street-style-fur-coat.jpg";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { APP_URL } from "@/config/site";
import type { ImageSource } from "@/types/media";
import { cn } from "@/lib/utils";

/**
 * The two editions, as two photographic worlds.
 *
 * ## Why this was rebuilt
 *
 * The first version was two bordered cards with checkmark lists — which is to
 * say, a pricing table. That shape is wrong here twice over. It implies the
 * editions differ by *feature*, when they run the same engine and differ only in
 * judgement about what deserves to be shown; and a pricing table is the single
 * most generic object in software marketing, sitting in the middle of a page
 * whose whole argument is that Snapi is not generic.
 *
 * A flavour changes the product's **register**. Signature is a boutique —
 * maisons, vetted resale, a curated few. All Rounder is a marketplace that
 * counts sellers rather than curating them. That is a difference you should
 * *feel* in two seconds from the photography, before reading a word, which is
 * what two full-bleed worlds do and what two lists of ticks never will.
 *
 * ## The colour is doing real work
 *
 * In the product the editions are literally a colour swap: All Rounder
 * re-points every gold token at azure. So the accents here are the app's own
 * tokens, not decorative choices — this section is a preview of the edition
 * rather than a description of one.
 *
 * Both panels carry `.on-photo`, which pins gold *and* azure to their bright
 * variants. The page's tuned-for-cream values are near-black over a scrimmed
 * photograph; without the scope the All Rounder side would show a dark smudge
 * where its accent should be.
 *
 * ## Where this section sits
 *
 * Directly after What it is, not at the bottom of the page. Two reasons, and the
 * second is the one that matters: a reader who has just been told what Snapi is
 * asks "which one is for me" before they ask "how does it work", and an off-ramp
 * for the reader who is not shopping for a Kelly is worth nothing once they have
 * already left.
 *
 * It also carries the page's first inversion. Everything above is cream, and two
 * full-bleed photographic worlds are a harder break than any heading.
 *
 * ## Photography note
 *
 * The Signature plate has this frame to itself now. It used to be shared with How
 * it works — acceptable at six sections' distance, but the move made them
 * consecutive and they read as one photograph printed twice, so How it works took
 * a different image. Still the first place a commissioned shot should go when real
 * photography lands.
 *
 * Both sources here are 1500px wide and there is no higher-resolution master for
 * either. On a wide screen this panel renders around 1050 CSS px, so at 2× device
 * pixel ratio it is upscaled — visible as softness in the fabric, not as
 * artefacts. No encode setting fixes that; it needs larger files.
 */

interface Edition {
  name: string;
  tagline: string;
  body: string;
  points: readonly string[];
  image: ImageSource;
  focus: string;
  alt: string;
  /** Whether the edition's accent is the warm one. Drives the scrim as well as the type. */
  accent: "gold" | "azure";
  badge: string | null;
}

const EDITIONS: Edition[] = [
  {
    name: "Signature",
    // Was "Curated luxury, tailored to you." — the flattest line on the page, two
    // marketing words in five, and the only tagline that told the reader nothing
    // they could picture. It also failed to contrast with All Rounder's "Everything
    // worth having", which is the one job a pair of taglines has. "The few things"
    // against "Everything" is the whole difference between the editions in three
    // words.
    tagline: "The few things worth keeping.",
    body: "Every maison and vetted reseller, read with judgement. Provenance, condition, and the resale floor matter as much as the price.",
    points: [
      "Authorised boutiques and vetted resale",
      "Investment pieces tracked against the floor",
      "The Edit — curated weekly writing",
    ],
    image: signatureWorld,
    focus: "object-[62%_42%]",
    alt: "A woman in a silver fur coat seated on stone steps beside a black top-handle bag.",
    accent: "gold",
    badge: "Default edition",
  },
  {
    name: "All Rounder",
    tagline: "Everything worth having, at every price.",
    // Both the body and the second point used to promise that delivery dates were
    // compared. Rewritten around the landed price instead — which is the claim the
    // rest of the page already makes and demonstrates in the hero, rather than a
    // second capability asserted only here.
    body: "The same concierge, aimed wider. Thousands of sellers at once, judged on what you actually pay rather than the sticker, and narrowed to what is worth having.",
    points: [
      "Thousands of sellers, checked in one pass",
      "Every landed price compared, not just the sticker",
      "Trending Now — what is moving today",
    ],
    image: allRounderWorld,
    // The subject sits centre-right, roughly 48–85% across a 3:2 frame, and this
    // panel crops to about two thirds of that width on a wide screen and under
    // half of it on a phone. A centre crop clips her; 58% keeps her whole at both.
    // Vertical is inert — the frame is always cropped by width here, never by
    // height — and is stated only for symmetry with the other edition.
    focus: "object-[58%_50%]",
    alt: "A woman in a cobalt puffer jacket and rust knit sweater on a frozen lakeshore in winter sun.",
    accent: "azure",
    badge: null,
  },
];

/**
 * Per-accent classes, written out rather than interpolated.
 *
 * Tailwind scans source text statically, so `text-${accent}` produces no class
 * at all and the panel silently renders unstyled — a failure that only shows up
 * in the browser, never in the build.
 *
 * ## The two washes are not the same strength, on purpose
 *
 * Both run bottom-heavy, because the copy is bottom-aligned. But they sit on very
 * different photographs, and a wash is tuned to its image rather than to its
 * hue.
 *
 * Signature's street-style frame is dark to begin with. All Rounder's lakeshore
 * is **high-key** — snow, ice and open sky — so at Signature's alpha the edition
 * name at the top of the copy block landed on bright ice at under 2:1, which is
 * illegible. Its two upper stops are therefore heavier.
 *
 * If either image is swapped, re-check the *eyebrow* first: it is the smallest
 * accent-coloured text on the panel, it sits at the top of the copy block where
 * the wash is thinnest, and it fails long before the body copy does.
 */
const ACCENT = {
  gold: {
    text: "text-gold",
    rule: "bg-gold-border",
    badge: "bg-gold-solid text-gold-content",
    // Warm ramp for the warm edition. The tint is faint — it colours the shadow,
    // it does not tint the photograph, which would shift how the garments read.
    wash: "bg-[linear-gradient(to_top,oklch(12%_0.02_70/0.92),oklch(12%_0.02_70/0.55)_45%,oklch(12%_0.015_70/0.35))]",
  },
  azure: {
    text: "text-azure",
    rule: "bg-azure-border",
    badge: "bg-azure-solid text-azure-content",
    // 0.72 and 0.48 at the upper stops against Signature's 0.55 and 0.35 — see
    // the note above. The bottom stop is unchanged: both images are mid-tone
    // there and the body copy was never at risk.
    wash: "bg-[linear-gradient(to_top,oklch(12%_0.03_260/0.92),oklch(12%_0.03_260/0.72)_45%,oklch(12%_0.02_260/0.48))]",
  },
} as const;

export function Editions() {
  return (
    <section id="editions" aria-labelledby="editions-heading" className="scroll-mt-24">
      <div className="container-page pt-24 pb-16 text-center sm:pt-32 lg:pt-40">
        <Reveal>
          <p className="text-eyebrow text-gold">Two editions</p>

          <h2
            id="editions-heading"
            className="mx-auto mt-4 max-w-3xl font-display text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.08] font-normal tracking-[-0.005em] text-content"
          >
            One concierge. Two registers.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-content-muted">
            Switch whenever you like. The missions, the list, and everything Snapi has learned
            about you come with you.
          </p>
        </Reveal>
      </div>

      {/* Full-bleed and edge to edge. A container here would put a cream gutter
          between the two worlds and turn them back into cards. */}
      <div className="grid lg:grid-cols-2">
        {EDITIONS.map((edition, index) => (
          <EditionWorld key={edition.name} edition={edition} delay={index * 0.08} />
        ))}
      </div>
    </section>
  );
}

function EditionWorld({ edition, delay }: { edition: Edition; delay: number }) {
  const accent = ACCENT[edition.accent];

  return (
    <Reveal variant="image" delay={delay} className="block">
      <article className="group relative isolate min-h-[34rem] overflow-hidden sm:min-h-[40rem] lg:min-h-[44rem]">
        <Image
          src={edition.image}
          alt={edition.alt}
          fill
          // Half the viewport above `lg`, all of it below — declaring 100vw
          // everywhere would download a full-width file for a half-width slot on
          // every desktop.
          sizes="(min-width: 1024px) 50vw, 100vw"
          placeholder="blur"
          className={cn(
            "object-cover",
            edition.focus,
            "transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]",
          )}
        />

        <div aria-hidden="true" className={cn("absolute inset-0", accent.wash)} />

        <div className="on-photo relative flex min-h-[34rem] flex-col justify-end p-8 sm:min-h-[40rem] sm:p-12 lg:min-h-[44rem] lg:p-14">
          <div className="flex items-center gap-3">
            <p className={cn("text-eyebrow", accent.text)}>{edition.name}</p>

            {edition.badge ? (
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.1em] uppercase",
                  accent.badge,
                )}
              >
                {edition.badge}
              </span>
            ) : null}
          </div>

          <h3 className="mt-6 max-w-md font-display text-[clamp(1.875rem,3.4vw,2.75rem)] leading-[1.12] font-normal text-white">
            {edition.tagline}
          </h3>

          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/70">{edition.body}</p>

          <div className={cn("mt-9 h-px w-full max-w-md", accent.rule)} role="presentation" />

          <ul className="mt-7 flex max-w-md flex-col gap-3">
            {edition.points.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 text-[14px] leading-relaxed text-white/85"
              >
                <span
                  className={cn("mt-2 size-1 shrink-0 rounded-full", accent.text, "bg-current")}
                  aria-hidden="true"
                />
                {point}
              </li>
            ))}
          </ul>

          {/* `onPhoto` on both, not a filled accent on one.
           *
           * The gold fill belongs to the primary action in a view and the page
           * has already spent it twice. Giving it to only one of two adjacent
           * editions would also read as an upsell that the copy above has just
           * denied. */}
          <a
            href={APP_URL}
            className={cn(buttonVariants({ variant: "onPhoto", size: "md" }), "mt-10 self-start")}
          >
            Open in {edition.name}
          </a>
        </div>
      </article>
    </Reveal>
  );
}
