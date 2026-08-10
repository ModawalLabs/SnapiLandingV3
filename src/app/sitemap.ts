import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/**
 * One route, because there is one route.
 *
 * In-page anchors are deliberately absent: `#missions` is not a separate
 * document, and listing fragments as URLs asks a crawler to index the same page
 * six times. Add entries here when real routes appear (a story, a legal page),
 * not when a section does.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
