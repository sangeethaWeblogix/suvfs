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

export const BUDGET_ROW: BrowseFilterRow = {
  field: "price",
  icon: WalletCards,
  label: "By Budget",
  items: [
    { text: "Under $30,000", href: "/listings/under-30000/" },
    { text: "$30,000 – $40,000", href: "/listings/between-30000-40000/" },
    { text: "$40,000 – $50,000", href: "/listings/between-40000-50000/" },
    { text: "$50,000 – $70,000", href: "/listings/between-50000-70000/" },
    { text: "$70,000 – $80,000", href: "/listings/between-70000-80000/" },
    { text: "$80,000 – $100,000", href: "/listings/between-80000-100000/" },
    { text: "Over $100,000", href: "/listings/over-100000/" },
  ],
};

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

export function schemaItems(item: SchemaItem): BrowseFilterItem[] {
  if (item.control === "multi") {
    return item.options.slice(0, 7).map((option, index) => {
      const value = String(item.values?.[index] ?? option).toLowerCase();
      return { text: String(option), href: listingHref({ [item.param]: value }) };
    });
  }

  if (item.control === "min_dropdown") {
    const options = item.options.length > 5
      ? item.options.filter((_, index) => index % Math.ceil(item.options.length / 5) === 0).slice(0, 5)
      : item.options;
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
      return bands.map((band) => ({
        text: band.text,
        href: listingHref({
          ...(band.from !== undefined && { [fromParam]: band.from }),
          [toParam]: band.to,
        }),
      }));
    }

    const span = item.max - item.min;
    const round = (value: number) =>
      Math.round(value / Math.max(item.step, 1)) * Math.max(item.step, 1);
    const q1 = round(item.min + span * 0.25);
    const q2 = round(item.min + span * 0.5);
    const q3 = round(item.min + span * 0.75);
    return [
      { text: `Under ${formatValue(q1, item.unit)}`, values: { [toParam]: q1 } },
      { text: `${formatValue(q1, item.unit)} – ${formatValue(q2, item.unit)}`, values: { [fromParam]: q1, [toParam]: q2 } },
      { text: `${formatValue(q2, item.unit)} – ${formatValue(q3, item.unit)}`, values: { [fromParam]: q2, [toParam]: q3 } },
      { text: `${formatValue(q3, item.unit)}+`, values: { [fromParam]: q3 } },
    ].map(({ text, values }) => ({ text, href: listingHref(values) }));
  }

  return [];
}

export function buildSiteFilterRows(schema: SchemaItem[]): BrowseFilterRow[] {
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
    items: schemaItems(item),
  })).filter((row) => row.items.length > 0);
}

export function scopeBrowseHref(href: string, state?: string): string {
  if (!state) return href;
  return `/listings/${state.trim().toLowerCase().replace(/ /g, "-")}-state${href.replace("/listings", "")}`;
}
