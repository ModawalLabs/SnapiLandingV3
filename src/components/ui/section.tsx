import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * A page section and its heading block.
 *
 * Vertical rhythm is centralised here rather than set per section, because that
 * is the single thing that most reliably drifts on a long marketing page — one
 * section at `py-24`, its neighbour at `py-28`, and the scroll develops a limp
 * that nobody can point at. Sections that genuinely need a different measure
 * pass `padded={false}` and own their spacing outright.
 */
export function Section({
  id,
  className,
  children,
  padded = true,
  ...props
}: React.ComponentPropsWithoutRef<"section"> & { padded?: boolean }) {
  return (
    <section
      id={id}
      // Scroll margin so an anchored jump does not park the heading under the
      // fixed header. Matches the header's height plus a breathing gap.
      className={cn("scroll-mt-24", padded && "py-24 sm:py-32 lg:py-40", className)}
      {...props}
    >
      {children}
    </section>
  );
}

/**
 * Eyebrow → heading → description.
 *
 * The eyebrow is gold and the heading is the display serif; that pairing is what
 * carries the brand from section to section, so it is a component rather than
 * six utilities copied nine times.
 *
 * `align="left"` is the default and the right answer most of the time — a centred
 * heading over left-aligned content below it reads as two unrelated decisions.
 * Centre only when the content beneath is itself symmetrical.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  headingId,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  headingId?: string;
}) {
  const centered = align === "center";

  return (
    <div className={cn(centered && "mx-auto max-w-3xl text-center", className)}>
      {eyebrow ? <p className="text-eyebrow text-gold">{eyebrow}</p> : null}

      {/* `font-normal`, not semibold: Oranienbaum ships a single 400 weight, so
          any heavier value makes the browser synthesise a fake bold — smeared
          stems and broken serifs at display size.
          Tracking is near-zero rather than the negative value used for Geist
          display type; a serif this narrow tightens into itself. */}
      {/* Always an `<h2>`. There was an `as` prop for `h1`/`h3` and nothing ever
          passed it: the page's only `<h1>` is the hero's, which is set inline, and
          every section heading below it is a level two. */}
      <h2
        id={headingId}
        className={cn(
          "font-display font-normal tracking-[-0.005em] text-content",
          "text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.08]",
          eyebrow && "mt-4",
        )}
      >
        {title}
      </h2>

      {description ? (
        <p
          className={cn(
            "mt-5 text-[1.0625rem] leading-relaxed text-content-muted",
            centered ? "mx-auto max-w-2xl" : "max-w-xl",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
