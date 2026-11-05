// Per-site "Find the right {vehicle}" enquiry form (/<slug>-enquiry-form/).
// One form engine (app/suv-enquiry-form/enquiry.tsx), one config per site here.
//
// A question with `attr` takes its options from the backend listing attribute
// of the same name: the site's filters_schema (GET /car-sites/{site}/), the
// list its listing filters use. So the form only offers terms the backend
// has, e.g. drive_type = FWD / RWD / AWD / 4WD. `options` on such a question
// is only the fallback when the API can't be reached. Questions without an
// attribute (main use, home charging, …) keep their own options.
// Every question takes one answer.

import type { SchemaItem } from "@/app/listings/SiteFilters";

export type EnquirySelect = {
  /** Form field name (also the React key). */
  name: string;
  /** Label above the select, and the label in the saved answer. */
  label: string;
  /** Own options, or the fallback for an `attr` question. */
  options: string[];
  /** Backend attribute (filters_schema field) the options come from. */
  attr?: string;
  /** Use only these backend terms (by label), e.g. hybrid fuel types. */
  only?: string[];
  required?: boolean;
  /** Placeholder option; defaults to "Select…" (required) / "Any" (optional). */
  placeholder?: string;
};

/** One dropdown option: `label` is shown and saved; `slug` is the backend value. */
export type EnquiryChoice = { label: string; slug?: string };

/** A question ready to render, its options resolved against the backend. */
export type ResolvedSelect = Omit<EnquirySelect, "options" | "only"> & { choices: EnquiryChoice[] };

export type EnquiryFormConfig = {
  /** 2–4 site-specific questions, shown first under "Your vehicle preferences". */
  fields: EnquirySelect[];
  /** Max-budget steps in AUD; the last one is shown as "$X+". */
  budgetSteps: number[];
  /** Examples in the optional "Additional requirements" box. */
  messageHint: string;
};

// ── Shared questions ─────────────────────────────────────────────────────
const NOT_SURE = "Not sure yet";

// Fallbacks = the backend's terms as of Nov 2026.
const FUEL = ["Petrol", "Diesel", "Hybrid", "Plug-in Hybrid", "Electric", "LPG"];
const SIZES = ["Micro", "Small", "Medium", "Large"];
const SEATS = ["2", "3", "4", "5", "7", "8"];
const BODY = ["SUV", "Ute", "People Mover", "Sedan", "Hatchback", "Wagon", "Coupe", "Convertible", "Van"];

const q = (name: string, label: string, attr: string, options: string[], required = false): EnquirySelect => ({
  name,
  label,
  attr,
  options,
  ...(required && { required }),
});
const size = (noun: string, required = true) => q("size", `${noun} size`, "body_size", SIZES, required);
const seats = (label = "Seats needed", required = false) => q("seats", label, "seats", SEATS, required);
const fuel = () => q("fuel", "Fuel type", "fuel_type", FUEL);
const drive = () => q("drive", "Drive type", "drive_type", ["FWD", "RWD", "AWD", "4WD"]);
const transmission = () =>
  q("transmission", "Transmission", "transmission", ["Manual (MT)", "Automatic (AT)", "CVT", "Dual-Clutch (DCT)"]);
const towing = () =>
  q("towing", "Towing capacity needed", "braked_towing_capacity", ["1500", "2000", "2500", "3000", "3500"]);
const body = (required = true) => q("body", "Body type", "body_type", BODY, required);

const BUDGET_STANDARD = [15000, 20000, 25000, 30000, 40000, 50000, 60000, 75000, 100000, 150000];
const BUDGET_SMALL = [10000, 15000, 20000, 25000, 30000, 40000, 50000, 75000];
const BUDGET_WORK = [20000, 30000, 40000, 50000, 60000, 70000, 80000, 100000, 150000];
const BUDGET_PERFORMANCE = [20000, 30000, 50000, 75000, 100000, 150000, 200000, 300000];
// $75k = the EV novated-lease full FBT-exemption cap from 1 Apr 2027 (May 2026 review).
const BUDGET_EV = [25000, 30000, 40000, 50000, 60000, 75000, 90000, 120000];

