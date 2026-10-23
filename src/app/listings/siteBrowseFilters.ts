import { buildFilterSegments } from "@/config/filterDefs";
import { site } from "@/config/sites";
import { SINGLE_VALUE_SUBJECTS, isIndexableListingPath } from "@/utils/seo/indexRules";
import type { SchemaItem } from "./SiteFilters";
import {
  BatteryCharging,
  CalendarDays,
  CarFront,
  Factory,
  Fuel,
  Gauge,
  Ruler,
  Route,
  Settings2,
  Truck,
  Users,
  WalletCards,
  Weight,
  type LucideIcon,
} from "lucide-react";

export type BrowseFilterItem = { text: string; href: string };
export type BrowseFilterRow = {
  field: string;
  icon: LucideIcon;
  label: string;
  items: BrowseFilterItem[];
};

/** Facet counts from GET /car-sites/{site}/filters:
 *  { years: {year: n}, price: {min, max}, <multi field>: {value: n}, <range field>: {min, max}, buckets: {field: {value: n}} }. */
export type SiteFacets = Record<string, any>;

// The indexable price bands (INDEXABLE_PRICE_BANDS in utils/seo/indexRules.ts),
// so budget links only ever lead to indexed pages.
const BUDGET_BANDS = [
  { text: "Under $10,000", href: "/listings/under-10000/", from: 0, to: 10000 },
  { text: "$10,000 – $20,000", href: "/listings/between-10000-20000/", from: 10000, to: 20000 },
  { text: "$20,000 – $30,000", href: "/listings/between-20000-30000/", from: 20000, to: 30000 },
  { text: "$30,000 – $40,000", href: "/listings/between-30000-40000/", from: 30000, to: 40000 },
  { text: "$40,000 – $50,000", href: "/listings/between-40000-50000/", from: 40000, to: 50000 },
  { text: "$50,000 – $70,000", href: "/listings/between-50000-70000/", from: 50000, to: 70000 },
  { text: "$70,000 – $80,000", href: "/listings/between-70000-80000/", from: 70000, to: 80000 },
  { text: "$80,000 – $100,000", href: "/listings/between-80000-100000/", from: 80000, to: 100000 },
  { text: "Over $100,000", href: "/listings/over-100000/", from: 100000, to: Infinity },
];

/** {min, max} for a range facet, or null when the API didn't send one. */
function facetRange(facets: SiteFacets | null | undefined, key: string): { min: number; max: number } | null {
  const bucket = facets?.[key];
  if (!bucket || typeof bucket !== "object") return null;
  const min = Number(bucket.min);
  const max = Number(bucket.max);
  return Number.isFinite(min) && Number.isFinite(max) ? { min, max } : null;
}

/** API price params per budget band, in BUDGET_BANDS order — for counting each band's listings. */
export const BUDGET_BAND_PARAMS: Record<string, string>[] = BUDGET_BANDS.map((band) => ({
  ...(band.from > 0 && { from_price: String(band.from) }),
  ...(Number.isFinite(band.to) && { to_price: String(band.to) }),
}));

/** Budget bands, minus those outside the site's actual price range and — when
 *  `bandCounts` (listings per band in this location, BUDGET_BANDS order) is
 *  known — those with no listings, whose pages are noindex. */
export function budgetRow(facets?: SiteFacets | null, bandCounts?: (number | null)[] | null): BrowseFilterRow {
  const price = facetRange(facets, "price");
  return {
    field: "price",
    icon: WalletCards,
    label: "By Budget",
    items: BUDGET_BANDS
      .filter((band, i) =>
        (!price || (band.to >= price.min && band.from <= price.max)) && (bandCounts?.[i] ?? 1) > 0)
      .map(({ text, href }) => ({ text, href })),
  };
}

export const BUDGET_ROW: BrowseFilterRow = budgetRow();

// Home page "Search … Your Way" rows after Budget and Year, most-searched
// first. Only filters each site indexes (utils/seo/indexRules.ts) — rows link
// to indexed pages only, so odometer, payload, engine power, battery and
// range are never rows.
export const SITE_FILTER_PRIORITIES: Record<string, string[]> = {
  suv: ["drive_type", "seats", "body_size", "make"],
  utes: ["cab_type", "drive_type", "fuel_type", "make"],
  peoplemovers: ["seats", "body_size", "make"],
  sedans: ["body_size", "fuel_type", "drive_type", "make"],
  hatchbacks: ["body_size", "fuel_type", "make"],
  wagons: ["drive_type", "fuel_type", "body_size", "make"],
  coupes: ["drive_type", "seats", "make"],
  convertibles: ["drive_type", "seats", "make"],
  vans: ["fuel_type", "seats", "make"],
  "4x4": ["body_type", "make", "fuel_type", "seats"],
  electric: ["body_type", "body_size", "drive_type", "make"],
  hybrid: ["body_type", "fuel_type", "drive_type", "seats", "make"],
};

