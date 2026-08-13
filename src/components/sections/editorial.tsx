import { ArrowUpRight } from "lucide-react";

import { EditorsLetter } from "@/components/sections/editors-letter";
import { buttonVariants } from "@/components/ui/button";
import { MediaFrame } from "@/components/ui/media-frame";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeader } from "@/components/ui/section";
import { APP_URL } from "@/config/site";
import {
  EDITORIAL_INDEX,
  EDITORIAL_LEAD,
  EDITORIAL_MASTHEAD,
  EDITORIAL_PAIR,
  type EditorialFeature,
  type EditorialStory,
} from "@/content/editorial";
import { cn } from "@/lib/utils";

/**
 * Editorial — The Edit, as a magazine spread.
 *
 * ## The page tapers, and so does this
 *
 * Three movements from the platform's nine, chosen because they are the three that
 * establish *publication* rather than *content block*: one large picture with one
 * headline, a letter in the house's own voice, an offset pair of features, and then
 * an index of headlines with no pictures at all. Blocks get smaller and denser the
 * further down you read, exactly as a print magazine narrows from features to
 * columns to the back index.
 *
 * That taper is the whole difference between this and a "featured articles" grid. A
 * section whose blocks are all one size has no shape however carefully each is
 * built — which is why the index at the end is deliberately unglamorous.
 *
 * ## Three details that are conventions, not decoration
 *
 *  1. **The lead photograph is the smaller half.** Three columns of picture against
 *     six of type, with a full empty column between them. A lead photograph that
 *     fills the row leaves the headline nothing to do, and the headline is what
 *     opens an issue.
 *  2. **The lead's type hangs off the base of the photograph** (`lg:self-end`).
 *     Top-aligning both columns is what a CMS does; hanging the headline off the
 *     bottom edge is what a printed spread does.
 *  3. **The pair's offset is ~96px.** A 12px stagger looks like a bug. A 96px one
 *     looks like a decision. It only applies from `lg` — stacked on a phone it is
 *     just an unexplained gap between two cards.
 *
 * ## Framing
 *
 * The heading leads on craft and the subhead carries the personalisation, in that
 * order. The reverse was the temptation — "assembled for you" is the differentiator,
 * since any house can publish a magazine and none of them writes you a different
 * one — but leading with it makes the section an argument about an algorithm, and
 * the reader is meant to want to *read* these. The claim lands harder once the
 * headlines have already done their work.
 *
 * ## No bylines
 *
 * The platform's data carries an `author` per story and its index renders none of
 * them. Same here: one credit on the lead with none anywhere else reads as an
 * oversight rather than as emphasis, and the archive speaks in the publication's
 * voice.
 */
