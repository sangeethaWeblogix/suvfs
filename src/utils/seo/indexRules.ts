// Edge-runtime-safe: no fs, path, or process.cwd()
//
// Which /listings/ pages search engines may index — the car-site rules that
// replace the caravan-era url.csv allowlist. Used for both the X-Robots-Tag
// header (middleware) and <meta name="robots"> (utils/seo/meta.ts).
//
// Indexed:
//   /listings/                                  all listings
//   {state} | {state}/{region}                  location pages
//   {subject} | {state}/{subject} | {state}/{region}/{subject}
//     subject = make, make/model, one body size, one seats value,
//               one drive type, a single year (2024-year),
//               or a listed price band (INDEXABLE_PRICE_BANDS)
//     plus each site's own extras in SITE_INDEX_RULES (e.g. 4x4: one body
//               type, fuel type, dual cab, under-$15,000/$25,000).
// Everything else is noindex: year ranges (between-2020-2023-year, before
// 2015), condition (the boss has other plans for it), suburb, search,
// multi-value selections (7-or-8-seats), other filters (odometer, towing, …),
// two subjects together (make + body size), unlisted price bands.
// Middleware still forces noindex when a page has no listings.
import { parseSlugToFilters } from "@/app/components/urlBuilder";
import { site } from "@/config/sites";

/** Per-site additions to the shared rules: extra single-value filters (each
 * limited to the listed values) and extra price pages. */
type SiteIndexRules = {
  subjects: Record<string, string[]>;
  priceBands?: string[];
};

// From "4x4 Search Keywords & Proposed Index Rules" (23 Oct 2026): what
// Australians search when buying a 4x4, each alone or with a state/region.
const FOUR_BY_FOUR_INDEX_RULES: SiteIndexRules = {
  subjects: {
    body_type: ["ute", "suv", "wagon", "van"],
    fuel_type: ["diesel", "petrol", "hybrid", "plug-in-hybrid", "electric"],
    cab_type: ["dual-cab"],
  },
  priceBands: ["under-15000", "under-25000"],
};

// 4wdforsale.com.au (touring / family 4WDs, added 24 Oct 2026): "7 seater
// 4wd", "4wd suv", "4wd wagon", "diesel 4wd", "cheap 4wd". Seats are
// already a shared subject. Since 26 Oct 2026 the site is 4WD only (AWD has
// its own site) and has no drive type filter.
const FOUR_WD_INDEX_RULES: SiteIndexRules = {
  subjects: {
    body_type: ["suv", "wagon", "people-mover"],
    fuel_type: ["diesel", "petrol", "hybrid"],
  },
  priceBands: ["under-15000", "under-25000"],
};

// awdforsale.com.au (every AWD car, added 26 Oct 2026): "awd suv", "awd
// wagon", "awd hatchback", "awd sedan", "awd hybrid", "electric awd",
// "cheap awd". Body size and seats are already shared subjects.
const AWD_INDEX_RULES: SiteIndexRules = {
  subjects: {
    body_type: ["suv", "wagon", "hatchback", "sedan", "ute"],
    fuel_type: ["petrol", "diesel", "hybrid", "plug-in-hybrid", "electric"],
  },
  priceBands: ["under-15000", "under-25000"],
};

// The rest are from "Car Sites Search Keywords & Index Rules" (23 Oct 2026):
// values Australians search on Google, whatever today's listing counts (the
// backend imports stock daily; pages with 0 listings are noindex anyway).
// Automatic transmission is left out everywhere: over 90% of listings are
// automatic, so its page would repeat the site's main listings page.
const UTES_INDEX_RULES: SiteIndexRules = {
  subjects: {
    cab_type: ["dual-cab", "single-cab"],
    tray_type: ["cab-chassis"],
    fuel_type: ["diesel", "hybrid", "plug-in-hybrid"],
    transmission: ["manual"],
  },
  priceBands: ["under-15000", "under-25000"],
};

const VANS_INDEX_RULES: SiteIndexRules = {
  subjects: {
    fuel_type: ["diesel", "electric"],
    wheelbase: ["long"],
    roof_height: ["high"],
  },
  priceBands: ["under-15000", "under-25000"],
};

const SEDANS_INDEX_RULES: SiteIndexRules = {
  subjects: {
    fuel_type: ["electric", "hybrid"],
  },
  priceBands: ["under-15000", "under-25000"],
};

const COUPES_INDEX_RULES: SiteIndexRules = {
  subjects: {
    transmission: ["manual"],
  },
  priceBands: ["under-15000", "under-25000"],
};

const CONVERTIBLES_INDEX_RULES: SiteIndexRules = {
  subjects: {
  },
  priceBands: ["under-15000", "under-25000"],
};

const PEOPLEMOVERS_INDEX_RULES: SiteIndexRules = {
  subjects: {
  },
};

const HATCHBACKS_INDEX_RULES: SiteIndexRules = {
  subjects: {
    fuel_type: ["electric", "hybrid"],
    transmission: ["manual"],
  },
  priceBands: ["under-15000", "under-25000"],
};

