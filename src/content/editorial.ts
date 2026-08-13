import atelierMannequin from "@/assets/edit/atelier-mannequin.jpg";
import weddingBoutonniere from "@/assets/edit/wedding-boutonniere.jpg";
import sneakersTall from "@/assets/products/sneakers-tall.jpg";
import type { ImageSource } from "@/types/media";

/**
 * The Edit, as the landing page shows it.
 *
 * ## What is verbatim and what is not
 *
 * The **lead and the pair** — and the editor's letter further down — are lifted
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
 * asset set was never shot against this archive. All three pairings happen to match
 * on subject as well: the atelier shot leads a piece about tailoring, the
 * boutonnière sits on the wedding piece, and the shoes sit on the piece about
 * soles.
 *
 * `wedding-boutonniere` is the closest thing here to commissioned photography — a
 * detail rather than a garment, which is what an editorial spread wants and what a
 * product shot can never be. It replaced `resort-slip-tall`, a full-length slip
 * dress, and it fits the standfirst better as well: that piece is about black tie
 * versus cocktail versus "smart casual", and a lapel is where that question is
 * actually settled.
 *
 * `sneakers-tall` is still a product frame rather than an editorial one, and for a
 * duller reason: `atelier-mannequin`, `bridal-light`, `poolside-resort` and
 * `sneakers-studio` already carry the Missions grid *and* the hero's result
 * thumbnails. Using the least-spent image is what stops the page reading as eleven
 * crops of the same five photographs.
 *
 * **Resolution ceiling.** `wedding-boutonniere` is 667×1000 and there is no larger
 * master — the platform's copy is byte-identical. The pair renders around 576 CSS px
 * wide, so on a 2× screen this frame is the one image in the spread that is
 * genuinely upscaled. It survives it better than most would, because a tight detail
 * crop has no fine repeating structure to alias, but it is the constraint to fix
 * with a bigger file rather than a different encode.
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

/** Two features, the second dropped six rows on wide screens. */
export const EDITORIAL_PAIR: EditorialFeature[] = [
  {
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
  },
  {
    slug: "the-sole-that-outlives-the-shoe",
    title: "The Sole That Outlives the Shoe",
    standfirst:
      "Welted, blake, or glued. A cobbler on which of the three is worth resoling twice, and how to tell them apart in a listing photograph.",
    category: "Shoes",
    image: sneakersTall,
    alt: "Cream high-top trainers with a gradient sole, shot against a yellow sweep.",
    // Framed low. The shoes are the bottom third of the source.
    focus: "object-[50%_62%]",
  },
];

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
  {
    slug: "one-bag-for-twenty-years",
    title: "One bag for twenty years",
    standfirst: "Vegetable-tanned, unlined, ages well",
    category: "Accessories",
  },
  {
    slug: "a-coat-for-real-rain",
    title: "A coat for real rain",
    standfirst: "Waxed cotton or shell, mid-length",
    category: "Outerwear",
  },
  {
    slug: "one-colour-everything-else-neutral",
    title: "One colour, everything else neutral",
    standfirst: "One saturated piece, worn constantly",
    category: "Style",
  },
  {
    slug: "who-actually-still-makes-this",
    title: "Who actually still makes this",
    standfirst: "Small workrooms, made by hand",
    category: "Craft",
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
 * Verbatim from the platform's `mockEditorsLetter`, headline included. Resist
 * editing these for the marketing site: two versions of the same argument in
 * slightly different words is how a brand stops sounding like one person.
 */
export const EDITORS_LETTER = {
  eyebrow: "From the desk",
  title: "An assistant, not a search box.",
  signature: "The Snapi team",
  paragraphs: [
    "Every piece worth having is already for sale somewhere. Finding one was never the hard part — finding the right one, in your size, from a seller worth trusting, at a price that is not quietly last season’s, is.",
    "That is the work Snapi does. Describe what you are after in a sentence and it reads the listings the way a good buyer would: who genuinely has stock, what the piece was going for last month, which sellers ship without a story, and whether the version in front of you is the one the review was written about.",
    "It keeps watching after you close the tab. A mission holds the thing you are still deciding on, and Snapi comes back when the price moves or your size appears. Nothing arrives that you did not ask for.",
  ],
} as const;
