import { buildFilterSegments } from "@/config/filterDefs";
import { site } from "@/config/sites";
import type { SchemaItem } from "./SiteFilters";
import {
  BatteryCharging,
  CalendarDays,
  CarFront,
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

const BUDGET_BANDS = [
  { text: "Under $30,000", href: "/listings/under-30000/", from: 0, to: 30000 },
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

/** Budget bands, minus those outside the site's actual price range. */
export function budgetRow(facets?: SiteFacets | null): BrowseFilterRow {
  const price = facetRange(facets, "price");
  return {
    field: "price",
    icon: WalletCards,
    label: "By Budget",
    items: BUDGET_BANDS
      .filter((band) => !price || (band.to >= price.min && band.from <= price.max))
      .map(({ text, href }) => ({ text, href })),
  };
}

export const BUDGET_ROW: BrowseFilterRow = budgetRow();

export const SITE_FILTER_PRIORITIES: Record<string, string[]> = {
  suv: ["drive_type", "seats", "body_size"],
  utes: ["cab_type", "payload_weight", "drive_type"],
  peoplemovers: ["seats", "body_size", "fuel_type"],
  sedans: ["body_size", "transmission", "odometer"],
  hatchbacks: ["body_size", "transmission", "odometer"],
  wagons: ["drive_type", "cargo_volume", "odometer"],
  coupes: ["transmission", "engine_power", "odometer"],
  convertibles: ["transmission", "engine_power", "odometer"],
  vans: ["wheelbase", "roof_height", "payload_weight"],
  "4x4": ["drive_type", "braked_towing_capacity", "seats"],
  electric: ["driving_range", "battery_capacity", "body_type"],
  hybrid: ["body_type", "drive_type", "odometer"],
};

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

/** Browse chips for one schema filter. With `facets`, chips that would lead to
 *  an empty listing page are dropped (e.g. "2 seats" on the SUV site). */
export function schemaItems(item: SchemaItem, facets?: SiteFacets | null): BrowseFilterItem[] {
  if (item.control === "multi") {
    return item.options
      .map((option, index) => ({ text: String(option), value: String(item.values?.[index] ?? option).toLowerCase() }))
      .filter(({ text, value }) => (multiCount(facets, item.field, value, text) ?? 1) > 0)
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
      const max = Math.floor(item.max);
      const bands = [
        { text: `${max - 2} – ${max}`, from: max - 2, to: max },
        { text: `${max - 6} – ${max - 3}`, from: max - 6, to: max - 3 },
        { text: `${max - 11} – ${max - 7}`, from: max - 11, to: max - 7 },
        { text: `Before ${max - 11}`, to: max - 12 },
      ];
      const years = facets?.years;
      const yearCount = (from: number | undefined, to: number) =>
        Object.entries(years ?? {})
          .filter(([year]) => Number(year) <= to && (from === undefined || Number(year) >= from))
          .reduce((sum, [, count]) => sum + Number(count), 0);
      return bands.filter((band) => !years || yearCount(band.from, band.to) > 0).map((band) => ({
        text: band.text,
        href: listingHref({
          ...(band.from !== undefined && { [fromParam]: band.from }),
          [toParam]: band.to,
        }),
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
  const selected = (SITE_FILTER_PRIORITIES[site.key] ?? ["fuel_type", "transmission"])
    .map((field) => schema.find((item) => item.field === field))
    .filter((item): item is SchemaItem => Boolean(item));

  return [year, ...selected].map((item) => ({
    field: item.field,
    icon: FILTER_ICONS[item.field] ?? Settings2,
    label: `By ${item.label}`,
    items: schemaItems(item, facets),
  })).filter((row) => row.items.length > 0);
}

export function scopeBrowseHref(href: string, state?: string): string {
  if (!state) return href;
  return `/listings/${state.trim().toLowerCase().replace(/ /g, "-")}-state${href.replace("/listings", "")}`;
}
