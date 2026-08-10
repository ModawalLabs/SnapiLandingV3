import fs from "node:fs";
import path from "node:path";

import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

/**
 * The share card.
 *
 * Without this every link to the site renders as a bare URL in Slack, iMessage,
 * WhatsApp and X — which for a product being sold on how it looks is close to
 * the worst first impression available.
 *
 * ## Why the logo is read from disk
 *
 * `ImageResponse` renders in an isolated Satori context with no bundler and no
 * DOM. A static import gives back a `/\_next/image` path that means nothing
 * there, so local artwork has to arrive as a data URI. `readFileSync` at module
 * scope runs once during the build rather than per request.
 *
 * ## Why the type is not Oranienbaum
 *
 * Satori needs an actual font buffer; `next/font` hands one to the browser, not
 * to Node. The alternatives were fetching the TTF from Google at build time —
 * which makes every build depend on a third-party host being up — or committing
 * a font file. Neither is worth it for one image, so the card leans on scale,
 * the gold rule and the mark instead, and reads as unmistakably Snapi without
 * the serif. **If the display face matters here, commit `Oranienbaum.ttf` to
 * `src/assets/fonts/` and pass it in `fonts: [...]`.**
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;

const logo = fs.readFileSync(
  path.join(process.cwd(), "src/assets/logos/logo-light.png"),
);
const logoDataUri = `data:image/png;base64,${logo.toString("base64")}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          // The canvas token, resolved. Satori has no CSS variables, and no
          // oklch — these are the sRGB equivalents of `--color-canvas` and
          // `--color-content`.
          backgroundColor: "#faf8f4",
          padding: "72px 80px",
        }}
      >
        {/* The ambient wash, flattened to two sources.
         *
         * Explicit `top`/`left`/`width`/`height` rather than `inset: 0`: Satori
         * implements a subset of CSS and silently ignores the shorthand, which
         * collapses the layer to nothing and drops the wash from the card with
         * no error anywhere in the build.
         *
         * `display: flex` for the same class of reason — Satori requires an
         * explicit display on every element rather than inheriting the browser's
         * block default. */}
        <div
          style={{
            position: "absolute",
            display: "flex",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              "radial-gradient(900px 600px at 18% 12%, rgba(226,177,84,0.30), transparent 62%), radial-gradient(800px 620px at 88% 92%, rgba(60,96,190,0.16), transparent 60%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori has no
              next/image; this renders to a PNG at build time, not to the DOM. */}
          <img src={logoDataUri} width={54} height={80} alt="" />
          <span style={{ fontSize: 40, fontWeight: 600, color: "#2b2622", letterSpacing: -1 }}>
            {siteConfig.name}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#8a6a2c",
            }}
          >
            AI-assisted personal shopping
          </span>

          <span
            style={{
              marginTop: 28,
              fontSize: 104,
              lineHeight: 1.02,
              letterSpacing: -4,
              color: "#211d1a",
            }}
          >
            {siteConfig.tagline}
          </span>

          <div style={{ display: "flex", marginTop: 44, height: 3, width: 180, backgroundColor: "#d8b463" }} />

          <span style={{ marginTop: 36, fontSize: 26, lineHeight: 1.4, color: "#6b6259", maxWidth: 860 }}>
            Snap it, say it, or describe it. Snapi searches every maison and vetted reseller,
            compares the real price, and tells you when to buy.
          </span>
        </div>
      </div>
    ),
    size,
  );
}
