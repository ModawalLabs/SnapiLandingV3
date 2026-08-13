import bridalLight from "@/assets/edit/bridal-light.jpg";
import camelTrench from "@/assets/edit/camel-trench.jpg";
import greyOvercoat from "@/assets/edit/grey-overcoat.jpg";
import weddingBoutonniere from "@/assets/edit/wedding-boutonniere.jpg";
import yellowShearlingCoat from "@/assets/edit/yellow-shearling-coat.jpg";
import cartierSantos from "@/assets/products/cartier-santos.jpg";
import omegaSeamaster from "@/assets/products/omega-seamaster.jpg";
import resortSlipTall from "@/assets/products/resort-slip-tall.jpg";
import tudorMonarch from "@/assets/products/tudor-monarch.jpg";
import type { Money } from "@/lib/money";
import type { ImageSource } from "@/types/media";

/**
 * The hero's scripted conversations.
 *
 * Three briefs, each with the answer Snapi would actually return. This data is
 * the argument of the whole page: a visitor watches a question become a set of
 * priced, sourced, explained results in about eight seconds and understands the
 * product without reading a word of marketing copy.
 *
 * ## Rules these were written to
 *
 * 1. **Every result carries a `note` that says why it qualified.** A list of
 *    products with prices is a search engine. A list where each row explains
 *    itself is an assistant, and that distinction is the entire pitch.
 *
 * 2. **Two of three verdicts are not "buy".** A shopping assistant that always
 *    recommends buying is an affiliate feed with better manners, and anyone who
 *    has used one recognises the difference immediately. Showing the product
 *    decline is the most credible thing on this page.
 *
 * 3. **Over-budget results are shown and flagged, never hidden.** Silently
 *    filtering to the ceiling is how a tool loses trust the first time a user
 *    discovers what it withheld — so one demo does it explicitly.
 *
 * 4. **No dates, seasons, or "today".** Copy that references the calendar goes
 *    stale on a page nobody remembers to edit.
 *
 * 5. **No delivery promises and nothing about sponsorship.** Two rows used to say
 *    when a piece would arrive, and the page elsewhere claimed nothing was
 *    sponsored. Both are commitments about logistics and revenue rather than
 *    descriptions of what the software does, so they are not this page's to make.
 *    Where a row needs a reason to be the lead, it uses condition or the resale
 *    floor — things the product can actually show you.
 *
 * ## Photography
 *
 * Every row renders its image at 56px, `alt=""` and `aria-hidden`, so none of these
 * is asserted to be the product named beside it. That mattered more when they were
 * decorative crops of unrelated editorial frames; most rows now carry something that
 * actually matches the row, which is a straight improvement — a trench beside the
 * Burberry, an overcoat beside the Loro Piana.
 *
 * The watch demo is now three real watches — Tudor, Omega, Cartier — where it was
 * three cropped garment and lifestyle frames. That is the single biggest credibility
 * gain in this file: a row that says `Papers` beside a photograph of a sneaker is
 * the kind of detail a reader notices without being able to say why they stopped
 * believing the page.
 *
 * **Two caveats, and they both apply to all three watches:**
 *
 *  1. **They are the brands' own catalogue photography** — Tudor's, Omega's and
 *     Cartier's — used here to depict inventory on a commercial page. That is a
 *     licensing question rather than a technical one, and it is much cheaper to
 *     settle before launch than after.
 *  2. **Every one of the three names a different model than it shows.**
 *     `tudor-monarch` is a Monarch and the row says `Black Bay 36`;
 *     `cartier-santos` is a Santos-Dumont and the row says `Tank Must`;
 *     `omega-seamaster` is a current Diver 300M and the row says `Seamaster, 1990s`,
 *     which the note's "serviced within the year" implies is vintage. All three are
 *     illegible at 56px and obvious to anyone who knows watches. Renaming the three
 *     references is far cheaper than sourcing three matching photographs, and the
 *     references carry no argument that a different model would break.
 */

export interface DemoResult {
  brand: string;
  name: string;
  merchant: string;
  /** What you will actually pay: duties and shipping resolved. */
  landed: Money;
  /** One line on why this answers the brief. */
  note: string;
  /** Scarcity, condition, or a warning. `null` for most — a badge on every row is wallpaper. */
  badge: string | null;
  /** Marks the row Snapi leads with. Exactly one per demo. */
  lead?: boolean;
  image: ImageSource;
  focus?: string;
}

export interface DemoConversation {
  /** 3–6 words. Longer and it stops reading like something a person would type. */
  prompt: string;
  /** What Snapi swept, shown while it "thinks". */
  scanned: string;
  results: DemoResult[];
  verdict: {
    tone: "buy" | "wait";
    headline: string;
    detail: string;
  };
}

