"use client";

import * as React from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

/**
 * The server cannot know the preference, so it reports "no". That direction is
 * the safe one: a moment of motion for someone who asked for none is a small
 * cost, whereas defaulting to `true` would freeze the typewriter for every user
 * until hydration finished.
 */
function getServerSnapshot() {
  return false;
}

/**
 * Whether the user has asked the OS to reduce motion.
 *
 * `globals.css` already neutralises every CSS animation and transition under
 * this query, so this hook exists only for motion CSS cannot reach — a
 * JS-driven state machine such as the hero's typewriter. Anything animated with
 * a class or a keyframe does not need it.
 *
 * `useSyncExternalStore` rather than `useState` + `useEffect`. A media query is
 * an external store in the precise sense React means, and the effect version has
 * to seed state by calling `setState` in the effect body — which React 19 flags,
 * correctly, as a cascading render. This subscribes and reads in one primitive,
 * with a server snapshot that keeps hydration consistent.
 *
 * Written locally rather than imported from Framer Motion: pulling the whole
 * animation library into the hero's chunk for one media-query subscription would
 * put tens of kilobytes in front of the page's largest contentful paint, which
 * is precisely where a landing page can least afford them.
 */
export function usePrefersReducedMotion() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
