import { parseSlugToFilters } from "@/app/components/urlBuilder";
import { buildSlugFromFilters } from "@/app/components/slugBuilter";
import { isIndexableListingPath } from "@/utils/seo/indexRules";

/**
 * Listing paths from the backend sitemap API ("new-south-wales-state/audi/")
 * → the paths the site actually serves and indexes, relative to /listings/.
 *
 * The backend emits location before make, but the canonical order is
 * make → location; middleware answers 410 to any non-canonical order. Paths
 * are rebuilt in canonical order, dropped if a segment does not survive the
 * rebuild, and dropped if the index rules say noindex.
 */
export function canonicalSitemapPaths(paths: string[]): string[] {
  const out = new Set<string>();
  for (const path of paths) {
    const parts = path.split("/").filter(Boolean);
    const canonical = buildSlugFromFilters(parseSlugToFilters(parts));
    const canonParts = canonical.replace(/^\/listings/, "").split("/").filter(Boolean);
    if (canonParts.length !== parts.length) continue;
    if (!isIndexableListingPath(`${canonical.replace(/\/$/, "")}/`)) continue;
    out.add(`${canonParts.join("/")}/`);
  }
  return [...out];
}
