import { EDITORS_LETTER } from "@/content/editorial";
import { cn } from "@/lib/utils";

/**
 * The editor's letter — now a **movement inside Editorial**, not a section.
 *
 * It used to be a top-level `<Section>` of its own. It was folded in because it is
 * lifted from the platform's `/edit` page, and the page was referencing The Edit in
 * three separate places without ever naming it as one thing: this letter, the
 * full-bleed pull quote, and nothing that said where either came from. Inside the
 * editorial chapter it reads as the letter opening an issue, which is what it is.
 *
 * The pull quote deliberately stayed where it was. It is structurally load-bearing
 * — the full-bleed plate that turns the page into the dark Missions chapter — and
 * moving it here would have flattened the page's only inversion.
 *
 * This is the page's only first-person voice, and the only place it argues rather
 * than demonstrates. Everything else is Snapi showing what it does; this is a
 * person saying why it was built that way, which is what a reader is actually
 * deciding about when they decide whether to trust an assistant with what they buy.
 *
 * ## Typography
 *
 * Narrow measure, serif drop cap, body on the sans. Long-form serif on screen is
 * measurably harder to read, and the serif here is doing a different job: the
 * initial marks this as *writing* rather than as another block of product copy, and
 * a reader registers that before parsing a word of it.
 */
export function EditorsLetter() {
  return (
    <div className="container-prose">
      <p className="text-eyebrow text-gold">{EDITORS_LETTER.eyebrow}</p>

      <h3 className="mt-6 font-display text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.1] font-normal tracking-[-0.005em] text-content">
        {EDITORS_LETTER.title}
      </h3>

      {/* The rule sits between the headline and the body rather than under the
          eyebrow: it marks where the masthead ends and the writing begins, which
          is what a printed letter does. */}
      <div className="mt-9 h-px w-16 bg-gold-border" role="presentation" />

      <div className="mt-9 flex flex-col gap-6">
        {EDITORS_LETTER.paragraphs.map((paragraph, index) => (
          <p key={paragraph.slice(0, 24)} className={paragraphClass(index === 0)}>
            {paragraph}
          </p>
        ))}
      </div>

      <p className="mt-11 font-display text-[1.25rem] leading-tight font-normal text-content">
        {EDITORS_LETTER.signature}
      </p>
    </div>
  );
}

/**
 * A serif initial on the first paragraph only.
 *
 * `first-letter:` rather than a wrapping `<span>`, so the character stays part of
 * the sentence for selection, find-in-page and screen readers — a spanned capital
 * is announced as its own word.
 */
function paragraphClass(isFirst: boolean) {
  return cn(
    "text-[1.0625rem] leading-[1.75] text-content-muted",
    isFirst &&
      "first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:font-display first-letter:text-[4.5rem] first-letter:leading-[0.78] first-letter:font-normal first-letter:text-gold",
  );
}
