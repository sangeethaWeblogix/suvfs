// Car-site filters that are not part of the original caravan URL grammar.
// Mirrors `sites.cars.filter_defs` in the backend's
// mpn-product-engine/config/sites.json — the field / param names must match it.
// Which filters a site shows (and their labels/options) comes from the API's
// `filters_schema`; this file only knows how each one maps to a URL segment and
// to API query params, so middleware/edge code can parse URLs without an API call.
//
// URL segments (all lower-case, one per filter, emitted in FILTER_DEFS order):
//   multi        {value}[-or-{value}…]-{slug}   diesel-or-hybrid-fuel-type, 7-or-8-seats
//   range        under-{n}-{slug} | over-{n}-{slug} | between-{a}-{b}-{slug}
//   min_dropdown over-{n}-{slug}
// Decimals use "_" instead of "." (7_5-cargo-volume) so paths never look like file names.
// make/model, condition, state/region/suburb, price and search keep their existing
// segments (see components/urlBuilder.ts and components/slugBuilter.ts).

export type FilterControl = "multi" | "range" | "min_dropdown";

export type FilterDef =
  | { field: string; control: "multi"; slug: string; param: string }
  | { field: string; control: "range"; slug: string; params: [string, string] }
  | { field: string; control: "min_dropdown"; slug: string; param: string };

export const FILTER_DEFS: FilterDef[] = [
  { field: "body_type",              control: "multi",        slug: "body-type",              param: "body_type" },
  { field: "body_size",              control: "multi",        slug: "body-size",              param: "body_size" },
  { field: "year",                   control: "range",        slug: "year",                   params: ["from_year", "to_year"] },
  { field: "odometer",               control: "range",        slug: "odometer",               params: ["from_odometer", "to_odometer"] },
  { field: "fuel_type",              control: "multi",        slug: "fuel-type",              param: "fuel_type" },
  { field: "transmission",           control: "multi",        slug: "transmission",           param: "transmission" },
  { field: "drive_type",             control: "multi",        slug: "drive-type",             param: "drive_type" },
  { field: "cab_type",               control: "multi",        slug: "cab-type",               param: "cab_type" },
  { field: "tray_type",              control: "multi",        slug: "tray-type",              param: "tray_type" },
  { field: "wheelbase",              control: "multi",        slug: "wheelbase",              param: "wheelbase" },
  { field: "roof_height",            control: "multi",        slug: "roof-height",            param: "roof_height" },
  { field: "seats",                  control: "multi",        slug: "seats",                  param: "seats" },
  { field: "braked_towing_capacity", control: "min_dropdown", slug: "braked-towing-capacity", param: "from_braked_towing_capacity" },
  { field: "payload_weight",         control: "range",        slug: "payload-weight",         params: ["from_payload_weight", "to_payload_weight"] },
  { field: "engine_power",           control: "range",        slug: "engine-power",           params: ["from_engine_power", "to_engine_power"] },
  { field: "cargo_volume",           control: "range",        slug: "cargo-volume",           params: ["from_cargo_volume", "to_cargo_volume"] },
  { field: "battery_capacity",       control: "range",        slug: "battery-capacity",       params: ["from_battery_capacity", "to_battery_capacity"] },
  { field: "driving_range",          control: "min_dropdown", slug: "driving-range",          param: "from_driving_range" },
];

export const FILTER_DEF_BY_FIELD: Record<string, FilterDef> = Object.fromEntries(
  FILTER_DEFS.map((d) => [d.field, d]),
);

/** Every filter-state key this registry owns (e.g. fuel_type, from_odometer). */
export const FILTER_PARAM_KEYS: string[] = FILTER_DEFS.flatMap((d) =>
  d.control === "range" ? d.params : [d.param],
);

// Any filter object (FilterState, urlBuilder Filters, …) — read by key.
type FilterValues = Record<string, unknown>;
const asValues = (f: object) => f as FilterValues;

