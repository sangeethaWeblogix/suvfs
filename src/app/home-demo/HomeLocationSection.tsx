"use client";

import Image from "next/image";
import { site } from "@/config/sites";
import { buildFilterSegments } from "@/config/filterDefs";
import type { SchemaItem } from "@/app/listings/SiteFilters";
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

const MAJOR_CITIES = [
  { name: "Adelaide",   href: "/listings/south-australia-state/adelaide-region/",    imgSrc: "/images/Adelaide.png"   },
  { name: "Brisbane",   href: "/listings/queensland-state/brisbane-region/",         imgSrc: "/images/Brisbane.png"   },
  { name: "Gold Coast", href: "/listings/queensland-state/gold-coast-region/",       imgSrc: "/images/Gold-Coast.png" },
  { name: "Melbourne",  href: "/listings/victoria-state/melbourne-region/",          imgSrc: "/images/Melbourne.png"  },
  { name: "Perth",      href: "/listings/western-australia-state/perth-region/",     imgSrc: "/images/Perth.png"      },
  { name: "Sydney",     href: "/listings/new-south-wales-state/sydney-region/",      imgSrc: "/images/Sydney.png"     },
];

const MINOR_CITIES = [
  { name: "Cairns",         href: "/listings/queensland-state/cairns-region/" },
  { name: "Canberra",       href: "/listings/australian-capital-territory-state/australian-capital-territory-region/" },
  { name: "Darwin",         href: "/listings/northern-territory-state/darwin-region/" },
  { name: "Geelong",        href: "/listings/victoria-state/geelong-region/" },
  { name: "Hobart",         href: "/listings/tasmania-state/hobart-region/" },
  { name: "Newcastle",      href: "/listings/new-south-wales-state/newcastle-region/" },
  { name: "Sunshine Coast", href: "/listings/queensland-state/sunshine-coast-region/" },
  { name: "Townsville",     href: "/listings/queensland-state/townsville-region/" },
  { name: "Wollongong",     href: "/listings/new-south-wales-state/illawarra-region/" },
  { name: "Ballarat",       href: "/listings/victoria-state/ballarat-region/" },
];

type FilterItem = { text: string; href: string };
type FilterRow = { icon: LucideIcon; label: string; items: FilterItem[] };

const BUDGET_ROW: FilterRow = {
  icon: WalletCards,
  label: "By Your Budget",
  items: [
    { text: "Under $30,000",      href: "/listings/under-30000/" },
    { text: "$30,000 – $40,000",  href: "/listings/between-30000-40000/" },
    { text: "$40,000 – $50,000",  href: "/listings/between-40000-50000/" },
    { text: "$50,000 – $70,000",  href: "/listings/between-50000-70000/" },
    { text: "$70,000 – $80,000",  href: "/listings/between-70000-80000/" },
    { text: "$80,000 – $100,000", href: "/listings/between-80000-100000/" },
    { text: "Over $100,000",      href: "/listings/over-100000/" },
  ],
};

const SITE_FILTER_PRIORITIES: Record<string, string[]> = {
  suv: ["drive_type", "seats"],
  utes: ["cab_type", "payload_weight"],
  peoplemovers: ["seats", "fuel_type"],
  sedans: ["fuel_type", "transmission"],
  hatchbacks: ["fuel_type", "body_size"],
  wagons: ["fuel_type", "drive_type"],
  coupes: ["transmission", "engine_power"],
  convertibles: ["transmission", "fuel_type"],
  vans: ["wheelbase", "roof_height"],
  "4x4": ["drive_type", "braked_towing_capacity"],
  electric: ["driving_range", "battery_capacity"],
  hybrid: ["body_type", "drive_type"],
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

function schemaItems(item: SchemaItem): FilterItem[] {
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

function buildFilterRows(schema: SchemaItem[]): FilterRow[] {
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
    icon: FILTER_ICONS[item.field] ?? Settings2,
    label: `By ${item.label}`,
    items: schemaItems(item),
  })).filter((row) => row.items.length > 0);
}


export default function HomeLocationSection({ schema }: { schema: SchemaItem[] }) {
  const filterRows = [BUDGET_ROW, ...buildFilterRows(schema)];
  return (
    <section className="hloc-section">
      <div className="container">

        <div className="hloc-header">
          <h2 className="hloc-title">
            Find {site.plural} for Sale by <span className="hloc-title-accent">Popular Location</span>
          </h2>
          <p className="hloc-subtitle">Browse new and used {site.nounPlural} for sale near you across major Australian cities and regions.</p>
          
        </div>

        <div className="hloc-major-grid">
          {MAJOR_CITIES.map((city) => (
            <a key={city.name} href={city.href} className="hloc-city-card">
              <div className="hloc-city-img-wrap">
                <div className="hloc-city-circle" />
                <Image
                  src={city.imgSrc}
                  alt={city.name}
                  width={110}
                  height={80}
                  className="hloc-city-img"
                  unoptimized
                />
              </div>
              <h3 className="hloc-city-name">
                {city.name} <span className="hloc-city-arrow"></span>
              </h3>
            </a>
          ))}
        </div>

        <div className="hloc-minor-wrap">
          {MINOR_CITIES.map((city, idx) => (
            <a
              key={city.name}
              href={city.href}
              className={`hloc-minor-pill${idx === 0 ? " hloc-minor-pill--active" : ""}`}
            >
              <h3>{city.name}</h3>
            </a>
          ))}
        </div>
<div className="hloc-header">
  <h2 className="hloc-title">
           Search {site.plural} for Sale <span className="hloc-title-accent">Your Way</span>
          </h2>
          <p className="hloc-subtitle">Browse new and used {site.nounPlural} for sale by price, year and the features that matter to you.</p>
        </div>
        <div className="hloc-filters">
          
          {filterRows.map((f) => {
            const Icon = f.icon;
            return (
            <div key={f.label} className="hloc-filter-row">
              <div className="hloc-filter-label">
                <span className="hloc-filter-icon-box"><Icon size={22} aria-hidden="true" /></span>
                <span className="hloc-filter-text">{f.label}</span>
              </div>
              <div className="hloc-filter-chips">
                <h3>
                {f.items.map((item,) => (

                  <a key={item.text} href={item.href} className="hloc-chip">
                   {item.text}</a>
                ))}
                </h3>
              </div>
            </div>
            );
          })}
        </div>
 
        

      </div>
    </section>
  );
}
