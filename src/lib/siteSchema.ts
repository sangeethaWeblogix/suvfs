// Server-only: the current site's filter panel definition from the cars API
// (GET /car-sites/{site}/ → filters_schema). Cached for an hour; an empty list
// on failure so pages still render (the filter bar then shows Location/Make/Price only).
import type { SchemaItem } from "@/app/listings/SiteFilters";

const API_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE;
const API_KEY = process.env.MPN_API_KEY;

/** The API lists the top seats option as "8+"; the site shows and links it as
 * plain "8" (/listings/8-seats/). The API returns the same cars for seats=8. */
function normalizeSeats(item: SchemaItem): SchemaItem {
  if (item.field !== "seats" || item.control !== "multi") return item;
  const plain = (v: string | number) => String(v).replace(/\+$/, "");
  return { ...item, options: item.options.map(plain), ...(item.values && { values: item.values.map(plain) }) };
}

export async function fetchSiteSchema(): Promise<SchemaItem[]> {
  if (!API_BASE) return [];
  try {
    // Trailing slash on purpose: the host's WAF answers 403 to .../car-sites/suv without it.
    const res = await fetch(`${API_BASE.replace(/\/$/, "")}/`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
        ...(API_KEY && { "X-Secret-Key": API_KEY }),
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error(`[siteSchema] HTTP ${res.status} from ${API_BASE}/`);
      return [];
    }
    const json = await res.json();
    return Array.isArray(json?.filters_schema) ? json.filters_schema.map(normalizeSeats) : [];
  } catch (err) {
    console.error("[siteSchema] fetch failed:", (err as Error).message);
    return [];
  }
}

/** Site-wide facet counts (GET /car-sites/{site}/filters), used to hide browse
 *  chips with no listings. Cached for 5 minutes; null on failure (show all chips). */
export async function fetchSiteFacets(): Promise<Record<string, any> | null> {
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE.replace(/\/$/, "")}/filters`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
        ...(API_KEY && { "X-Secret-Key": API_KEY }),
      },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      console.error(`[siteFacets] HTTP ${res.status} from ${API_BASE}/filters`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error("[siteFacets] fetch failed:", (err as Error).message);
    return null;
  }
}
