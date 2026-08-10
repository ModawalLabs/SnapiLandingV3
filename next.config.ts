import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * AVIF first, WebP as the fallback.
     *
     * Next's default is WebP only, and on this site that is the binding
     * constraint rather than any source file. The hero's gold cloth is one large
     * smooth tonal ramp, which is the exact case WebP handles worst — it bands
     * in the folds well before it runs out of bytes. AVIF holds smooth gradients
     * at roughly 30–50% fewer bytes for the same appearance.
     *
     * The cost is encode time on a cache miss, paid once per size per deploy.
     * Every image on this page is a static import with a content-hashed URL, so
     * there is no revalidation churn to worry about.
     */
    formats: ["image/avif", "image/webp"],

    /**
     * Next 16 requires every `quality` value used by an `<Image>` to be declared
     * here; anything not on this list is rejected at request time rather than
     * silently falling back, so an undeclared value is a broken image and not a
     * slightly worse one.
     *
     * 75 is Next's default and stays for the rest of the site — product
     * thumbnails, mission cards, editorial crops. 90 exists for the cloth: it is
     * a full-bleed, near-monochrome gradient that gets crushed into the bottom
     * of the tonal range by an 0.84 scrim, and banding that is invisible at q75
     * on a photograph of a *scene* is plainly visible once this is darkened.
     */
    qualities: [75, 90],
  },
};

export default nextConfig;