// ── Per-site forms ───────────────────────────────────────────────────────
export const ENQUIRY_FORMS: Record<string, EnquiryFormConfig> = {
  suv: {
    fields: [size("SUV"), seats(), fuel(), drive()],
    budgetSteps: BUDGET_STANDARD,
    messageHint: "Preferred year, kilometres, towing needs, safety features, boot space or anything else that matters to you.",
  },
  utes: {
    fields: [
      q("cab", "Cab type", "cab_type", ["Single Cab", "Extra Cab", "Dual Cab"], true),
      drive(),
      q("tray", "Tub or tray", "tray_type", ["Tub (Pick-up)", "Cab Chassis (Tray)"]),
      towing(),
    ],
    budgetSteps: BUDGET_WORK,
    messageHint: "Main use (work, towing, touring), payload, canopy, tow bar, bull bar, year, kilometres or anything else that matters to you.",
  },
  peoplemovers: {
    fields: [
      seats("Seats needed", true),
      fuel(),
      { name: "access", label: "Wheelchair access needed", options: ["No", "Yes – wheelchair accessible"] },
    ],
    budgetSteps: BUDGET_STANDARD,
    messageHint: "Preferred year, kilometres, sliding doors, child seat anchor points, luggage space, accessibility (e.g. NDIS) or anything else that matters to you.",
  },
  sedans: {
    fields: [size("Sedan"), fuel(), transmission(), drive()],
    budgetSteps: BUDGET_STANDARD,
    messageHint: "Preferred year, kilometres, fuel economy, safety features or anything else that matters to you.",
  },
  hatchbacks: {
    fields: [size("Hatchback"), fuel(), transmission()],
    budgetSteps: BUDGET_SMALL,
    messageHint: "First car or P-plater, preferred year, kilometres, fuel economy, safety rating or anything else that matters to you.",
  },
  wagons: {
    fields: [size("Wagon"), fuel(), drive(), towing()],
    budgetSteps: BUDGET_STANDARD,
    messageHint: "Preferred year, kilometres, cargo space, roof racks, towing needs or anything else that matters to you.",
  },
  coupes: {
    fields: [
      seats("Seats", true),
      transmission(),
      { name: "power", label: "Performance", options: ["Everyday sporty", "Performance (150 kW+)", "High performance (250 kW+)"] },
      drive(),
    ],
    budgetSteps: BUDGET_PERFORMANCE,
    messageHint: "Preferred year, kilometres, colour, service history, modifications or anything else that matters to you.",
  },
  convertibles: {
    fields: [
      seats("Seats", true),
      { name: "roof", label: "Roof type", options: ["Soft top", "Folding hard top", "Either"] },
      transmission(),
      { name: "power", label: "Performance", options: ["Everyday cruiser", "Performance (150 kW+)", "High performance (250 kW+)"] },
    ],
    budgetSteps: BUDGET_PERFORMANCE,
    messageHint: "Preferred year, kilometres, roof condition, colour, service history or anything else that matters to you.",
  },
  vans: {
    fields: [
      {
        name: "use",
        label: "Main use",
        options: ["Cargo / trade", "Passenger (people carrier)", "Camper conversion", "Delivery / refrigerated"],
        required: true,
      },
      q("wheelbase", "Wheelbase", "wheelbase", ["Short", "Medium", "Long", "Extra Long"]),
      q("roof", "Roof height", "roof_height", ["Low", "Medium", "High", "Extra High"]),
      seats(),
    ],
    budgetSteps: BUDGET_WORK,
    messageHint: "Load space, payload, shelving, barn or lift-up rear doors, side doors, year, kilometres or anything else that matters to you.",
  },
  "4x4": {
    fields: [
      body(),
      { name: "use", label: "Main use", options: ["Weekend off-roading", "Remote touring", "Towing a caravan or boat", "Work"] },
      fuel(),
      towing(),
    ],
    budgetSteps: BUDGET_WORK,
    messageHint: "Low-range, diff locks, snorkel, lift kit, bull bar, long-range tank, year, kilometres or anything else that matters to you.",
  },
  "4wd": {
    fields: [
      body(),
      seats(),
      { name: "use", label: "Main use", options: ["Family touring", "Towing a caravan or boat", "Off-road adventures"] },
      towing(),
    ],
    budgetSteps: BUDGET_WORK,
    messageHint: "Caravan or boat weight, third-row space, low-range, year, kilometres or anything else that matters to you.",
  },
  awd: {
    fields: [body(), size("Vehicle", false), fuel(), seats()],
    budgetSteps: BUDGET_STANDARD,
    messageHint: "Snow or gravel driving, towing, performance, year, kilometres or anything else that matters to you.",
  },
  electric: {
    fields: [
      body(),
      q("range", "Minimum driving range", "driving_range", ["300", "400", "500", "600"]),
      {
        name: "charging",
        label: "Home charging",
        options: ["Yes – off-street parking", "No – street parking / apartment", NOT_SURE],
      },
    ],
    budgetSteps: BUDGET_EV,
    messageHint: "Preferred year, kilometres, battery health, fast-charging speed, towing, novated lease or anything else that matters to you.",
  },
  hybrid: {
    fields: [
      // The site's fuel_type attribute, hybrid terms only.
      { ...q("hybridType", "Hybrid type", "fuel_type", ["Hybrid", "Plug-in Hybrid"], true), only: ["Hybrid", "Plug-in Hybrid"] },
      body(false),
      seats(),
    ],
    budgetSteps: BUDGET_STANDARD,
    messageHint: "Preferred year, kilometres, fuel economy, battery warranty, electric-only range (PHEV) or anything else that matters to you.",
  },
};