const NUM = String.raw`\d+(?:_\d+)?`;
const toUrlNum = (v: unknown) => String(v).replace(".", "_");
const fromUrlNum = (v: string) => v.replace("_", ".");
const present = (v: unknown) => v !== undefined && v !== null && String(v).trim() !== "";

// Multi values are already slugs. Seats used to have "8+" (8-plus-seats); it is
// now plain "8" — a stray "+" is dropped, and middleware 301s old -plus URLs.
const valueToSlug = (v: string) => v.trim().toLowerCase().replace(/\+$/, "");
const slugToValue = (v: string) => v;

/** Split a comma list ("diesel,hybrid") into trimmed, non-empty values. */
export function splitMulti(v: unknown): string[] {
  return present(v) ? String(v).split(",").map((s) => s.trim()).filter(Boolean) : [];
}

/**
 * Parse one URL path segment into filter values, or null when it is not one of
 * these filters (callers then try their own segment types).
 */
export function parseFilterSegment(segment: string): FilterValues | null {
  const part = segment.toLowerCase();
  for (const def of FILTER_DEFS) {
    const suffix = `-${def.slug}`;
    if (!part.endsWith(suffix)) continue;
    const body = part.slice(0, -suffix.length);
    if (!body) continue;

    if (def.control === "multi") {
      const values = body.split("-or-").map(slugToValue).filter(Boolean);
      return values.length ? { [def.param]: values.join(",") } : null;
    }

    const between = body.match(new RegExp(`^between-(${NUM})-(${NUM})$`));
    const over = body.match(new RegExp(`^over-(${NUM})$`));
    const under = body.match(new RegExp(`^under-(${NUM})$`));
    const exact = body.match(new RegExp(`^(${NUM})$`));

    if (def.control === "min_dropdown") {
      const n = over?.[1] ?? exact?.[1];
      return n ? { [def.param]: fromUrlNum(n) } : null;
    }

    const [fromKey, toKey] = def.params;
    if (between) return { [fromKey]: fromUrlNum(between[1]), [toKey]: fromUrlNum(between[2]) };
    if (over) return { [fromKey]: fromUrlNum(over[1]) };
    if (under) return { [toKey]: fromUrlNum(under[1]) };
    if (exact) return { [fromKey]: fromUrlNum(exact[1]), [toKey]: fromUrlNum(exact[1]) };
    return null;
  }
  return null;
}

/** URL path segments for the registry filters present in `f`, in canonical order. */
export function buildFilterSegments(filters: object): string[] {
  const f = asValues(filters);
  const segments: string[] = [];
  for (const def of FILTER_DEFS) {
    if (def.control === "multi") {
      const values = splitMulti(f[def.param]).map(valueToSlug).sort();
      if (values.length) segments.push(`${values.join("-or-")}-${def.slug}`);
    } else if (def.control === "min_dropdown") {
      if (present(f[def.param])) segments.push(`over-${toUrlNum(f[def.param])}-${def.slug}`);
    } else {
      const [fromKey, toKey] = def.params;
      const from = present(f[fromKey]) ? toUrlNum(f[fromKey]) : "";
      const to = present(f[toKey]) ? toUrlNum(f[toKey]) : "";
      if (from && to) segments.push(from === to ? `${from}-${def.slug}` : `between-${from}-${to}-${def.slug}`);
      else if (from) segments.push(`over-${from}-${def.slug}`);
      else if (to) segments.push(`under-${to}-${def.slug}`);
    }
  }
  return segments;
}

/**
 * Copy the registry filters from `f` onto API query params (multi values as
 * comma lists, as the API expects). Existing keys in `params` are overwritten.
 * `except` skips fields — facet requests leave out the field being counted.
 */
export function appendFilterParams(params: URLSearchParams, filters: object, except: string[] = []): URLSearchParams {
  const f = asValues(filters);
  for (const def of FILTER_DEFS) {
    if (except.includes(def.field)) continue;
    const keys = def.control === "range" ? def.params : [def.param];
    for (const key of keys) {
      if (present(f[key])) params.set(key, String(f[key]));
    }
  }
  return params;
}
