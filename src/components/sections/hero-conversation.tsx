"use client";

import { Camera, Check, Clock, Link2, Mic } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { useHeroRevealed } from "@/components/sections/hero-scroll-stage";
import { APP_URL } from "@/config/site";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { DEMOS, THINKING_STEPS, type DemoResult } from "@/lib/demo-conversation";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

/**
 * The hero's conversation — the composer, and the answer it produces.
 *
 * This is the single most important object on the page, and the reason it is one
 * component rather than two: a composer that types a question and an answer
 * panel that shows a result have to be driven by the same clock. Split across
 * two components with two state machines, they drift within a minute of being
 * on screen, and the page's central claim becomes a bug.
 *
 * ## Why the hero shows the answer
 *
 * An empty chat box asks the visitor to imagine what the product does. Watching
 * a brief become three priced, sourced, explained results — one of them flagged
 * as over budget, and the verdict sometimes "not yet" — explains the entire
 * product in about eight seconds, above the fold, without them reading a word of
 * marketing copy.
 *
 * ## The card's material
 *
 * The composer is a working reproduction of the app's, layer for layer: 1.5px of
 * outer padding over a rotating conic-gradient layer, which is what reveals the
 * sweeping gold edge as a border; 24px outer radius against 22.5px inner, so the
 * panel's corners stay concentric with the ring's; a 28px/180% glass panel with a
 * lit top edge and a shaded bottom one; and an outer bloom at two radii that
 * steps up on hover and again on focus. The platform documents its own composer
 * as "matched to the marketing hero's chat card" — this is that card, and the
 * two must not drift.
 *
 * The glass fill is 0.88 white, not the app's dark-mode 0.72: over a light canvas
 * a thinner fill lets the rotating sweep bloom straight through and it reads as a
 * gold stain across half the card.
 *
 * ## Layout stability
 *
 * The answer panel renders three rows in every phase — skeletons while it
 * "thinks", results once it has them. Height is therefore constant by
 * construction rather than by a reserved `min-height` that has to be re-guessed
 * every time the copy changes. Nothing below the hero ever moves.
 *
 * ## Accessibility
 *
 * Deliberately **no `aria-live`**. The panel rewrites itself every eight
 * seconds; announcing that would interrupt a screen-reader user continuously
 * and to no purpose, since the same information is written out in prose further
 * down the page. The cycle also stops the moment anyone focuses the field or
 * types — the demo yields to the person immediately — and under
 * `prefers-reduced-motion` it never starts, holding one complete conversation.
 */

/** Typewriter cadence and the beats of the loop, in ms. */
const TYPE_MS = 45;
const ERASE_MS = 22;
const HOLD_AFTER_TYPE = 520;
/** Longer before erasing than before answering: while the card is still hidden
 *  a fully typed prompt is the only thing on screen, so it should linger. */
const HOLD_BEFORE_ERASE = 1700;
const STEP_MS = 460;
/** Long enough to read three rows and a verdict without hurrying. */
const READ_MS = 5400;
const CLEAR_MS = 460;

/**
 * `erasing` is the idle branch — the loop the composer runs while the results
 * card is still hidden. It types a prompt, holds it, wipes it, and moves to the
 * next, never reaching `thinking`. Answering into a card nobody can see would
 * spend the sequence before anyone was there to watch it.
 */
type Phase = "typing" | "erasing" | "thinking" | "answered" | "clearing";

/**
 * The chips take their colours from `.composer-adaptive`, so they cross-fade
 * with the panel underneath them rather than staying dark-on-light once the
 * card is sitting on a photograph.
 */
const MODALITY = cn(
  "grid size-9 shrink-0 place-items-center rounded-full border",
  "border-[color:var(--composer-chip-border)] bg-[color:var(--composer-chip-bg)] text-content-muted",
  "transition-[border-color,color] duration-200",
  "hover:border-content-subtle hover:text-content",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
);

/** Gold gradient with a dark glyph — reads correctly on any ground, so no variant. */
const SEND_BUTTON = cn(
  "grid size-11 shrink-0 place-items-center rounded-full",
  "bg-[linear-gradient(135deg,oklch(93%_0.07_92),oklch(80%_0.13_85)_55%,oklch(66%_0.12_78))]",
  "shadow-[0_0_16px_3px_oklch(80%_0.13_85/0.45),0_2px_6px_oklch(0%_0_0/0.3)]",
  "transition-[opacity,transform,box-shadow] duration-200",
  "hover:scale-[1.06] hover:shadow-[0_0_22px_5px_oklch(80%_0.13_85/0.65),0_2px_8px_oklch(0%_0_0/0.35)]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
);