/** A home page row needs at least this many links — a lone chip ("Manual")
 * reads as a broken row. Rows fill out as stock grows. */
const MIN_ROW_ITEMS = 2;

const FILTER_ICONS: Record<string, LucideIcon> = {
  year: CalendarDays,
  body_type: CarFront,
  body_size: CarFront,
  fuel_type: Fuel,
  transmission: Settings2,
  drive_type: Gauge,
  cab_type: Truck,
  wheelbase: Ruler,
  roof_height: Ruler,
  seats: Users,
  braked_towing_capacity: Weight,
  payload_weight: Weight,
  engine_power: Gauge,
  cargo_volume: Truck,
  battery_capacity: BatteryCharging,
  driving_range: Route,
};

function listingHref(values: Record<string, string | number>): string {
  return `/listings/${buildFilterSegments(values).join("/")}/`;
}

function formatValue(value: number, unit?: string): string {
  const text = value.toLocaleString("en-AU");
  if (!unit) return text;
  if (unit === "AUD") return `$${text}`;
  return `${text} ${unit.replace("m3", "m³")}`;
}

/** Listing count for one multi option, or undefined when the API sent no counts for the field. */
function multiCount(facets: SiteFacets | null | undefined, field: string, value: string, label: string): number | undefined {
  const bucket = facets?.[field];
  if (!bucket || typeof bucket !== "object" || "min" in bucket) return undefined;
  // "8+" seats is counted under "8" by the API.
  return bucket[value] ?? bucket[label] ?? bucket[label.toLowerCase()] ?? bucket[value.replace(/\+$/, "")] ?? 0;
}

/** Fewest listings an option needs to get a browse link. Below this the page is
 *  thin and usually a mis-tagged listing (e.g. a 1961 Kombi counted as a
 *  3-seat SUV), so it isn't worth linking. The filter bar still offers it. */
const MIN_BROWSE_LISTINGS = 5;

/** Browse chips for one schema filter. With `facets`, chips that would lead to
 *  an empty or near-empty listing page are dropped (e.g. "3 seats" on the SUV site). */
export function schemaItems(item: SchemaItem, facets?: SiteFacets | null): BrowseFilterItem[] {
  if (item.control === "multi") {
    return item.options
      .map((option, index) => ({ text: String(option), value: String(item.values?.[index] ?? option).toLowerCase() }))
      .filter(({ text, value }) => (multiCount(facets, item.field, value, text) ?? MIN_BROWSE_LISTINGS) >= MIN_BROWSE_LISTINGS)
      .slice(0, 7)
      .map(({ text, value }) => ({ text, href: listingHref({ [item.param]: value }) }));
  }

  if (item.control === "min_dropdown") {
    const counts = facets?.buckets?.[item.field];
    const available = counts ? item.options.filter((value) => Number(counts[value] ?? 0) > 0) : item.options;
    const options = available.length > 5
      ? available.filter((_, index) => index % Math.ceil(available.length / 5) === 0).slice(0, 5)
      : available;
    return options.map((value) => ({
      text: `${formatValue(value, item.unit)}+`,
      href: listingHref({ [item.param]: value }),
    }));
  }

  if (item.control === "range") {
    const [fromParam, toParam] = item.params;
    if (item.field === "year") {
      // Single years only — year ranges are noindex (utils/seo/indexRules.ts).
      // The most recent years with enough listings, newest first.
      const max = Math.floor(item.max);
      const years = facets?.years as Record<string, number> | undefined;
      const recent = Array.from({ length: 12 }, (_, i) => max - i)
        .filter((year) => !years || Number(years[year] ?? 0) >= MIN_BROWSE_LISTINGS)
        .slice(0, 8);
      return recent.map((year) => ({
        text: String(year),
        href: listingHref({ [fromParam]: year, [toParam]: year }),
      }));
    }

    // Band the values actually listed (facet min/max) rather than the schema's
    // nominal range — e.g. ute payloads run 655–4,500 kg, not 0–1,500 kg.
    const actual = facetRange(facets, item.field);
    const { min, max } = actual && actual.max > actual.min ? actual : item;
    const span = max - min;
    const round = (value: number) =>
      Math.round(value / Math.max(item.step, 1)) * Math.max(item.step, 1);
    const q1 = round(min + span * 0.25);
    const q2 = round(min + span * 0.5);
    const q3 = round(min + span * 0.75);
    if (!(q1 < q2 && q2 < q3)) return [];
    return [
      { text: `Under ${formatValue(q1, item.unit)}`, values: { [toParam]: q1 } },
      { text: `${formatValue(q1, item.unit)} – ${formatValue(q2, item.unit)}`, values: { [fromParam]: q1, [toParam]: q2 } },
      { text: `${formatValue(q2, item.unit)} – ${formatValue(q3, item.unit)}`, values: { [fromParam]: q2, [toParam]: q3 } },
      { text: `${formatValue(q3, item.unit)}+`, values: { [fromParam]: q3 } },
    ].map(({ text, values }) => ({ text, href: listingHref(values) }));
  }

  return [];
}

