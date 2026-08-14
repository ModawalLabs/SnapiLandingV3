import { ArrowUpRight } from "lucide-react";

import homeOffice from "@/assets/all-rounder/home-office.jpg";
import vitraEames from "@/assets/all-rounder/vitra-eames.jpg";
import yellowShearlingCoat from "@/assets/edit/yellow-shearling-coat.jpg";
import cartierSantos from "@/assets/products/cartier-santos.jpg";
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
 * ## The grid is no longer only fashion
 *
 * Two of the four briefs are now a flat to furnish and a desk to equip. That is a
 * deliberate widening and it is the *right* section to do it in: a mission is a
 * standing brief, and the argument for keeping one open — the thing you are still
 * deciding about, that you would rather not think about daily — is stronger for a
 * sofa than for a coat. It also gives the All Rounder edition something to point
 * at; until now every card on the page was Signature's territory.
 *
 * The surrounding copy was deliberately left alone. If the grid drifts further from
 * fashion the heading and description will need to widen with it, or the section
 * starts reading as four unrelated cards rather than as one capability.
 *
 * ## Photography
 *
 * The furniture and home-office tiles now carry real subject-matched shots from
 * `assets/all-rounder`, replacing the borrowed stand-ins they launched with. Both
 * are also the best *technical* fits in the set: `vitra-eames` is 753×1000 against
 * this tile's 3:4, which is a three-pixel discrepancy, and `home-office` is
 * 827×1000, cropping by width to 750 where the tile wants ~662 at 2×. Neither
 * upscales. Every other tile in this grid does.
 *
 * That reshuffle freed `steel-mechanism` — the hard-disk macro that stood in first
 * for a watch movement on the Cartier tile and then for the home office — and it has
 * been deleted, since nothing else on the page had a use for it. Its source is
 * `34111.jpg` if it is ever wanted back.
 *
 * **Cartier therefore has a real Cartier**: `cartier-santos`, the same catalogue
 * shot the hero's watch demo uses. Two caveats carried over from there — it is a
 * Santos-Dumont where the brief says Tank, and it is brand-owned marketing imagery
 * whose licensing is unsettled. It is 533px square against a tile that wants ~662,
 * so it upscales about 1.65×; a flat studio ground survives that far better than a
 * textured one would.
 *
 * **Two briefs were rewritten to match their photographs rather than the reverse** —
 * the home office one here, and the sofa row in the hero's furniture demo. In both
 * cases the copy predated the image and contradicted it outright. A brief that its
 * own tile disproves is worse than a vaguer brief, because the reader resolves the
 * contradiction against the page rather than against the picture.
 *
 * **The coat tile and its brief disagree on colour.** The brief reads
 * "camel/oatmeal/charcoal" and the photograph is a canary-yellow shearling. The
 * mission is called "A winter coat that isn't black", and yellow makes that point
 * far better than camel ever did — so the photograph is right and the brief is the
 * stale half. Widening the brief's colour list is a one-word change.
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
    image: yellowShearlingCoat,
    // Full-length figure in a 2:3 frame, and a 3:4 tile only discards 111px of
    // height, so almost all of it survives. 35% spends that loss at the foot,
    // below the boots, rather than cropping the head.
    focus: "object-[50%_35%]",
  },
  {
    name: "Cartier Tank, pre-1990",
    brief: "Manual wind, original dial, papers preferred. Vetted resellers only.",
    status: "watching",
    collections: 4,
    image: cartierSantos,
    // Square source into a 3:4 tile, so this one crops by *width* — the only tile
    // in the grid that does. 400 of 533 columns survive, which trims the strap
    // ends and leaves the case whole; centred is correct and no `focus` is needed.
  },
  {
    name: "Furniture for the new flat",
    brief: "Sofa, dining table, two chairs. Solid wood, nothing veneered, under $6,000.",
    status: "watching",
    collections: 6,
    image: vitraEames,
    // 753×1000 is 0.753 against this tile's 0.75 — the closest native fit in the
    // whole asset set. Three pixels of width are discarded and nothing else, so
    // `focus` would be decorative and is omitted.
  },
  {
    name: "The home office, done once",
    // Rewritten to match the photograph. This read "Matte finishes, quiet fans,
    // nothing that glows" while the image is a backlit red keyboard, orange-coned
    // speakers and a sunset wallpaper — a brief that its own tile disproves is
    // worse than a vaguer one.
    brief: "Monitor, mechanical keyboard, near-field speakers. One desk, wired once.",
    status: "found",
    collections: 3,
    image: homeOffice,
    // 827×1000 into a 3:4 tile crops by width, keeping the middle 750 columns —
    // the monitor and keyboard survive, the outer window frames go.
    focus: "object-[50%_45%]",
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
