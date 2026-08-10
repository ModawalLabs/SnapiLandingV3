import atelierMannequin from "@/assets/edit/atelier-mannequin.jpg";
import bridalLight from "@/assets/edit/bridal-light.jpg";
import poolsideResort from "@/assets/edit/poolside-resort.jpg";
import sneakersStudio from "@/assets/edit/sneakers-studio.jpg";
import streetStyleFurCoat from "@/assets/edit/street-style-fur-coat.jpg";
import resortSlipTall from "@/assets/products/resort-slip-tall.jpg";
import sneakersTall from "@/assets/products/sneakers-tall.jpg";
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
 * Photography is reused across results. These are decorative crops at 56px, not
 * product shots, so repeating one misattributes nothing.
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
        image: atelierMannequin,
        focus: "object-[50%_35%]",
      },
      {
        brand: "Toteme",
        name: "Signature Cotton Trench",
        merchant: "Net-a-Porter",
        landed: { amount: 109000, currency: "USD" },
        note: "Half the price. Softer collar, and it creases where the Burberry does not.",
        badge: null,
        image: streetStyleFurCoat,
        focus: "object-[62%_40%]",
      },
      {
        brand: "Loro Piana",
        name: "Storm System Overcoat",
        merchant: "Loro Piana",
        landed: { amount: 745000, currency: "USD" },
        note: "Warmer than the brief asked for, and it packs. Well over your ceiling — flagged, not hidden.",
        badge: "Over budget",
        image: bridalLight,
        focus: "object-[45%_40%]",
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
        image: sneakersTall,
        focus: "object-[50%_30%]",
      },
      {
        brand: "Omega",
        name: "Seamaster, 1990s",
        merchant: "Vetted resale",
        landed: { amount: 174000, currency: "USD" },
        note: "Serviced within the year by the seller. Ask for the receipt before you commit.",
        badge: null,
        image: sneakersStudio,
        focus: "object-[50%_60%]",
      },
      {
        brand: "Cartier",
        name: "Tank Must, quartz",
        merchant: "Watchfinder",
        landed: { amount: 224000, currency: "USD" },
        note: "$240 over the ceiling once duties land. Shown because it is the only Tank at this level.",
        badge: "Over budget",
        image: poolsideResort,
        focus: "object-[50%_40%]",
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
        image: poolsideResort,
        focus: "object-[50%_42%]",
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
