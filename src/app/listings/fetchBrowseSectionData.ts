import { normalizeCountItems } from "@/lib/countItems";
import type { CountItem, BrowseSectionData } from "./browseSectionShared";

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

/** Server-side mirror of StateBrowseSection's make-count fetch — run during
 * SSR/ISR so the Popular Manufacturers links land in the initial HTML instead
 * of only appearing after the client's useEffect fetch finishes. The other
 * browse rows come from the site's filter schema + facet counts. */
export async function fetchBrowseSectionData(
  filters: { state?: string; region?: string },
): Promise<BrowseSectionData> {
  const { state, region } = filters;
  const scope: Record<string, string> = {};
  if (state) scope.state = state;
  if (state && region) scope.region = region;
  const makeCounts = await fetchGroupCountsServer("make", scope);
  return { makeCounts };
}