export function Editorial() {
  return (
    <Section id="editorial" aria-labelledby="editorial-heading">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            headingId="editorial-heading"
            eyebrow="The Edit"
            title="Considered writing on what to buy, what to keep, and what to leave behind."
            description="Every issue is assembled for one reader. Snapi builds yours from what you have saved, searched and asked it to watch — so the pieces in it are the ones you were already deciding about."
          />
        </Reveal>

        {/* ── Masthead strip ─────────────────────────────────────────────── */}
        <Reveal delay={0.08}>
          <div className="mt-16 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-border pt-6">
            <p className="text-eyebrow text-content-subtle">{EDITORIAL_MASTHEAD.issue}</p>
            <p className="text-[11px] tracking-wide text-content-subtle">
              {EDITORIAL_MASTHEAD.archive}
            </p>
          </div>
        </Reveal>

        {/* ── 1. Lead ────────────────────────────────────────────────────── */}
        <Reveal delay={0.12}>
          <div className="mt-10 grid gap-6 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-3">
              <MediaFrame
                src={EDITORIAL_LEAD.image}
                alt={EDITORIAL_LEAD.alt}
                focus={EDITORIAL_LEAD.focus}
                // No scrim: the caption sits *below* the frame, not on it. A scrim
                // with nothing over it only makes a photograph dark for no reason.
                scrim={false}
                sizes="(min-width: 1024px) 24vw, 100vw"
                // Portrait only at `lg`, where the column is a quarter of the page.
                // Below that the frame is full width, and a full-bleed portrait
                // would push the rest of the spread below the fold.
                className="aspect-[4/3] rounded-lg shadow-premium sm:aspect-[16/10] lg:aspect-[3/4]"
              />
            </div>

            {/* `col-start-5` leaves a whole empty column between picture and type.
                A gap reads as spacing; a skipped column reads as a margin. It stops
                at 10 rather than running to the edge, so the block ends on air. */}
            <div className="group lg:col-span-6 lg:col-start-5 lg:self-end lg:pb-2">
              <Meta story={EDITORIAL_LEAD} />

              <h3 className="mt-4 font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.06] font-normal tracking-[-0.01em] text-balance text-content">
                {EDITORIAL_LEAD.title}
              </h3>

              <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-content-muted">
                {EDITORIAL_LEAD.standfirst}
              </p>
            </div>
          </div>
        </Reveal>

        <Rule />

        {/* ── 2. The letter ──────────────────────────────────────────────── */}
        <Reveal>
          <EditorsLetter />
        </Reveal>

        <Rule />

        {/* ── 3. Pair, offset ────────────────────────────────────────────── */}
        <div className="grid gap-12 lg:grid-cols-12">
          {EDITORIAL_PAIR.map((story, index) => (
            <Reveal
              key={story.slug}
              delay={index * 0.08}
              className={cn("lg:col-span-5", index === 1 && "lg:col-start-8 lg:mt-24")}
            >
              <Feature story={story} />
            </Reveal>
          ))}
        </div>

        <Rule />

        {/* ── 4. Index — the taper's narrowest point ─────────────────────── */}
        <Reveal>
          {/* Was "Also in this issue" / "Shorter pieces, filed the same week".
              Both had to go with the rewrite: the entries below are prompts now,
              not pieces, and "shorter" was calibrated against the reading times
              that no longer exist. This pair says where the block came from
              instead, which is the claim the section's subhead already makes. */}
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pb-6">
            <h3 className="text-eyebrow text-content-subtle">From your searches</h3>
            <p className="text-[11px] tracking-wide text-content-subtle">
              The briefs this issue was built from
            </p>
          </div>

          <ul className="grid border-t border-border sm:grid-cols-2">
            {EDITORIAL_INDEX.map((story, index) => (
              <li
                key={story.slug}
                className={cn(
                  "border-b border-border py-6",
                  // The vertical rule belongs between the columns, not after the
                  // last one — and only where there *are* two columns.
                  index % 2 === 0 && "sm:border-r sm:pr-8",
                  index % 2 === 1 && "sm:pl-8",
                )}
              >
                <Meta story={story} />

                <h4 className="mt-3 font-display text-[1.375rem] leading-snug font-normal text-balance text-content">
                  {story.title}
                </h4>

                {/* No `line-clamp-2` any more. It guarded against three-line decks
                    back when these were full editorial sentences; the constraint
                    lines are contractually under six words, so the clamp could
                    never fire and was only imposing `-webkit-box` and
                    `overflow: hidden` on a single-line paragraph. */}
                <p className="mt-2 text-[13px] leading-relaxed text-content-muted">
                  {story.standfirst}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* ── Colophon ───────────────────────────────────────────────────── */}
        <Reveal>
          <div className="mt-14 flex flex-col items-center gap-8 border-t border-border pt-12">
            {/* Set in the display serif because it is the masthead's voice rather
                than another heading. */}
            <p className="font-display text-lg leading-none font-normal tracking-[0.01em] text-content-muted sm:text-xl">
              {EDITORIAL_MASTHEAD.colophon}
            </p>

            {/* The one link out of the chapter. The platform's own colophon is
                deliberately inert — a live destination at the end of an issue
                invites one more click at the moment the reader is meant to be
                finished — but this is a landing page, and the whole point of
                showing an archive is that the reader can go and have their own. */}
            <a
              href={APP_URL}
              className={cn(buttonVariants({ variant: "secondary", size: "md" }))}
            >
              Read your Edit
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/**
 * The category, above every headline.
 *
 * This was `Knitwear · 3 min read` until the reading times came off. Two things
 * that went with them and should not quietly come back:
 *
 *  - **The flex row.** With one child there is nothing to lay out, so this is a
 *    plain `<p>`. A `flex items-center gap-2.5` wrapper around a single span is the
 *    kind of leftover that makes the next person look for the missing sibling.
 *  - **`tabular`.** Lining figures existed so a column of these had a straight
 *    edge where `3 min` sat next to `11 min`. There are no digits here now, and
 *    tabular spacing on letters only widens them.
 */
function Meta({ story }: { story: EditorialStory }) {
  return <p className="text-eyebrow text-gold">{story.category}</p>;
}

/** One of the offset pair: a 4:5 frame with its caption below. */
function Feature({ story }: { story: EditorialFeature }) {
  return (
    <article className="group">
      <MediaFrame
        src={story.image}
        alt={story.alt}
        focus={story.focus}
        scrim={false}
        sizes="(min-width: 1024px) 40vw, 100vw"
        className="aspect-[4/5] rounded-lg shadow-premium"
      />

      <div className="mt-6">
        <Meta story={story} />

        <h3 className="mt-3 font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight font-normal tracking-[-0.005em] text-balance text-content">
          {story.title}
        </h3>

        <p className="mt-3 max-w-[42ch] text-[14px] leading-relaxed text-content-muted">
          {story.standfirst}
        </p>
      </div>
    </article>
  );
}

/**
 * The rule between movements.
 *
 * One spacing value for every break, so the chapter has a single vertical rhythm no
 * matter how much the blocks either side of it differ. Varying it per movement is
 * how a layout stops feeling composed.
 */
function Rule() {
  return <div className="rule-fade my-16 h-px sm:my-20" aria-hidden="true" />;
}
