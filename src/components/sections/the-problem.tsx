import {
  PROBLEM_CLOSER,
  PROBLEM_EYEBROW,
  PROBLEM_FAILURES,
  PROBLEM_HEADLINE_LEAD,
  PROBLEM_HEADLINE_REST,
} from "@/content/problem";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";

/**
 * The tension beat — the reduced-motion presentation of it.
 *
 * `motion-safe:hidden` is the whole trick, and it is worth understanding.
 * Normally this copy is revealed inside the hero's scroll transition, resolving
 * over the photograph as the opening headline lifts away. A reader who has asked
 * the OS to reduce motion never sees that transition — the hero unpins and lays
 * itself out in normal flow — so without this section they would simply lose the
 * copy.
 *
 * So: this renders **only** under `prefers-reduced-motion: reduce`, and the
 * hero's in-transition version carries the mirror-image rule. One source of
 * words in `@/content/problem`, two presentations, exactly one ever visible.
 * Nobody sees the headline twice.
 *
 * The alternative — deleting the section outright — was the instinct, and it
 * quietly drops a beat of the argument for the readers least able to spare it.
 *
 * Typographically unadorned: no photograph, no card, no icon. A problem
 * illustrated is a problem softened, and this one should sting slightly. The
 * failures are hairline-separated lines rather than prose because each is a
 * separate small defeat, and running them together turns four recognisable
 * moments into one long complaint.
 */
export function TheProblem() {
  return (
    <Section
      aria-labelledby="problem-heading"
      className="pb-0 motion-safe:hidden sm:pb-0 lg:pb-0"
    >
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <Reveal>
            <p className="text-eyebrow text-content-subtle">{PROBLEM_EYEBROW}</p>

            <h2
              id="problem-heading"
              className="mt-6 font-display text-[clamp(1.875rem,4.2vw,3.25rem)] leading-[1.12] font-normal tracking-[-0.005em] text-content"
            >
              {PROBLEM_HEADLINE_LEAD} {PROBLEM_HEADLINE_REST}
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="border-t border-border">
              {PROBLEM_FAILURES.map((failure) => (
                <li
                  key={failure}
                  className="border-b border-border py-5 text-[15px] leading-relaxed text-content-muted"
                >
                  {failure}
                </li>
              ))}
            </ul>

            <p className="mt-8 text-[15px] leading-relaxed text-content">{PROBLEM_CLOSER}</p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