export function buildSiteFilterRows(schema: SchemaItem[], facets?: SiteFacets | null): BrowseFilterRow[] {
  const fallbackYear: SchemaItem = {
    field: "year",
    label: "Year",
    control: "range",
    params: ["from_year", "to_year"],
    min: 1980,
    max: new Date().getFullYear(),
    step: 1,
  };
  const year = schema.find((item) => item.field === "year") ?? fallbackYear;
  const rows = (SITE_FILTER_PRIORITIES[site.key] ?? ["fuel_type", "transmission"])
    .map((field) => {
      if (field === "make") return makeRow(facets);
      const item = schema.find((s) => s.field === field);
      return item ? toRow(item, facets) : null;
    })
    .filter((row): row is BrowseFilterRow => Boolean(row))
    // Link indexed pages only (e.g. 4x4 body type: ute/SUV/wagon/van, not
    // hatchback) — internal links should pass weight to pages Google keeps.
    .map((row) => ({ ...row, items: row.items.filter((i) => isIndexableListingPath(i.href)) }))
    .filter((row) => row.items.length >= MIN_ROW_ITEMS);

  return [toRow(year, facets), ...rows].filter((row) => row.items.length > 0);
}

// Make slugs whose display name isn't just the title-cased slug.
const MAKE_NAMES: Record<string, string> = {
  bmw: "BMW", byd: "BYD", gac: "GAC", gwm: "GWM", kgm: "KGM", ldv: "LDV", mg: "MG",
  "mercedes-benz": "Mercedes-Benz", ssangyong: "SsangYong",
};

function makeName(slug: string): string {
  return MAKE_NAMES[slug] ?? slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

/** The site's most-listed makes, linking to their (indexable) make pages. */
function makeRow(facets?: SiteFacets | null): BrowseFilterRow {
  const makes = facets?.makes && typeof facets.makes === "object" ? facets.makes : {};
  return {
    field: "make",
    icon: Factory,
    label: "By Make",
    items: Object.entries(makes as Record<string, number>)
      .filter(([, count]) => Number(count) >= MIN_BROWSE_LISTINGS)
      .sort(([, a], [, b]) => Number(b) - Number(a))
      .slice(0, 10)
      .map(([slug]) => ({ text: makeName(slug), href: `/listings/${slug}/` })),
  };
}

function toRow(item: SchemaItem, facets?: SiteFacets | null): BrowseFilterRow {
  return {
    field: item.field,
    icon: FILTER_ICONS[item.field] ?? Settings2,
    label: `By ${item.label}`,
    items: schemaItems(item, facets),
  };
}

/** Rows for the listings browse section: only filters that make an indexable
 * page alone or with a location (drive type, seats, body size — this site's
 * priorities first), then year. */
export function buildIndexableBrowseRows(schema: SchemaItem[], facets?: SiteFacets | null): BrowseFilterRow[] {
  const priorities = SITE_FILTER_PRIORITIES[site.key] ?? [];
  const fields = [...new Set([...priorities, ...SINGLE_VALUE_SUBJECTS])]
    .filter((field) => SINGLE_VALUE_SUBJECTS.includes(field));
  const year = buildSiteFilterRows(schema, facets).find((row) => row.field === "year");
  return [
    ...fields
      .map((field) => schema.find((item) => item.field === field))
      .filter((item): item is SchemaItem => Boolean(item))
      .map((item) => toRow(item, facets)),
    ...(year ? [year] : []),
  ].filter((row) => row.items.length > 0);
}

/** Prefixes a /listings/ href with the state (and region) segments. */
export function scopeBrowseHref(href: string, state?: string, region?: string): string {
  if (!state) return href;
  const slug = (value: string) => value.trim().toLowerCase().replace(/ /g, "-");
  const location = `${slug(state)}-state${region ? `/${slug(region)}-region` : ""}`;
  return `/listings/${location}${href.replace("/listings", "")}`;
}
