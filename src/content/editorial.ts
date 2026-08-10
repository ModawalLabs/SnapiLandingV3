import atelierMannequin from "@/assets/edit/atelier-mannequin.jpg";
import resortSlipTall from "@/assets/products/resort-slip-tall.jpg";
import sneakersTall from "@/assets/products/sneakers-tall.jpg";
import type { ImageSource } from "@/types/media";

/**
 * The Edit, as the landing page shows it.
 *
 * Every headline, standfirst and category here is lifted verbatim from the
 * platform's `mockEditStories`. That is deliberate: this section's whole claim is
 * that the writing is considered, and inventing plausible-sounding headlines to
 * demonstrate good headlines would undercut it at the first read.
 *
 * ## Photography
 *
 * Assigned by **crop first, subject second** — the platform's own rule, since its
 * asset set was never shot against this archive. Three of the pairings happen to
 * match anyway and were kept: the atelier shot leads a piece about tailoring, the
 * slip dress sits on the wedding piece, and the shoes sit on the piece about
 * soles.
 *
 * The two product frames are used here in preference to the editorial ones for a
 * duller reason: `atelier-mannequin`, `bridal-light`, `poolside-resort` and
 * `sneakers-studio` are already carrying the Missions grid *and* the hero's result
 * thumbnails, while `resort-slip-tall` and `sneakers-tall` appear only as 56px
 * thumbnails. Using the least-spent images is what stops the page reading as
 * eleven crops of the same five photographs.
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
  readMinutes: number;
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
  readMinutes: 4,
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
    readMinutes: 5,
    image: resortSlipTall,
    alt: "A woman in a pale silk slip dress against a sunlit wall.",
    // 900×1800 is a 1:2, cropped into 4:5 — a centre crop keeps the midsection
    // and loses both the neckline and the hem.
    focus: "object-[50%_32%]",
  },
  {
    slug: "the-sole-that-outlives-the-shoe",
    title: "The Sole That Outlives the Shoe",
    standfirst:
      "Welted, blake, or glued. A cobbler on which of the three is worth resoling twice, and how to tell them apart in a listing photograph.",
    category: "Shoes",
    readMinutes: 4,
    image: sneakersTall,
    alt: "Cream high-top trainers with a gradient sole, shot against a yellow sweep.",
    // Framed low. The shoes are the bottom third of the source.
    focus: "object-[50%_62%]",
  },
];

/**
 * The rest of the issue, text only.
 *
 * No images, and not for want of assets — this is the taper. The platform's
 * `/edit` narrows from one large picture to a four-column index of headlines with
 * no pictures at all, exactly as a print magazine goes from features to columns to
 * the back index. A block of six more photographs here would leave the section
 * shapeless.
 */
export const EDITORIAL_INDEX: EditorialStory[] = [
  {
    slug: "how-to-read-a-cashmere-label",
    title: "How to Read a Cashmere Label",
    standfirst: "Ply, gauge, micron, origin — and which of the four the price is actually tracking.",
    category: "Knitwear",
    readMinutes: 3,
  },
  {
    slug: "watches-that-hold-their-value",
    title: "Watches That Hold Their Value",
    standfirst:
      "Reference numbers, service papers, and the four questions that decide the resale floor.",
    category: "Watches",
    readMinutes: 8,
  },
  {
    slug: "one-bag-twenty-years",
    title: "One Bag, Twenty Years",
    standfirst:
      "Patina is the only finish that cannot be bought. A leather conservator on what ages well and what merely gets old.",
    category: "Accessories",
    readMinutes: 5,
  },
  {
    slug: "wax-wool-or-down",
    title: "Wax, Wool, or Down",
    standfirst:
      "Three coats for the same winter, and the weather each is honestly built for. Only one of them survives real rain.",
    category: "Outerwear",
    readMinutes: 3,
  },
  {
    slug: "colour-used-sparingly",
    title: "Colour, Used Sparingly",
    standfirst:
      "One saturated piece against an otherwise neutral wardrobe does more work than six. Where to spend the single note.",
    category: "Style",
    readMinutes: 4,
  },
  {
    slug: "ateliers-we-visited-this-year",
    title: "The Ateliers We Visited This Year",
    standfirst:
      "Eleven workrooms across five countries, and the quiet argument each of them makes for doing it slowly.",
    category: "Craft",
    readMinutes: 11,
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