const HEADING_ID = "hero-composer-heading";

/**
 * Size a field to its content, letting CSS `max-height` do the capping.
 *
 * Deliberately does NOT clamp in JS. Setting `height` past the CSS cap is
 * harmless — `max-height` wins for layout and `overflow-y: auto` takes over — so
 * the cap lives in one place. Clamping here too would mean two sources of truth
 * that silently disagree the moment the viewport is short.
 *
 * The `height = "auto"` first is required: `scrollHeight` on an element that
 * already has an explicit height reports that height, never the content's, so
 * without it the field can grow but never shrink back.
 */
function autoGrow(el: HTMLTextAreaElement) {
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

export function HeroConversation() {
  const reduceMotion = usePrefersReducedMotion();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const [value, setValue] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const [demoIndex, setDemoIndex] = React.useState(0);

  /**
   * The loop starts at its *end*, on a fully typed prompt with its answer
   * already on screen.
   *
   * Any other seed makes the server render a half-typed question and an empty
   * panel — the state a visitor on a slow connection would sit and stare at, and
   * the state a crawler would index. Starting answered means the prerendered
   * HTML is a complete, meaningful conversation; the loop then simply carries on
   * from there once JS arrives.
   */
  const [phase, setPhase] = React.useState<Phase>("answered");
  const [typedLength, setTypedLength] = React.useState(DEMOS[0].prompt.length);
  const [stepIndex, setStepIndex] = React.useState(THINKING_STEPS.length - 1);

  const demo = DEMOS[demoIndex];

  /**
   * Whether the results card is on screen, and therefore whether the loop
   * should bother producing results.
   *
   * `reduceMotion` counts as revealed: under that preference the hero never
   * pins, so the card sits in normal flow from the start and there is nothing
   * to wait for.
   */
  const scrollRevealed = useHeroRevealed();
  const revealed = scrollRevealed || reduceMotion;

  // The demo yields the moment a real person takes over.
  const showDemo = !focused && value.length === 0;
  const canSend = value.trim().length > 0;
  const running = showDemo && !reduceMotion;

  React.useEffect(() => {
    if (!running) return;

    let timer: ReturnType<typeof setTimeout>;

    switch (phase) {
      case "typing":
        timer =
          typedLength < demo.prompt.length
            ? setTimeout(() => setTypedLength((l) => l + 1), TYPE_MS)
            : // Answer only once the card is on screen; otherwise wipe and move
              // on. A reader scrolling into the reveal mid-erase simply watches
              // it type a fresh question and then answer that one, which is a
              // better sequence than catching a half-finished one.
              setTimeout(
                () => {
                  if (revealed) {
                    setStepIndex(0);
                    setPhase("thinking");
                  } else {
                    setPhase("erasing");
                  }
                },
                revealed ? HOLD_AFTER_TYPE : HOLD_BEFORE_ERASE,
              );
        break;

      case "erasing":
        timer =
          typedLength > 0
            ? setTimeout(() => setTypedLength((l) => l - 1), ERASE_MS)
            : setTimeout(() => {
                setDemoIndex((i) => (i + 1) % DEMOS.length);
                setPhase("typing");
              }, CLEAR_MS);
        break;

      case "thinking":
        timer =
          stepIndex < THINKING_STEPS.length - 1
            ? setTimeout(() => setStepIndex((i) => i + 1), STEP_MS)
            : setTimeout(() => setPhase("answered"), STEP_MS);
        break;

      case "answered":
        timer = setTimeout(() => setPhase("clearing"), READ_MS);
        break;

      case "clearing":
        timer = setTimeout(() => {
          setDemoIndex((i) => (i + 1) % DEMOS.length);
          setTypedLength(0);
          setPhase("typing");
        }, CLEAR_MS);
        break;
    }

    return () => clearTimeout(timer);
  }, [running, revealed, phase, typedLength, stepIndex, demo.prompt.length]);

  const hasAnswer = phase === "answered" || phase === "clearing";
  const typing = phase === "typing" || phase === "erasing";
  const typedPrompt = typing ? demo.prompt.slice(0, typedLength) : demo.prompt;

  const status = hasAnswer
    ? `3 of ${demo.scanned}`
    : phase === "thinking"
      ? `${THINKING_STEPS[stepIndex]}…`
      : "Listening";

  return (
    // `relative`, and everything below the composer is absolutely placed against
    // it. Keeping that stack out of flow is what lets `hero.tsx` treat this
    // component's layout box as the composer alone — the fixed point the whole
    // scroll transition is built on.
    <div className="relative w-full">
      {/* A native cross-origin GET form rather than a JS submit handler.
       *
       * The obvious build is `onSubmit` → `location.assign(...)`, and it is worse
       * in two ways: it does nothing at all if the bundle fails or is still
       * loading, and Next's lint rule cannot tell an external host from an
       * internal route so it flags every such call. A plain form serialises the
       * field to `?q=…` and hands it to the app with no script involved — the
       * hero's one interactive promise then holds even on a broken connection. */}
      <form
        data-hero-form
        action={APP_URL}
        method="get"
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "glass-adaptive",
          // 1.5px of padding is what reveals the rotating layer beneath as a border.
          "group/composer relative w-full cursor-text overflow-hidden rounded-[24px] p-[1.5px]",
          "shadow-[var(--composer-bloom)] hover:shadow-[var(--composer-bloom-hover)] focus-within:shadow-[var(--composer-bloom-focus)]",
          "transition-[box-shadow,transform] duration-300 ease-[cubic-bezier(0.21,0.47,0.32,0.98)]",
          "hover:scale-[1.01] focus-within:scale-[1.02]",
        )}
      >
        {/* Rotating gold sweep. 220% with the negative offsets keeps the
            gradient's centre on the panel's centre as it turns, so the highlight
            tracks the whole perimeter instead of clipping at a corner. */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -mt-[110%] -ml-[110%] h-[220%] w-[220%] animate-ring-sweep-burst motion-reduce:animate-none"
          style={{ background: "var(--ring-sweep-gradient)" }}
        />

        <div className="relative flex w-full flex-col gap-[clamp(1.25rem,3svh,1.75rem)] rounded-[22.5px] p-4 backdrop-blur-[28px] backdrop-saturate-[1.8] sm:p-5">
          {/* Two materials, stacked and cross-faded — see the note in
              `globals.css`. They are absolutely placed, so every sibling below
              needs `relative` to paint above them. */}
          <div className="composer-fill composer-fill-light" aria-hidden="true" />
          <div className="composer-fill composer-fill-dark" aria-hidden="true" />

          <div className="relative w-full">
            <div className="mb-3 flex items-center justify-between gap-2">
              {/* Plain semantic tokens: `.glass-adaptive` on the form redefines
                  them, so these follow the material without an override. */}
              <p id={HEADING_ID} className="text-[11px] leading-4 text-content-muted">
                Your personal shopper
              </p>

              <span className="text-[11px] leading-4 text-content-subtle">
                Ask in a sentence. Press Enter.
              </span>
            </div>

            <div className="relative w-full text-left">
              {showDemo ? (
                <p
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 flex items-center text-[clamp(0.9375rem,1.5vw,1.0625rem)] leading-7 tracking-[0.01em] text-content-muted"
                >
                  <span className="mr-2 text-gold">✦</span>
                  <span className="truncate">{typedPrompt}</span>
                  {/* The caret is only honest while something is being typed. */}
                  {typing ? (
                    <span className="ml-0.5 inline-block h-[0.95em] w-[2px] shrink-0 animate-caret-blink bg-gold motion-reduce:animate-none" />
                  ) : null}
                </p>
              ) : null}

              {/* A textarea, not an input: an input cannot wrap, so a long
                  sentence scrolls sideways inside it and the tail of what you
                  typed goes invisible. */}
              <textarea
                ref={inputRef}
                name="q"
                rows={1}
                value={value}
                onChange={(event) => {
                  setValue(event.target.value);
                  autoGrow(event.currentTarget);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={showDemo ? undefined : "Ask Snapi anything…"}
                aria-label="Ask Snapi anything"
                aria-describedby={HEADING_ID}
                autoComplete="off"
                className={cn(
                  "w-full resize-none bg-transparent text-content",
                  "text-[clamp(0.9375rem,1.5vw,1.0625rem)] leading-7 tracking-[0.01em]",
                  "caret-gold placeholder:text-content-subtle focus:outline-none",
                  "max-h-40 overflow-y-auto",
                  "[scrollbar-width:thin] [scrollbar-color:oklch(60%_0.01_60/0.35)_transparent]",
                )}
              />
            </div>
          </div>

          <div className="relative flex w-full items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              {/* The three modalities, as controls rather than a bullet list.
                  The app owns the camera and the microphone, so each is a link to
                  it rather than a button that does nothing here. */}
              <a href={APP_URL} aria-label="Snap a photo" className={MODALITY}>
                <Camera className="size-4" aria-hidden="true" />
              </a>
              <a href={APP_URL} aria-label="Say what you want" className={MODALITY}>
                <Mic className="size-4" aria-hidden="true" />
              </a>
              <a href={APP_URL} aria-label="Paste a link" className={MODALITY}>
                <Link2 className="size-4" aria-hidden="true" />
              </a>
            </div>

            {/* Kept mounted and faded rather than conditionally rendered —
                mounting it on the first keystroke would shift the row sideways. */}
            <button
              type="submit"
              aria-label="Ask Snapi"
              disabled={!canSend}
              tabIndex={canSend ? 0 : -1}
              onClick={(event) => event.stopPropagation()}
              className={cn(
                SEND_BUTTON,
                canSend ? "scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0",
              )}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="oklch(20% 0.02 70)"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </form>

      {/* The answer, hanging below the composer and out of flow.
       *
       * Out of flow is the whole trick: it takes no height at rest, so the
       * opening hero is short and calm with no card in it at all, and the
       * composer above stays the entirety of this component's layout box — the
       * fixed point the transition is built on. The card then resolves on
       * `.hero-reveal`, on the same curve as the tension copy above, while
       * `hero.tsx` settles the column by one measured offset so the end state is
       * optically centred despite the balance having inverted.
       *
       * The card is a separate surface from the composer, and starts opaque
       * rather than glass: it is Snapi speaking, not the field you type into,
       * and giving them the same material would read as one very tall input. By
       * the time it is on the photograph, `.glass-adaptive` has turned it into
       * the same dark glass the composer wears.
       *
       * The card's inner opacity — the demo's own cross-fade between
       * conversations — is a separate concern from the scroll fade, and the two
       * multiply cleanly because they sit on different elements. */}
      <div
        data-hero-below
        className="absolute inset-x-0 top-full mt-4 motion-reduce:static motion-reduce:mt-4"
      >
        <div data-hero-card className="hero-reveal glass-adaptive">
          <div
            className={cn(
              "overflow-hidden rounded-2xl border border-border bg-surface text-left shadow-premium",
              // Blur does nothing while the surface is opaque cream; it is here
              // for the end of the cross-fade, when `--color-surface` has become
              // a translucent near-black and the card is glass on a photograph.
              "backdrop-blur-[28px] backdrop-saturate-[1.8]",
              "transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              phase === "clearing" ? "opacity-0" : "opacity-100",
            )}
          >
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
            <span className="flex items-center gap-2 text-[12px] font-semibold text-content">
              <span className="text-gold" aria-hidden="true">
                ✦
              </span>
              Snapi
            </span>

            <span className="truncate text-[11px] text-content-subtle">{status}</span>
          </div>

          <ul className="divide-y divide-border">
            {demo.results.map((result, index) => (
              <li
                key={`${demoIndex}-${result.name}`}
                // The third result needs both the width and the *height* for it.
                //
                // The hero is a pinned stage, so its end state — tension copy,
                // composer, and this card — has to fit one viewport, and this
                // row is the ~70px that decides whether it does on a laptop. A
                // width-only breakpoint gets that wrong in the common case of a
                // wide, short window.
                //
                // Applied to the `<li>` so the skeleton and the result disappear
                // together and the card's height still matches between phases.
                className={
                  index === 2
                    ? "hidden [@media(min-width:640px)_and_(min-height:780px)]:block"
                    : undefined
                }
              >
                {hasAnswer ? (
                  <ResultRow result={result} />
                ) : (
                  <SkeletonRow
                    // Staggered so the bars do not pulse in lockstep, which
                    // reads as a placeholder graphic rather than as work
                    // happening.
                    delaySeconds={index * 0.18}
                  />
                )}
              </li>
            ))}
          </ul>

            <div className="border-t border-border px-4 py-4 sm:px-5">
              {hasAnswer ? <Verdict verdict={demo.verdict} /> : <SkeletonVerdict />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Enter sends, Shift+Enter inserts a line break.
   *
   * `isComposing` is the important guard: while an IME candidate window is open
   * (Japanese, Chinese, Korean), Enter commits the candidate. Submitting on it
   * would send a half-finished word and clear the field mid-composition.
   */
  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) return;
    if (event.nativeEvent.isComposing) return;
    event.preventDefault();
    if (value.trim().length === 0) return;
    event.currentTarget.form?.requestSubmit();
  }
}

/**
 * One result.
 *
 * `min-h` is shared with `SkeletonRow` and is the reason the panel never
 * changes height between phases. If you edit one, edit the other.
 */
const ROW =
  "flex min-h-[clamp(4rem,7.4svh,5.75rem)] items-start gap-3.5 px-4 py-4 sm:gap-4 sm:px-5";

function ResultRow({ result }: { result: DemoResult }) {
  return (
    <div className={cn(ROW, result.lead && "bg-gold-subtle/60")}>
      <div className="relative size-14 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={result.image}
          alt=""
          aria-hidden="true"
          fill
          sizes="56px"
          className={cn("object-cover", result.focus)}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-[inherit] ring-1 ring-black/10 ring-inset"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-baseline gap-x-2 text-[13px] leading-5">
          <span className="font-semibold text-content">{result.brand}</span>
          <span className="truncate text-content-muted">{result.name}</span>
        </p>

        <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-content-muted">
          {result.note}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="tabular text-[13px] font-semibold text-content">
          {formatMoney(result.landed)}
        </p>
        <p className="mt-0.5 text-[10px] text-content-subtle">{result.merchant}</p>

        {result.badge ? (
          <span
            className={cn(
              "mt-1.5 inline-block rounded-full px-2 py-0.5 text-[9px] font-semibold tracking-[0.08em] uppercase",
              result.badge === "Over budget"
                ? "bg-surface-raised text-content-muted"
                : "bg-gold-solid text-gold-content",
            )}
          >
            {result.badge}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function SkeletonRow({ delaySeconds }: { delaySeconds: number }) {
  return (
    <div className={ROW} aria-hidden="true">
      <div
        className="size-14 shrink-0 animate-pulse rounded-lg bg-surface-raised"
        style={{ animationDelay: `${delaySeconds}s` }}
      />
      <div className="min-w-0 flex-1 space-y-2.5 pt-1">
        <div
          className="h-3 w-1/3 animate-pulse rounded-full bg-surface-raised"
          style={{ animationDelay: `${delaySeconds}s` }}
        />
        <div
          className="h-3 w-4/5 animate-pulse rounded-full bg-surface-raised"
          style={{ animationDelay: `${delaySeconds + 0.06}s` }}
        />
      </div>
      <div
        className="h-3 w-14 shrink-0 animate-pulse rounded-full bg-surface-raised"
        style={{ animationDelay: `${delaySeconds}s` }}
      />
    </div>
  );
}

/**
 * The verdict.
 *
 * Gold for "buy" and a neutral chip for "wait", rather than green and red. This
 * is not a status indicator: waiting is the *correct* answer roughly as often as
 * buying, and painting it in a warning colour would tell the visitor the product
 * thinks it has failed.
 */
function Verdict({ verdict }: { verdict: { tone: "buy" | "wait"; headline: string; detail: string } }) {
  const buying = verdict.tone === "buy";
  const Icon = buying ? Check : Clock;

  return (
    <div className="flex items-start gap-3.5">
      <span
        className={cn(
          "mt-0.5 grid size-8 shrink-0 place-items-center rounded-full",
          buying ? "bg-gold-solid text-gold-content" : "bg-surface-raised text-content-muted",
        )}
      >
        <Icon className="size-4" aria-hidden="true" strokeWidth={2.25} />
      </span>

      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-content">{verdict.headline}</p>
        <p className="mt-1 text-[12px] leading-relaxed text-content-muted">{verdict.detail}</p>
      </div>
    </div>
  );
}

function SkeletonVerdict() {
  return (
    <div className="flex items-start gap-3.5" aria-hidden="true">
      <div className="mt-0.5 size-8 shrink-0 animate-pulse rounded-full bg-surface-raised" />
      <div className="min-w-0 flex-1 space-y-2.5 pt-1">
        <div className="h-3 w-1/4 animate-pulse rounded-full bg-surface-raised" />
        <div
          className="h-3 w-3/4 animate-pulse rounded-full bg-surface-raised"
          style={{ animationDelay: "0.06s" }}
        />
      </div>
    </div>
  );
}