const WAGONS_INDEX_RULES: SiteIndexRules = {
  subjects: {
    fuel_type: ["diesel", "hybrid"],
  },
  priceBands: ["under-15000", "under-25000"],
};

const ELECTRIC_INDEX_RULES: SiteIndexRules = {
  subjects: {
    body_type: ["suv", "hatchback", "wagon", "van", "sedan"],
  },
  priceBands: ["under-25000"],
};

const HYBRID_INDEX_RULES: SiteIndexRules = {
  subjects: {
    body_type: ["suv", "wagon", "ute", "hatchback"],
    fuel_type: ["hybrid", "plug-in-hybrid"],
  },
  priceBands: ["under-15000", "under-25000"],
};

/** Site key → its own index rules. */
const SITE_INDEX_RULES: Record<string, SiteIndexRules> = {
  "4x4": FOUR_BY_FOUR_INDEX_RULES,
  "4wd": FOUR_WD_INDEX_RULES,
  awd: AWD_INDEX_RULES,
  utes: UTES_INDEX_RULES,
  vans: VANS_INDEX_RULES,
  sedans: SEDANS_INDEX_RULES,
  hatchbacks: HATCHBACKS_INDEX_RULES,
  wagons: WAGONS_INDEX_RULES,
  electric: ELECTRIC_INDEX_RULES,
  hybrid: HYBRID_INDEX_RULES,
  coupes: COUPES_INDEX_RULES,
  convertibles: CONVERTIBLES_INDEX_RULES,
  peoplemovers: PEOPLEMOVERS_INDEX_RULES,
};

const siteIndexRules: SiteIndexRules = SITE_INDEX_RULES[site.key] ?? { subjects: {} };

export const INDEXABLE_PRICE_BANDS = new Set([
  "under-10000",
  "between-10000-20000",
  "between-20000-30000",
  "between-30000-40000",
  "between-40000-50000",
  "between-50000-70000",
  "between-70000-80000",
  "between-80000-100000",
  "over-100000",
  // "Under $X" for the price dropdown values up to $100,000 (SiteFilters.tsx PRICE_OPTIONS).
  ...[10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000].map((n) => `under-${n}`),
  ...(siteIndexRules.priceBands ?? []),
]);

/** Single-value schema filters (body size, seats, …) that make an indexable page
 * on their own or with a location — this site's extras included. */
export const SINGLE_VALUE_SUBJECTS = [
  "body_size", "seats", "drive_type",
  ...Object.keys(siteIndexRules.subjects),
];

/** Every filter key an indexable URL may carry. Any other key → noindex. */
const ALLOWED_KEYS = new Set([
  "state", "region",
  "make", "model",
  "from_price", "to_price",
  "from_year", "to_year",
  ...SINGLE_VALUE_SUBJECTS,
]);

const present = (v: unknown) => v !== undefined && v !== null && String(v).trim() !== "";

function priceSlug(from: unknown, to: unknown): string {
  if (present(from) && present(to)) return `between-${from}-${to}`;
  if (present(from)) return `over-${from}`;
  return `under-${to}`;
}

/** True when the /listings/ path (with or without trailing slash) should be indexed. */
export function isIndexableListingPath(pathname: string): boolean {
  const path = pathname.split("?")[0];
  if (path !== path.toLowerCase()) return false;

  const slugParts = path.replace(/^\/listings/, "").split("/").filter(Boolean);
  if (slugParts.length === 0) return true;

  const f = parseSlugToFilters(slugParts);
  const keys = Object.keys(f).filter((k) => present(f[k]));
  if (keys.some((k) => !ALLOWED_KEYS.has(k))) return false;

  const hasLocation = present(f.state);
  if (present(f.region) && !hasLocation) return false;

  const hasPrice = present(f.from_price) || present(f.to_price);
  const subjects = [
    present(f.make),
    hasPrice,
    present(f.from_year) || present(f.to_year),
    ...SINGLE_VALUE_SUBJECTS.map((k) => present(f[k])),
  ].filter(Boolean).length;
  if (subjects > 1) return false;
  if (present(f.model) && !present(f.make)) return false;

  // Years: a single year only (2024-year), never a range.
  if ((present(f.from_year) || present(f.to_year)) && String(f.from_year) !== String(f.to_year)) return false;

  // Multi-value selections (small-or-medium-body-size) are not indexed.
  if (SINGLE_VALUE_SUBJECTS.some((k) => String(f[k] ?? "").includes(","))) return false;

  // Site extras index only their listed values (e.g. dual cab, not single cab).
  for (const [key, values] of Object.entries(siteIndexRules.subjects)) {
    if (present(f[key]) && !values.includes(String(f[key]).toLowerCase())) return false;
  }

  // Price pages: listed bands only.
  if (hasPrice) return INDEXABLE_PRICE_BANDS.has(priceSlug(f.from_price, f.to_price));

  return true;
}
