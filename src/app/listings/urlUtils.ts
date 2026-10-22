import { parseSlugToFilters } from "@/app/components/urlBuilder";
import { buildSlugFromFilters } from "@/app/components/slugBuilter";
import { toSlug } from "@/utils/seo/slug";
import { appendFilterParams } from "@/config/filterDefs";
import type { FilterState } from "./StateFilterBar";

const ORDERBY = "default";

/** Builds a pool-listings query string — shared by the client grids (home.tsx)
 * and the server-side generateMetadata fetch (page.tsx) so both hit the exact
 * same filter/lock combination and get back the exact same seo_v2. */
export function buildApiUrl(base: string, filters: FilterState, seed: number, lockCondition?: string): string {
  const params = new URLSearchParams();
  params.set("order_by", ORDERBY);
  params.set("seed", String(seed));
  if (filters.state)              params.set("state",              filters.state);
  if (filters.make)               params.set("make",               filters.make);
  if (filters.model)              params.set("model",              filters.model);
  if (filters.region)             params.set("region",             filters.region);
  if (filters.suburb)             params.set("suburb",             filters.suburb);
  if (filters.pincode)            params.set("pincode",            filters.pincode);
  if (filters.suburb && filters.radius_kms) params.set("radius_kms", String(filters.radius_kms));
  if (filters.from_price)         params.set("from_price",         String(filters.from_price));
  if (filters.to_price)           params.set("to_price",           String(filters.to_price));
  if (filters.from_year)  params.set("from_year",  String(filters.from_year));
  if (filters.to_year)    params.set("to_year",    String(filters.to_year));
  // Backend free-text search only recognizes `search` (see production's
  // fetchListings) — not `keyword`. Sending `keyword` here silently no-ops
  // and the pool call falls back to the full unfiltered listing set.
  if (filters.keyword) {
    const normalized = String(filters.keyword).replace(/\+/g, " ").trim().replace(/\s+/g, " ");
    if (normalized) params.set("search", normalized);
  }
  if (!lockCondition && filters.condition) params.set("condition", filters.condition);
  if (lockCondition) params.set("condition", lockCondition);
  appendFilterParams(params, filters);
  return `${base}&${params.toString()}`;
}

/** Real /listings/ URL for a "View all" link — keeps the active filters
 * (e.g. make + state) and optionally locks the condition segment, so
 * the Featured/New/Used sections each link to the matching filtered page. */
export function buildListingsSlug(filters: FilterState, conditionOverride?: string): string {
  const { keyword, condition, ...rest } = filters;
  const shared = { ...rest, search: keyword || undefined, condition: conditionOverride ?? condition };
  const path = buildSlugFromFilters(shared);
  return path.endsWith("/") ? path : `${path}/`;
}

export const toTitleCase = (s: string) => s.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const stripLocationSuffix = (v: string) => toSlug(v.replace(/-state|-region|-suburb/g, "").trim());

/** Cross-site "Explore Other Vehicle Options" target — driven only by
 * state/region (every other active filter is ignored, per the 3-tier rule):
 * no state → the sister site's Australia-wide /listings/; state only → that
 * state's page; state + region → that region's page. */
export function buildExploreTravelTarget(filters: FilterState): { path: string; label: string } {
  const state = filters.state ? stripLocationSuffix(filters.state) : "";
  const region = filters.region ? stripLocationSuffix(filters.region) : "";
  if (state && region) {
    return { path: `/listings/${state}-state/${region}-region/`, label: toTitleCase(region) };
  }
  if (state) {
    return { path: `/listings/${state}-state/`, label: toTitleCase(state) };
  }
  return { path: "/listings/", label: "Australia" };
}

export interface FilterBreadcrumb {
  label: string;
  /** Direct link to the page for just this one filter dimension (e.g. the
   * make crumb links straight to /listings/toyota/), not the combination of
   * every active filter. */
  href: string;
}

/** Priority order for the visible breadcrumb trail — Home > Listings > up to
 * three of these, in this fixed order, regardless of the order the user
 * actually applied the filters in. `label` reads the display text; `hrefFilters`
 * picks out just the filter keys for this dimension so the crumb links to its
 * own dedicated page instead of the full active-filter combination. */
const BREADCRUMB_PRIORITY: Array<{
  label: (f: FilterState) => string | null;
  hrefFilters: (f: FilterState) => FilterState;
}> = [
  {
    label: (f) => {
      const raw = f.suburb || f.region || f.state;
      return raw ? toTitleCase(String(raw)) : null;
    },
    hrefFilters: (f) => ({ state: f.state, region: f.region, suburb: f.suburb, pincode: f.pincode }),
  },
  {
    label: (f) => (f.make ? toTitleCase(String(f.make)) : null),
    hrefFilters: (f) => ({ make: f.make }),
  },
  {
    label: (f) => {
      if (!f.from_price && !f.to_price) return null;
      if (f.from_price && f.to_price) return `$${Number(f.from_price).toLocaleString()} – $${Number(f.to_price).toLocaleString()}`;
      if (f.from_price) return `From $${Number(f.from_price).toLocaleString()}`;
      return `Upto $${Number(f.to_price).toLocaleString()}`;
    },
    hrefFilters: (f) => ({ from_price: f.from_price, to_price: f.to_price }),
  },
  {
    label: (f) => {
      if (!f.from_year && !f.to_year) return null;
      if (f.from_year && f.to_year) return `${f.from_year} – ${f.to_year}`;
      if (f.from_year) return `From ${f.from_year}`;
      return `Upto ${f.to_year}`;
    },
    hrefFilters: (f) => ({ from_year: f.from_year, to_year: f.to_year }),
  },
  {
    label: (f) => (f.condition ? (f.condition.toLowerCase() === "new" ? "New" : "Used") : null),
    hrefFilters: (f) => ({ condition: f.condition }),
  },
];

/** Home > {Site} for Sale > up to 3 active filters — always rendered in
 * BREADCRUMB_PRIORITY order (Location, Make, Price, Year, Condition) so the
 * trail reads the same regardless of which filters the visitor picked or in
 * what order. Each crumb links straight to its own single-filter page (e.g.
 * clicking "Toyota" goes to /listings/toyota/, not the combined-filter URL). */
export function buildFilterBreadcrumbs(filters: FilterState): FilterBreadcrumb[] {
  const crumbs: FilterBreadcrumb[] = [];
  for (const entry of BREADCRUMB_PRIORITY) {
    const label = entry.label(filters);
    if (label) {
      crumbs.push({ label, href: buildListingsSlug(entry.hrefFilters(filters)) });
    }
    if (crumbs.length === 3) break;
  }
  return crumbs;
}

export function parseDemoFilters(
  slugParts: string[],
  query: Record<string, string | string[] | undefined>
): FilterState {
  const { search, condition, ...rest } = parseSlugToFilters(slugParts, query);
  const filters: FilterState = { ...rest };
  if (search) filters.keyword = search;
  if (condition) filters.condition = condition.toLowerCase();
  return filters;
}
