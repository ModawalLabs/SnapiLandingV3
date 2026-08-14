import atelierMannequin from "@/assets/edit/atelier-mannequin.jpg";
import weddingBoutonniere from "@/assets/edit/wedding-boutonniere.jpg";
import type { ImageSource } from "@/types/media";

/**
 * The Edit, as the landing page shows it.
 *
 * ## What is verbatim and what is not
 *
 * The **lead and the feature** — and the editor's letter further down — are lifted
 * word for word from the platform's `mockEditStories` and `mockEditorsLetter`.
 * Keep them that way. This section's whole claim is that the writing is
 * considered, and inventing plausible-sounding headlines in order to demonstrate
 * good headlines undercuts it at the first read.
 *
 * The **back index** is deliberately not verbatim. It was rewritten as reader
 * prompts rather than headlines, and the reasoning is with the data, since that is
 * where someone about to "restore" it will be looking.
 *
 * Reading times were also dropped from every entry. `readMinutes` used to sit on
 * `EditorialStory` and render as `Knitwear · 3 min read`. It was the one piece of
 * metadata on this page that made a promise the page cannot keep — there is no
 * article behind any of these, and a stated duration is the first thing a reader
 * checks against reality.
 *
 * ## Photography
 *
 * Assigned by **crop first, subject second** — the platform's own rule, since its
 * asset set was never shot against this archive. Both surviving pairings happen to
 * match on subject as well: the atelier shot leads a piece about tailoring, and the
 * boutonnière sits on the wedding piece.
 *
 * `wedding-boutonniere` is the closest thing here to commissioned photography — a
 * detail rather than a garment, which is what an editorial spread wants and what a
 * product shot can never be. It replaced `resort-slip-tall`, a full-length slip
 * dress, and it fits the standfirst better as well: that piece is about black tie
 * versus cocktail versus "smart casual", and a lapel is where that question is
 * actually settled.
 *
 * `sneakers-tall` used to sit on the shoes piece here, and went with it — that was
 * the asset's only remaining use, so it was deleted rather than left orphaned. Its
 * source is in `snapi-platform/src/assets/products/` if the piece ever returns.
 *
 * **Resolution ceiling.** `wedding-boutonniere` is 667×1000 and there is no larger
 * master — the platform's copy is byte-identical. Losing the second card actually
 * helped here: at `lg:max-w-[75%]` of five columns the frame now renders around
 * 430 CSS px rather than 576, which brings a 2× screen inside what the file can
 * actually supply. It is no longer the spread's weakest image.
 *
 * The lead still reuses `atelier-mannequin`, because it is the only true 2:3 in
 * the set and the lead frame crops nothing. That reuse is the first thing real
 * photography should replace.
 */

export interface EditorialStory {
  slug: string;
  title: string;
  /** The deck — the line that says what the piece argues. */
  standfirst: string;
  category: string;
}

export interface EditorialFeature extends EditorialStory {
  image: ImageSource;
  alt: string;
  /** `object-position`, where a centre crop would lose the subject. */
  focus?: string;
}

/** The issue's opening piece. Gets the only 2:3 frame in the set. */
export const EDITORIAL_LEAD: EditorialFeature = {
  slug: "tailoring-refined",
  title: "Tailoring, Refined",
  standfirst:
    "The shoulder is the tell. A cutter in Savile Row explains what to look at before the label.",
  category: "Menswear",
  image: atelierMannequin,
  alt: "A tailor pinning patterned fabric to a dress form in a workroom.",
};

/**
 * The single second feature, set against the index rather than against another card.
 *
 * This was `EDITORIAL_PAIR`, an array of two, until the shoes piece came out and the
 * back index moved up beside what remained. Renamed to the singular rather than left
 * as a one-element array called "pair": the name is the first thing that tells the
 * next person what the movement is, and a `PAIR` holding one item reads as something
 * half-deleted.
 */
export const EDITORIAL_FEATURE: EditorialFeature = {
  slug: "dressing-for-the-wedding",
  title: "Dressing for the Wedding",
  standfirst:
    "Black tie, cocktail, and the phrase “smart casual” on an invitation — what each is actually asking for, and the one piece that answers all three.",
  category: "Wedding",
  image: weddingBoutonniere,
  alt: "A hand pinning a pink and white boutonnière to the lapel of a grey checked suit jacket.",
  // 667×1000 is a 2:3, so a 4:5 frame crops it by height and drops 166px. A
  // centre crop would take half of that off the top, where the knitted bow tie
  // is; biasing up keeps the tie and the boutonnière together and spends the
  // loss on the lace cuff at the foot instead.
  focus: "object-[50%_38%]",
};

