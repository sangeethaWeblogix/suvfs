import type { FilterState } from "./StateFilterBar";
import { appendFilterParams } from "@/config/filterDefs";

/**
 * Shared scope-param builders for /api/params-count/ queries — used by both
 * StateFilterBar.tsx (client, live filter-change fetches) and page.tsx
 * (server, SSR seed for the initial mount) so the two always request the
 * exact same scope and never drift apart.
 */

/** Every active filter except make/model, as /params-count scope params.
 * Pass `make` to also scope by make (state/region counts for a chosen make). */
export function buildCountScope(filters: FilterState, make?: string): URLSearchParams {
  const params = new URLSearchParams();
  if (make)                      params.set("make", make);
  if (filters.condition)         params.set("condition", filters.condition);
  if (filters.state)             params.set("state", String(filters.state).toLowerCase());
  if (filters.region)            params.set("region", filters.region);
  if (filters.suburb)            params.set("suburb", filters.suburb);
  if (filters.pincode)           params.set("pincode", filters.pincode);
  if (filters.from_price)        params.set("from_price", String(filters.from_price));
  if (filters.to_price)          params.set("to_price", String(filters.to_price));
  if (filters.from_year)         params.set("from_year", String(filters.from_year));
  if (filters.to_year)           params.set("to_year", String(filters.to_year));
  if (filters.keyword)           params.set("keyword", filters.keyword);
  appendFilterParams(params, filters);
  return params;
}

/** Scope for a make-count query (make/model excluded — they're what group_by counts). */
export function buildMakeCountScope(filters: FilterState): URLSearchParams {
  return buildCountScope(filters);
}
