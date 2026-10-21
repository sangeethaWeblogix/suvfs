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
//               one drive type, or a year (single year or year band)
//   {price band}                                listed bands only, no location
// Everything else is noindex: condition, suburb, search, multi-value
// selections (7-or-8-plus-seats), other filters (fuel type, odometer, …),
// two subjects together (make + body size), unlisted price bands.
// Middleware still forces noindex when a page has no listings.
import { parseSlugToFilters } from "@/app/components/urlBuilder";

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
]);

/** Single-value filters that make an indexable page on their own or with a location. */
const SINGLE_VALUE_SUBJECTS = ["body_size", "seats", "drive_type"];

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

  // Multi-value selections (small-or-medium-body-size) are not indexed.
  if (SINGLE_VALUE_SUBJECTS.some((k) => String(f[k] ?? "").includes(","))) return false;

  // Price pages: listed bands only, Australia-wide only.
  if (hasPrice) return !hasLocation && INDEXABLE_PRICE_BANDS.has(priceSlug(f.from_price, f.to_price));

  return true;
}
