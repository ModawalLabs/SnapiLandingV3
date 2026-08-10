"use client";

import * as React from "react";

/**
 * Scroll reveal: fade plus a short rise, once.
 *
 * ## Why this is CSS and an observer rather than Framer Motion
 *
 * The obvious build is `motion.div` with `initial={{ opacity: 0 }}` and
 * `whileInView`. It was the first build, and it fails in a way that only shows
 * up on a bad connection: Framer Motion writes the initial state as an inline
 * style during SSR, so the prerendered HTML ships every revealed element at
 * `opacity: 0`. If the bundle is slow, blocked, or errors, the entire page below
 * the hero is a blank cream field — the single worst failure mode a marketing
 * page has, and invisible in local development where the bundle always arrives.
 *
 * Here the hidden state lives in CSS behind `@media (scripting: enabled)`, so it
 * is only ever applied when there is script to undo it. No JS, no scripting
 * support, or an old browser that does not know the query: the content is simply
 * visible, which is the correct answer in all three cases. The transition itself
 * costs no runtime library at all.
 *
 * `once`, via `disconnect()` on first intersection: an element that re-animates
 * every time the reader scrolls back up is the fastest way to make a tasteful
 * reveal irritating. The `-12%` bottom margin means it commits when it is
 * genuinely on screen rather than the instant its first pixel clears the fold.
 *
 * Reduced motion is handled entirely in `globals.css` — the hidden state is
 * lifted there rather than transitioned quickly, so nothing moves and nothing
 * is left invisible.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  variant = "content",
}: {
  children: React.ReactNode;
  /** Seconds. Stagger siblings by ~0.08 — beyond ~0.3 total it reads as lag. */
  delay?: number;
  className?: string;
  as?: "div" | "li";
  /**
   * `"content"` fades and rises — right for type and cards.
   *
   * `"image"` wipes with a `clip-path` edge while the child scales down into
   * place, which is the gesture a fashion house uses and the reason a plate
   * reads as authored rather than as a slow connection. It expects **exactly one
   * element child** (the image wrapper), since the scale is applied to `> *`.
   */
  variant?: "content" | "image";
}) {
  const ref = React.useRef<HTMLElement>(null);
  const [revealed, setRevealed] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    /**
     * No `typeof IntersectionObserver === "undefined"` fallback, and it is not
     * an oversight.
     *
     * The hidden state is gated on `@media (scripting: enabled)`, which shipped
     * in Chrome 120, Firefox 113 and Safari 17 — years *after* IntersectionObserver
     * (Chrome 51, Firefox 55, Safari 12.1). So any browser capable of applying
     * the rule that hides this element is necessarily capable of observing it,
     * and a fallback branch here could never run.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={ref}
      data-reveal={variant === "image" ? "image" : ""}
      data-revealed={revealed ? "" : undefined}
      // Inline rather than a utility class: the delay is a per-instance number,
      // and Tailwind cannot generate a class from a runtime value.
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
