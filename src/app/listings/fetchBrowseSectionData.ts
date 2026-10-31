import { normalizeCountItems } from "@/lib/countItems";
import { fetchSiteSchema } from "@/lib/siteSchema";
import { loadBrowseCounts, subjectFieldsFor, type CountItem, type BrowseSectionData } from "./browseSectionShared";
import { BUDGET_BAND_PARAMS } from "./siteBrowseFilters";

// params-count (make/state/region counts) uses the MPN key/base.
const MPN_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE;
const MPN_KEY = process.env.MPN_API_KEY;

const mpnHeaders = (): Record<string, string> => ({
  Accept: "application/json",
  ...(MPN_KEY ? { "X-Secret-Key": MPN_KEY } : {}),
});

/** WP params-count, grouped by `groupBy` within `scope`. */
export async function fetchGroupCountsServer(
  groupBy: string,
  scope: Record<string, string>
): Promise<CountItem[]> {
  try {
    const qs = new URLSearchParams({ group_by: groupBy, ...scope });
    const res = await fetch(`${MPN_BASE}/params-count?${qs.toString()}`, {
      headers: mpnHeaders(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return normalizeCountItems(json?.data ?? []) as CountItem[];
  } catch {
    return [];
  }
}

/** Listing total for a scope (params-count's total_products), or null when unknown. */
async function fetchTotalServer(scope: Record<string, string>): Promise<number | null> {
  try {
    const qs = new URLSearchParams({ group_by: "make", ...scope });
    const res = await fetch(`${MPN_BASE}/params-count?${qs.toString()}`, {
      headers: mpnHeaders(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const total = (await res.json())?.total_products;
    return typeof total === "number" ? total : null;
  } catch {
    return null;
  }
}

/** Server-side mirror of StateBrowseSection's count fetch — run during SSR/ISR
 * so the browse links land in the initial HTML, already trimmed to pages with
 * listings, instead of only appearing after the client's useEffect fetch. */
export async function fetchBrowseSectionData(
  filters: { state?: string; region?: string; make?: string },
): Promise<BrowseSectionData> {
  const schema = await fetchSiteSchema();
  return loadBrowseCounts(fetchGroupCountsServer, fetchTotalServer, filters, subjectFieldsFor(schema.map((s) => s.field)));
}

export interface HomeLinkCounts {
  /** Listings per region Australia-wide; empty when unknown. */
  regionCounts: CountItem[];
  /** Listings per budget band (BUDGET_BANDS order); null = unknown. */
  priceCounts: (number | null)[];
}

/** Counts behind the home page's city and budget links, so none lead to an
 * empty page — links reappear by themselves once stock arrives. */
export async function fetchHomeLinkCounts(): Promise<HomeLinkCounts> {
  const [regionCounts, priceCounts] = await Promise.all([
    fetchGroupCountsServer("region", {}),
    Promise.all(BUDGET_BAND_PARAMS.map((band) => fetchTotalServer(band))),
  ]);
  return { regionCounts, priceCounts };
}
