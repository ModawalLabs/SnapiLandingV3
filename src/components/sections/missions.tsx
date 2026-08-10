import { ArrowUpRight } from "lucide-react";

import atelierMannequin from "@/assets/edit/atelier-mannequin.jpg";
import bridalLight from "@/assets/edit/bridal-light.jpg";
import poolsideResort from "@/assets/edit/poolside-resort.jpg";
import sneakersStudio from "@/assets/edit/sneakers-studio.jpg";
import { buttonVariants } from "@/components/ui/button";
import { MediaFrame } from "@/components/ui/media-frame";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeader } from "@/components/ui/section";
import { APP_URL } from "@/config/site";
import type { ImageSource } from "@/types/media";
import { cn } from "@/lib/utils";

/**
 * Missions — the section that has to land.
 *
 * Everything above this point is a better search box, and a better search box is
 * not a company. A mission is a standing brief an agent keeps working after the
 * tab is closed, and it is the only claim on this page a competitor cannot make
 * by shipping a chat window. So it gets photography, the largest grid, the
 * page's second gold CTA — and the dark chapter.
 *
 * ## Why this one is inverted
 *
 * `.chapter-dark` re-points the whole palette on this section's root, so every
 * token inside resolves to the platform's dark-theme value and no component here
 * knows it is in a dark chapter. Two things follow from putting it *here* rather
 * than anywhere else:
 *
 *  - It is the emotional peak of the page, and contrast is how a long scroll
 *    signals one. Cream for eight sections and then near-black tells the reader
 *    to pay attention more directly than any heading can.
 *  - These cards are photographs with white type on a dark scrim. On cream they
 *    are four dark rectangles fighting the page; on near-black the card edges
 *    dissolve and the photographs become the section.
 *
 * The gold in here is the bright dark-theme value, not the cream-tuned bronze —
 * that swap is automatic, and it is why `text-gold` inside `.chapter-dark` reads
 * correctly without a single override.
 *
 * The cards mirror the app's own mission cards deliberately, down to the status
 * chip and the collections count. A visitor who opens Snapi after reading this
 * should recognise the object they were shown — a landing page that invents its
 * own version of a real screen is a promise the product then has to break.
 *
 * ## Type over photography
 *
 * Everything inside a `MediaFrame` is white or white-alpha, and the wrapper
 * carries `.on-photo` so gold resolves to its bright variant. The page's default
 * gold is a dark bronze tuned to clear AA against cream; over a scrimmed
 * photograph it renders near-black on near-black. This is the single most common
 * way a light-theme design breaks on its own imagery.
 */

type Status = "found" | "running" | "watching";

const STATUS_LABEL: Record<Status, string> = {
  found: "Found",
  running: "Running",
  watching: "Watching",
};

/**
 * Status colours are fixed values, not palette tokens.
 *
 * `--color-success` and friends are tuned against the cream canvas. These chips
 * sit on a photograph, which is dark regardless of what the page is doing, so
 * they need their own bright set — the same reasoning that governs `.on-photo`.
 */
const STATUS_TONE: Record<Status, string> = {
  found: "bg-[oklch(74%_0.15_152/0.22)] text-[oklch(88%_0.13_152)] ring-[oklch(74%_0.15_152/0.4)]",
  running: "bg-[oklch(80%_0.13_85/0.22)] text-[oklch(90%_0.1_88)] ring-[oklch(80%_0.13_85/0.4)]",
  watching: "bg-white/12 text-white/85 ring-white/25",
};

const MISSIONS: {
  name: string;
  brief: string;
  status: Status;
  collections: number;
  image: ImageSource;
  /** Belongs to the photograph, not the card — see `MediaFrame`. */
  focus?: string;
}[] = [
  {
    name: "A winter coat that isn’t black",
    brief: "Wool or wool-cashmere, mid-calf, camel/oatmeal/charcoal. No logos.",
    status: "running",
    collections: 11,
    image: atelierMannequin,
    focus: "object-[50%_45%]",
  },
  {
    name: "Cartier Tank, pre-1990",
    brief: "Manual wind, original dial, papers preferred. Vetted resellers only.",
    status: "watching",
    collections: 4,
    image: bridalLight,
    focus: "object-[45%_50%]",
  },
  {
    name: "Amalfi wedding, September",
    brief: "Two looks, one evening. Silk or linen, packs without creasing, FR 38.",
    status: "watching",
    collections: 6,
    image: poolsideResort,
    focus: "object-[50%_42%]",
  },
  {
    name: "Loafers I can walk 10km in",
    brief: "Rubber or combination sole, unlined suede, EU 42. Broken in fast.",
    status: "found",
    collections: 3,
    image: sneakersStudio,
    focus: "object-[50%_74%]",
  },
];

export function Missions() {
  return (
    <Section id="missions" aria-labelledby="missions-heading" className="chapter-dark">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              headingId="missions-heading"
              eyebrow="Missions"
              title="It keeps looking after you close the tab."
              description="Give Snapi a standing brief and an agent works it in the background — sweeping stock, watching prices, checking sellers. It comes back when something changes, and only then."
            />

            <a
              href={APP_URL}
              className={cn(buttonVariants({ variant: "gold", size: "md" }), "self-start")}
            >
              Start a mission
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </Reveal>

        <ul className="mt-16 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {MISSIONS.map((mission, index) => (
            <Reveal as="li" key={mission.name} delay={index * 0.06} className="group">
              <MediaFrame
                src={mission.image}
                // Decorative: the mission's name is right there in the card, so
                // describing the photograph would make a screen reader read the
                // tile twice.
                alt=""
                focus={mission.focus}
                sizes="(min-width: 1280px) 23vw, (min-width: 640px) 47vw, 92vw"
                className={cn(
                  "aspect-[3/4] min-h-[21rem] rounded-xl",
                  "transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  "group-hover:-translate-y-1 group-hover:shadow-premium-lg",
                )}
              >
                {/* The scrim is bottom-weighted, so the top of the frame is bare.
                    This reinstates just enough shade for the status chip without
                    lifting the photograph's midtones. */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 to-transparent"
                  aria-hidden="true"
                />

                <div className="on-photo absolute inset-0 flex flex-col p-5">
                  <div className="flex shrink-0 justify-end">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.1em] uppercase ring-1 backdrop-blur-md ring-inset",
                        STATUS_TONE[mission.status],
                      )}
                    >
                      {STATUS_LABEL[mission.status]}
                    </span>
                  </div>

                  {/* `justify-end` — the name hangs off the bottom of the frame,
                      where the scrim is darkest and the type is guaranteed
                      legible. */}
                  <div className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden pt-6">
                    <h3 className="line-clamp-3 font-display text-[1.5rem] leading-[1.15] font-normal tracking-[-0.005em] text-white">
                      {mission.name}
                    </h3>

                    <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-white/70">
                      {mission.brief}
                    </p>
                  </div>

                  <div className="mt-5 flex shrink-0 items-end justify-between gap-3 border-t border-white/15 pt-3.5">
                    <div>
                      <p className="text-eyebrow text-white/55">Collections</p>
                      <p className="tabular mt-1 text-sm font-semibold text-white">
                        {mission.collections}
                      </p>
                    </div>

                    <span className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-gold">
                      Open
                      <ArrowUpRight
                        className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </div>
              </MediaFrame>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