/** Shared by every site: helps sellers prioritise and prepare the right offer. */
export const PURCHASE_FIELDS: EnquirySelect[] = [
  { name: "timeframe", label: "When do you plan to buy?", options: ["As soon as possible", "Within a month", "In 1–3 months", "Just researching"] },
  {
    name: "payment",
    label: "How do you plan to pay?",
    options: ["Cash / savings", "Car loan / finance", "Novated lease", "Business purchase (ABN)", NOT_SURE],
  },
  { name: "tradeIn", label: "Trading in a vehicle?", options: ["Yes", "No"] },
];

/** Vehicle condition: the backend `condition` attribute (fallback below). */
export const CONDITION_FIELD: EnquirySelect = {
  name: "condition",
  label: "Vehicle condition",
  attr: "condition",
  options: ["New", "Used", "Demo"],
  required: true,
};

export function getEnquiryForm(siteKey: string): EnquiryFormConfig {
  return ENQUIRY_FORMS[siteKey] ?? ENQUIRY_FORMS.suv;
}

/** How a backend term reads in the form: "7 seats", "8+ seats", "2,500 kg+", "400 km+". */
function choiceLabel(attr: string, option: string | number): string {
  const v = String(option);
  if (attr === "seats") return v === "8" ? "8+ seats" : `${v} seat${v === "1" ? "" : "s"}`;
  if (attr === "braked_towing_capacity") return `${Number(v).toLocaleString("en-AU")} kg+`;
  if (attr === "driving_range") return `${v} km+`;
  return v;
}

/**
 * The questions with their options: an `attr` question gets the site's backend
 * terms (labels + slugs) from filters_schema; the rest keep their own options.
 * One option list per question; the form takes a single answer for each.
 */
export function resolveFields(fields: EnquirySelect[], schema: SchemaItem[]): ResolvedSelect[] {
  return fields.map(({ options, only, ...field }) => {
    const item = field.attr ? schema.find((s) => s.field === field.attr) : undefined;
    let choices: EnquiryChoice[];
    if (item && (item.control === "multi" || item.control === "min_dropdown") && item.options.length) {
      const values = item.control === "multi" ? item.values : undefined;
      choices = item.options.map((o, i) => ({
        label: choiceLabel(field.attr!, o),
        slug: values?.[i] ?? String(o),
      }));
      if (only) choices = choices.filter((c, i) => only.includes(String(item.options[i])));
    } else {
      choices = options.map((o) => ({ label: field.attr ? choiceLabel(field.attr, o) : o }));
    }
    return { ...field, choices };
  });
}

export function formatAud(n: number): string {
  return `$${n.toLocaleString("en-AU")}`;
}

/** Budget dropdown: value = max in whole dollars ("150000+" for the top step). */
export function budgetOptions(steps: number[]): { value: string; label: string }[] {
  const last = steps[steps.length - 1];
  return [
    ...steps.map((n) => ({ value: String(n), label: `Up to ${formatAud(n)}` })),
    { value: `${last}+`, label: `${formatAud(last)}+` },
  ];
}
