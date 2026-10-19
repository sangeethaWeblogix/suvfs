/**
 * Server-side fetch of initial pool data for SSR/ISR, via /api/pool-listings/.
 *
 * The parsed result is passed as `initialPool` to StateHome so the SSR HTML
 * contains real product listings from the first byte.
 */

import { site } from "@/config/sites";
import { Listing, SeoV2, bucketPoolResponse, bucketPoolResponseCombined } from "./listingShared";
import type { InitialPool } from "./home";
import type { FilterState } from "./StateFilterBar";
import { appendFilterParams } from "@/config/filterDefs";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || site.url;

/** Build the /api/pool-listings/ query string from the full FilterState. */
function buildApiParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams({ order_by: "default", per_page: "21", page: "1", seed: "1" });
  if (filters.state)              params.set("state",             String(filters.state));
  if (filters.region)             params.set("region",            String(filters.region));
  if (filters.category)           params.set("category",          String(filters.category));
  if (filters.condition)          params.set("condition",         String(filters.condition));
  if (filters.make)               params.set("make",              String(filters.make));
  if (filters.model)              params.set("model",             String(filters.model));
  if (filters.suburb)             params.set("suburb",            String(filters.suburb));
  if (filters.pincode)            params.set("pincode",           String(filters.pincode));
  if (filters.from_price)         params.set("from_price",        String(filters.from_price));
  if (filters.to_price)           params.set("to_price",          String(filters.to_price));
  if (filters.minKg)              params.set("from_atm",          String(filters.minKg));
  if (filters.maxKg)              params.set("to_atm",            String(filters.maxKg));
  if (filters.from_sleep)         params.set("from_sleep",        String(filters.from_sleep));
  if (filters.to_sleep)           params.set("to_sleep",          String(filters.to_sleep));
  if (filters.from_length)        params.set("from_length",       String(filters.from_length));
  if (filters.to_length)          params.set("to_length",         String(filters.to_length));
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
  try {
    const res = await fetch(`${APP_URL}/api/pool-listings/?${params.toString()}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.seo_v2 ?? json?.seo_v2 ?? null;
  } catch {
    return null;
  }
}

async function fetchFromApi(filters: FilterState): Promise<any | null> {
  try {
    const res = await fetch(`${APP_URL}/api/pool-listings/?${buildApiParams(filters).toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
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