export const DEMOS: DemoConversation[] = [
  {
    prompt: "A trench for Paris rain",
    scanned: "412 boutiques · 12 resale partners",
    results: [
      {
        brand: "Burberry",
        name: "Kensington Heritage Trench",
        merchant: "Burberry",
        landed: { amount: 219000, currency: "USD" },
        note: "Cotton gabardine, storm shield, mid-calf. The only place this colourway exists in your size.",
        badge: "In your size",
        lead: true,
        image: camelTrench,
        // 2:3 into a 56px square discards a third of the height. 35% keeps the
        // collar, the belt and the double-breasted front — the three things that
        // read as "trench" at this size.
        focus: "object-[50%_35%]",
      },
      {
        brand: "Toteme",
        name: "Signature Cotton Trench",
        merchant: "Net-a-Porter",
        landed: { amount: 109000, currency: "USD" },
        note: "Half the price. Softer collar, and it creases where the Burberry does not.",
        badge: null,
        image: yellowShearlingCoat,
        // Biased to the scarf and the coat body. At 56px a face is four pixels of
        // skin tone and reads as noise; a block of saturated yellow reads instantly.
        focus: "object-[50%_30%]",
      },
      {
        brand: "Loro Piana",
        name: "Storm System Overcoat",
        merchant: "Loro Piana",
        landed: { amount: 745000, currency: "USD" },
        note: "Warmer than the brief asked for, and it packs. Well over your ceiling — flagged, not hidden.",
        badge: "Over budget",
        image: greyOvercoat,
        focus: "object-[50%_45%]",
      },
    ],
    verdict: {
      tone: "buy",
      headline: "Buy the Burberry.",
      detail:
        "It has not moved on price in eight quarters, and the two resale listings in this colourway are both above retail.",
    },
  },
  {
    prompt: "A watch under $2,000",
    scanned: "38 authorised dealers · 9 vetted resellers",
    results: [
      {
        brand: "Tudor",
        name: "Black Bay 36",
        merchant: "Bucherer",
        landed: { amount: 198000, currency: "USD" },
        note: "Inside the ceiling, box and papers, authorised dealer. The safe answer.",
        badge: "Papers",
        lead: true,
        image: tudorMonarch,
        // The one watch shot here that is not square: 402×763, so a 1:1 thumbnail
        // covers by width and shows 402 of 763 rows — 47% of the frame is discarded
        // to bracelet. The case spans 23–73% of the height, mid-point 47.8%, and
        // 45% is the position that centres it in that window. Default 50% would
        // clip the lower bezel.
        focus: "object-[50%_45%]",
      },
      {
        brand: "Omega",
        name: "Seamaster, 1990s",
        merchant: "Vetted resale",
        landed: { amount: 174000, currency: "USD" },
        note: "Serviced within the year by the seller. Ask for the receipt before you commit.",
        badge: null,
        image: omegaSeamaster,
        // Square source into a square thumbnail, so there is nothing to crop and
        // no `focus` to set. Left uncropped on purpose: these are the brand's own
        // catalogue framing, and tightening in on a product shot that was composed
        // with deliberate margin is how it starts looking like a screenshot.
      },
      {
        brand: "Cartier",
        name: "Tank Must, quartz",
        merchant: "Watchfinder",
        landed: { amount: 224000, currency: "USD" },
        note: "$240 over the ceiling once duties land. Shown because it is the only Tank at this level.",
        badge: "Over budget",
        image: cartierSantos,
        // Square into square — see the Omega row above.
      },
    ],
    verdict: {
      tone: "wait",
      headline: "Not yet.",
      detail:
        "The Tudor has closed 9% lower twice this quarter. Snapi is watching both sellers and will tell you when it moves.",
    },
  },
  {
    prompt: "Something for an Amalfi wedding",
    scanned: "260 boutiques · FR 38 in stock only",
    results: [
      {
        brand: "Zimmermann",
        name: "Silk Midi, worn once",
        merchant: "Vetted resale",
        landed: { amount: 64000, currency: "USD" },
        note: "Same season as retail, and the condition is verified rather than described.",
        badge: "Verified",
        lead: true,
        image: resortSlipTall,
        focus: "object-[50%_35%]",
      },
      {
        brand: "The Row",
        name: "Silk Slip, FR 38",
        merchant: "Matches",
        landed: { amount: 189000, currency: "USD" },
        note: "Packs without creasing, which was the hardest constraint in the brief.",
        badge: null,
        image: weddingBoutonniere,
        // A square 56px crop takes only 667 of this frame's 1000px height, so a
        // third of it is discarded. At 30% the boutonnière and the hand survive;
        // a centre crop would leave a thumbnail of jacket weave.
        focus: "object-[50%_30%]",
      },
      {
        brand: "Jacquemus",
        name: "La Robe Bahia",
        merchant: "Jacquemus",
        landed: { amount: 89000, currency: "USD" },
        note: "Linen, and the last FR 38 anywhere. Creases in transit — pack it last.",
        badge: "Last one",
        image: bridalLight,
        focus: "object-[45%_45%]",
      },
    ],
    verdict: {
      tone: "buy",
      headline: "Take the resale Zimmermann.",
      detail:
        "A third of the retail price for the same season, and the resale floor for this reference has not moved in a year.",
    },
  },
];

/**
 * The steps shown while Snapi "thinks".
 *
 * Three, because two reads as a loading spinner with delusions and four takes
 * longer to watch than the answer takes to read.
 */
export const THINKING_STEPS = [
  "Reading your brief",
  "Checking stock and sizes",
  "Comparing landed prices",
] as const;
