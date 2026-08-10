/**
 * The tension copy.
 *
 * Lives here because it is rendered in two mutually exclusive places: inside the
 * hero's scroll transition for everyone, and as a plain section for readers who
 * have asked the OS to reduce motion (who never see the transition, and would
 * otherwise lose the copy entirely). Only one is ever displayed.
 *
 * A shared constant rather than two literals: the whole point of the reduced-
 * motion fallback is that it says the same thing, and two copies of a sentence
 * in two files is how that stops being true.
 */

export const PROBLEM_EYEBROW = "The part nobody enjoys";

/** Split so the hero can set the two halves at different weights. */
export const PROBLEM_HEADLINE_LEAD = "You already know what you want.";
export const PROBLEM_HEADLINE_REST = "Finding it was never the hard part.";

export const PROBLEM_FAILURES = [
  "Forty tabs, and the good one closed an hour ago.",
  "A listing that has been “in stock” since spring.",
  "A price that is quietly last season’s, marked as new.",
  "A seller with a story, and no way to check it.",
] as const;

export const PROBLEM_CLOSER =
  "Finding the right one — in your size, from a seller worth trusting, at a price that is not quietly last season’s — is.";
