/**
 * Server-side fetch of initial pool data for SSR/ISR, straight from the
 * backend /pool API (the same request /api/pool-listings/ forwards).
 *
 * The parsed result is passed as `initialPool` to StateHome so the SSR HTML
 * contains real product listings from the first byte. If this returns null the
 * page renders an empty shell and only fills in client-side — crawlers then see
 * no H1, products or browse links.
 */

import { unstable_rethrow } from "next/navigation";
import { Listing, SeoV2, bucketPoolResponse, bucketPoolResponseCombined } from "./listingShared";
import type { InitialPool } from "./home";
import type { FilterState } from "./StateFilterBar";
import { appendFilterParams } from "@/config/filterDefs";
import { poolUrl } from "@/lib/apiBase";

const API_KEY = process.env.MPN_API_KEY;
const SERVER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";

/** GET the backend /pool directly. Previously this went through this site's own
 * public URL (${site.url}/api/pool-listings/) with cache: "no-store" inside a
 * try/catch: in production that request never produced data, so every
 * listings page was served as an empty shell. A cached fetch (allowed in both
 * ISR and dynamic renders) plus unstable_rethrow keeps Next's own render
 * control errors from being swallowed into a silent null. */
async function fetchPoolJson(params: URLSearchParams): Promise<any | null> {
  try {
    const res = await fetch(poolUrl(params.toString()), {
      headers: {
        Accept: "application/json",
        "User-Agent": SERVER_UA,
        ...(API_KEY ? { "X-Secret-Key": API_KEY } : {}),
      },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return null;
    const raw = await res.text();
    if (raw.includes("sgcaptcha") || raw.trimStart().startsWith("<html")) return null; // bot challenge page
    const jsonStart = raw.indexOf("{");
    return JSON.parse(jsonStart > 0 ? raw.slice(jsonStart) : raw);
  } catch (err) {
    unstable_rethrow(err);
    return null;
  }
}

/** Build the /api/pool-listings/ query string from the full FilterState. */
function buildApiParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams({ order_by: "default", per_page: "21", page: "1", seed: "1" });
  if (filters.state)              params.set("state",             String(filters.state));
  if (filters.region)             params.set("region",            String(filters.region));
  if (filters.condition)          params.set("condition",         String(filters.condition));
  if (filters.make)               params.set("make",              String(filters.make));
  if (filters.model)              params.set("model",             String(filters.model));
  if (filters.suburb)             params.set("suburb",            String(filters.suburb));
  if (filters.pincode)            params.set("pincode",           String(filters.pincode));
  if (filters.from_price)         params.set("from_price",        String(filters.from_price));
  if (filters.to_price)           params.set("to_price",          String(filters.to_price));
  if (filters.from_year)  params.set("from_year", String(filters.from_year));
  if (filters.to_year)    params.set("to_year",   String(filters.to_year));
  if (filters.keyword) {
    const kw = String(filters.keyword).replace(/\+/g, " ").trim().replace(/\s+/g, " ");
    if (kw) params.set("search", kw);
  }
  appendFilterParams(params, filters);
  return params;
}

/** Parse a raw /pool JSON response (already bucketed server-side into
 * featured/new/used/premium/exclusive) into the InitialPool shape. */
function parsePoolJson(json: any, isIndexed: boolean): InitialPool | null {
  const total = json?.counts?.total ?? json?.pagination?.total_products ?? 0;
  const hasAnyProducts =
    total > 0 ||
    (json?.featured_products ?? []).length > 0 ||
    (json?.premium_products ?? []).length > 0 ||
    (json?.exclusive_products ?? []).length > 0;
  if (!hasAnyProducts) return null;

  if (isIndexed) {
    const { featured, new: newItems, used: usedItems, seo, totalPages } = bucketPoolResponse(json);
    return { seo, featured, new: newItems, used: usedItems, maxPages: totalPages, isIndexed };
  }

  const { combined, seo, totalPages } = bucketPoolResponseCombined(json);
  return { seo, featured: combined, new: [], used: [], maxPages: totalPages, isIndexed };
}

/** Server-side counterpart of home.tsx's newSeo/usedSeo effect — fetches the
 * condition-locked seo_v2 (heading/description for the New/Used grid headings)
 * so the client can skip that redundant mount-time fetch entirely. */
async function fetchConditionSeoV2(
  filters: FilterState,
  condition: "New" | "Used"
): Promise<SeoV2 | null> {
  const params = buildApiParams({ ...filters, condition });
  params.set("per_page", "1");
  const json = await fetchPoolJson(params);
  return json?.data?.seo_v2 ?? json?.seo_v2 ?? null;
}

function fetchFromApi(filters: FilterState): Promise<any | null> {
  return fetchPoolJson(buildApiParams(filters));
}

/** Fetch the initial pool for SSR/ISR rendering. */
export async function fetchInitialPool(
  filters: FilterState,
  isIndexed = true
): Promise<InitialPool | null> {
  const apiJson = await fetchFromApi(filters);
  const parsed = apiJson ? parsePoolJson(apiJson, isIndexed) : null;

  if (!parsed) {
    console.log(`[fetchInitialPool] API failed for filters: ${JSON.stringify(filters)}`);
    return null;
  }
  console.log(`[fetchInitialPool] API OK (${parsed.featured.length + parsed.new.length + parsed.used.length} products)`);

  // Condition-locked New/Used seo_v2 for the grid headings — indexed pages
  // only (non-indexed pages render one combined grid with no New/Used
  // headings). Fetched here so the client never needs its own mount-time
  // /api/pool-listings/?condition=New|Used round trip for this text.
  if (isIndexed) {
    const [newSeo, usedSeo] = await Promise.all([
      fetchConditionSeoV2(filters, "New"),
      fetchConditionSeoV2(filters, "Used"),
    ]);
    parsed.newSeo = newSeo;
    parsed.usedSeo = usedSeo;
  }

  return parsed;
}
