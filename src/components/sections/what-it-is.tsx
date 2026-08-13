import { Camera, Mic, PenLine, type LucideIcon } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";

/**
 * The plain-English answer to "what is this".
 *
 * It sits immediately under the hero because a visitor who has just read a
 * two-word claim in a serif does not yet know what the product *does*. The
 * opening line is set at display size and given a whole band of its own: on a
 * luxury page the statement of intent is the one place a sentence is allowed to
 * behave like an image.
 *
 * The three modalities follow as columns rather than cards. Cards would imply
 * three separate features; these are three doors into the same one, and the
 * shared hairline is what says so.
 *
 * ## The opening line is deliberately shorter than it reads
 *
 * At display size every word costs a line, and a line costs the whole band's
 * height. The four buyer's-checks after the em dash are the substance and all four
 * stay; the trimming came out of the connective tissue instead — "describe what you
 * are after in a sentence" → "describe what you want", and "whether the version in
 * front of you is the one the review was written about" → "whether it is the
 * version the review was about", which alone is fourteen words down to eight.
 *
 * Two things to preserve if this is edited again:
 *
 *  - **The tone split at the em dash.** The claim is `text-content`, the checks are
 *    `text-content-subtle`. That is what lets one sentence work as both a headline
 *    and a list without becoming two elements.
 *  - **Four checks, not three.** Each is a distinct capability the product actually
 *    has, and "sellers who ship without a story" is the one a reader remembers.
 *
 * ## Known duplication
 *
 * This paragraph is a paraphrase of the editor's letter's second paragraph in
 * `EDITORS_LETTER`, and it opens with that letter's title verbatim. So the page
 * makes the same argument twice in nearly the same words — here at section 3 and
 * inside Editorial at section 9.
 *
 * The letter is locked: it is verbatim platform copy and must stay that way. If the
 * repetition is to be resolved, it gets resolved *here* — most likely by keeping
 * the "an assistant, not a search box" claim as this section's headline and letting
 * the four checks belong to the letter alone, since the letter is the place the
 * page is allowed to speak in the first person.
 */

const MODALITIES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Camera,
    title: "Snap it",
    body: "Point your camera at anything — a passer-by’s coat, a shop window, a page torn from a magazine. Snapi identifies the piece and finds it, or finds the closest thing that exists.",
  },
  {
    icon: Mic,
    title: "Say it",
    body: "Talk to it the way you would talk to a good sales associate. Half a sentence and a budget is enough; it asks for the rest only when the answer would change.",
  },
  {
    icon: PenLine,
    title: "Describe it",
    body: "“A winter coat that isn’t black, mid-calf, no logos, under $2,800.” Snapi reads it as a brief rather than a keyword string, and every result explains why it qualified.",
  },
];

export function WhatItIs() {
  return (
    <Section aria-labelledby="what-it-is-heading">
      <div className="container-page">
        <Reveal>
          <p className="text-eyebrow text-gold">What Snapi is</p>

          <h2
            id="what-it-is-heading"
            className="mt-6 max-w-4xl font-display text-[clamp(1.75rem,3.9vw,3.25rem)] leading-[1.18] font-normal tracking-[-0.005em] text-content"
          >
            An assistant, not a search box. Describe what you want and Snapi reads the listings
            like a good buyer —{" "}
            <span className="text-content-subtle">
              who really has stock, what the piece sold for last month, which sellers ship without a
              story, and whether it is the version the review was about.
            </span>
          </h2>
        </Reveal>

        <div className="mt-20 h-px rule-fade" role="presentation" />

        <ul className="grid gap-x-12 gap-y-14 pt-16 md:grid-cols-3">
          {MODALITIES.map((item, index) => (
            <Reveal as="li" key={item.title} delay={index * 0.08}>
              <item.icon className="size-6 text-gold" aria-hidden="true" strokeWidth={1.5} />

              <h3 className="mt-6 font-display text-[1.75rem] leading-tight font-normal text-content">
                {item.title}
              </h3>

              <p className="mt-4 text-[15px] leading-relaxed text-content-muted">{item.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