/**
 * The back index — and the one part of this section that is *not* the magazine
 * speaking.
 *
 * No images, and not for want of assets: this is the taper. The platform's `/edit`
 * narrows from one large picture to a multi-column index with no pictures at all,
 * exactly as a print magazine goes from features to columns to the back index. Six
 * more photographs here would leave the section shapeless.
 *
 * ## These are prompts, not headlines
 *
 * Every entry is written as something a reader would actually type into Snapi —
 * `title` is the request, `standfirst` is the constraints they would add after it.
 * That is the same shape as the app's own mission cards (name plus brief), and it
 * is deliberate on both counts:
 *
 *  - The section's subhead claims the issue is *assembled* from what you searched
 *    and asked it to watch. An index of commissioned headlines asserts that claim;
 *    an index of prompts demonstrates it. The reader can see where the issue came
 *    from.
 *  - It gives the taper a second axis. The lead and the pair are the publication's
 *    voice; this block is the reader's. Features, then the briefs behind them.
 *
 * **Two rules if these are edited.** Keep both fields **under six words** — the
 * grid puts them on one line each and the whole effect is that they scan as typed
 * input rather than as copy. And keep them in **sentence case**: Title Case is the
 * single strongest signal that a human sub-editor wrote something, and it undoes
 * the illusion faster than any wording choice.
 *
 * This is the one block on the page that departs from the platform's
 * `mockEditStories` wording — see the note at the top of this file.
 *
 * ## Two entries, and the even-count rule no longer applies
 *
 * There were six: bags, rain coats, one-colour dressing and small workrooms went,
 * leaving knitwear and watches. This block used to carry a **keep the count even**
 * constraint, because it was a two-column grid whose vertical rule was drawn by
 * `index % 2 === 0` and an odd count left a hairline pointing into empty space.
 *
 * That constraint is gone. The index now sits in a single narrow column beside the
 * wedding feature, so entries stack and any count renders correctly.
 *
 * What replaces it is a **height** budget rather than a parity one. The column is
 * set against a feature that runs a 4:5 photograph plus a caption, and the two are
 * meant to read as one composed spread. At two entries the index is a little over
 * half the feature's height, which is the proportion a sidebar wants; much past
 * four and it will outgrow the picture beside it and the movement stops being a
 * feature with an index and becomes two lists.
 */
export const EDITORIAL_INDEX: EditorialStory[] = [
  {
    slug: "cashmere-that-wont-pill",
    title: "Cashmere that won’t pill",
    standfirst: "Two-ply or better, under $600",
    category: "Knitwear",
  },
  {
    slug: "a-watch-that-holds-value",
    title: "A watch that holds value",
    standfirst: "Papers, original dial, vetted seller",
    category: "Watches",
  },
];

/**
 * The masthead strip.
 *
 * A magazine states its issue. It costs one line and it is the difference between
 * "a page of articles" and a publication.
 *
 * No month or date anywhere — the platform's own note on this is worth repeating:
 * a masthead that stamps a date on the page ages everything under it, and this one
 * will not be re-edited weekly.
 *
 * "your archive" rather than "the archive" is the only personalisation in the
 * strip, and it is doing more work than its size suggests: it is the difference
 * between a magazine you happen to be reading and one that was assembled for you.
 */
export const EDITORIAL_MASTHEAD = {
  issue: "Issue 07",
  archive: "22 stories in your archive",
  /** The sign-off. A statement, not a link — see the note in the section. */
  colophon: "Curated, effortlessly",
} as const;

/**
 * The editor's letter.
 *
 * Verbatim from the platform's `mockEditorsLetter` — **with one deliberate
 * exception**. The headline read "An assistant, not a search box." and now reads
 * "A concierge, not a search box.", because the page renamed what Snapi is and this
 * was one of four places carrying the old word. Leaving it would have put two names
 * for the same thing on one page, which is worse than the drift.
 *
 * ⚠️ **The platform's `mockEditorsLetter` should be updated to match.** Until it is,
 * these two properties disagree on the product's own noun — and this file's whole
 * premise is that they do not.
 *
 * The three paragraphs are untouched and should stay that way. They are the warmest
 * writing on the page already; the emotional pass deliberately skipped them rather
 * than competing with them.
 */
export const EDITORS_LETTER = {
  eyebrow: "From the desk",
  title: "A concierge, not a search box.",
  signature: "The Snapi team",
  paragraphs: [
    "Every piece worth having is already for sale somewhere. Finding one was never the hard part — finding the right one, in your size, from a seller worth trusting, at a price that is not quietly last season’s, is.",
    "That is the work Snapi does. Describe what you are after in a sentence and it reads the listings the way a good buyer would: who genuinely has stock, what the piece was going for last month, which sellers ship without a story, and whether the version in front of you is the one the review was written about.",
    "It keeps watching after you close the tab. A mission holds the thing you are still deciding on, and Snapi comes back when the price moves or your size appears. Nothing arrives that you did not ask for.",
  ],
} as const;
