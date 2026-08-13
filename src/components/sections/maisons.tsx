import { InfiniteRibbon } from "@/components/ui/infinite-ribbon";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeader } from "@/components/ui/section";
import { cn } from "@/lib/utils";

/**
 * Designer worlds — the houses Snapi aggregates.
 *
 * ## Why these are set in type, not shown as logos
 *
 * A wall of real brand marks would be the obvious build and it is the wrong one
 * twice over. Legally, a maison's logotype is a trademark whose use implies an
 * endorsement none of these houses has given — and the platform's own asset
 * notes are explicit that marks must come from official brand kits rather than
 * be scraped. Visually, a row of mismatched vector logos at mismatched optical
 * weights is the single most common way a premium page cheapens itself; a
 * uniform setting in the display serif reads as a directory, which is what this
 * actually is.
 *
 * The platform ships three placeholder PNGs for this and reuses one file across
 * several houses. Shipping that on a public page would misattribute a mark, so
 * it stays in the app until real assets land.
 *
 * The grid is built from hairlines rather than cards. Every cell shares its
 * edges with its neighbours, so the whole block reads as one ruled table — the
 * way a stockist list is set in print — instead of forty floating boxes.
 */

const MAISONS = [
  "Hermès",
  "Chanel",
  "Loro Piana",
  "Bottega Veneta",
  "Saint Laurent",
  "Prada",
  "Gucci",
  "Cartier",
  "The Row",
  "Brunello Cucinelli",
  "Celine",
  "Dior",
  "Burberry",
  "Loewe",
  "Jacquemus",
  "Miu Miu",
  "Van Cleef & Arpels",
  "Toteme",
  "Khaite",
  "Patek Philippe",
] as const;

/**
 * There is deliberately no stats row here.
 *
 * A commented-out `STATS` array sat at this spot — "400+ boutiques", "40+ maisons",
 * "12 vetted resale partners" — and it has been deleted rather than left dormant,
 * because commented-out code reads as work in progress when it is actually a
 * decision. The decision: those are three specific, checkable commercial claims
 * that nobody has signed off, and a counted number on a marketing page is the first
 * thing a sceptical reader tests. The list of twenty houses below makes the coverage
 * argument without asserting a figure.
 *
 * Note that the hero's demo does state comparable numbers in its `scanned` strings
 * ("412 boutiques · 12 resale partners"). Those are framed as what one search swept
 * rather than as a standing claim about the business, which is a materially weaker
 * assertion — but if the figures ever need sign-off, that is the other place to look.
 */

export function Maisons() {
  // `padded={false}` because the ribbon below is full-bleed and must sit flush
  // against the section's foot; the inner div owns the vertical rhythm instead.
  // No `className="scroll-mt-24"` here — `Section` applies that unconditionally,
  // and passing it again was a duplicate that `cn` silently collapsed.
  return (
    <Section id="maisons" aria-labelledby="maisons-heading" padded={false}>
      <div className="py-24 sm:py-32 lg:py-40">
        <div className="container-page">
          <Reveal>
            <SectionHeader
              headingId="maisons-heading"
              align="center"
              eyebrow="Maisons on Snapi"
              title="Browse by house, not by search engine."
              description="Snapi aggregates authorised boutiques and vetted resale for each maison, so one question covers the official stock and the secondary market at the same time."
            />
          </Reveal>

          <Reveal delay={0.08}>
            {/* Negative margins on the container plus a full border produce a
                single continuous rule between cells rather than doubled 2px
                lines where two bordered cells meet. */}
            <ul className="mt-20 grid grid-cols-2 border-t border-l border-border sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {MAISONS.map((maison) => (
                <li key={maison} className="border-r border-b border-border">
                  <span
                    className={cn(
                      "flex h-24 items-center justify-center px-4 text-center",
                      "font-display text-[1.0625rem] leading-tight font-normal text-content-muted",
                      "transition-colors duration-300 hover:bg-gold-subtle hover:text-gold sm:text-[1.1875rem]",
                    )}
                  >
                    {maison}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* <Reveal delay={0.16}>
            <dl className="mt-20 grid gap-10 border-t border-border pt-14 sm:grid-cols-3">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="tabular block font-display text-[clamp(2.5rem,5vw,3.75rem)] leading-none font-normal text-foil">
                      {stat.value}
                    </span>
                    <span className="mt-4 block text-[13px] text-content-muted">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal> */}
        </div>
      </div>

      {/* A single unrotated strip, closing the section.
       *
       * Unrotated on purpose: the crossed pair in the hero is the flourish, and
       * repeating it here would spend the same trick twice. One flat rule of
       * moving type reads as a masthead instead. */}
      <InfiniteRibbon
        tone="ink"
        duration={64}
        repeat={5}
        className="text-[11px] font-semibold tracking-[0.2em] uppercase sm:text-xs"
      >
        {/* Four phrases, down from five. "No sponsored results" was removed as a
            claim, not for length — see the note in `closing-cta.tsx`. Four is
            still inside the working range for a strip this wide; below about
            three the loop repeats visibly within one screen. */}
        Authorised boutiques ✦ Vetted resale ✦ Real stock ✦ Landed prices ✦{" "}
      </InfiniteRibbon>
    </Section>
  );
}
