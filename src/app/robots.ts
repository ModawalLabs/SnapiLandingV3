import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/**
 * Indexing is allowed only in production.
 *
 * Preview deployments serve the same HTML on a public URL, and a crawler that
 * finds one indexes a duplicate of the site under a domain nobody controls —
 * which then competes with the real one in search results and is slow to remove.
 * Blocking by environment rather than by hostname means a new preview URL is
 * covered the day it exists.
 */
export default function robots(): MetadataRoute.Robots {
  // `VERCEL_ENV` takes precedence and `NODE_ENV` is only the fallback, never an
  // alternative. Vercel builds previews with `NODE_ENV=production` too, so
  // OR-ing the two would allow indexing on exactly the deployments this exists
  // to block.
  const vercelEnv = process.env.VERCEL_ENV;
  const isProduction = vercelEnv
    ? vercelEnv === "production"
    : process.env.NODE_ENV === "production";

  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
