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
            An assistant, not a search box. Describe what you are after in a sentence and Snapi
            reads the listings the way a good buyer would —{" "}
            <span className="text-content-subtle">
              who genuinely has stock, what the piece went for last month, which sellers ship
              without a story, and whether the version in front of you is the one the review was
              written about.
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
