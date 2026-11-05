// Per-site "Find the right {vehicle}" enquiry form (/<slug>-enquiry-form/).
// One form engine (app/suv-enquiry-form/enquiry.tsx), one config per site here.
//
// The backend enquiry (POST /enquiries/home) stores only name, email, phone,
// postcode, condition, budget and requirements, so every site-specific answer
// below is written into `requirements` as "Label: value" lines (see
// buildRequirements in enquiry.tsx). Option values match the listing filter
// values in backend sites.json where a filter exists, so the team can turn a
// lead straight into a listings search.

export type EnquirySelect = {
  /** Form field name (also the React key). */
  name: string;
  /** Label above the select, and the label in the requirements text. */
  label: string;
  options: string[];
  required?: boolean;
  /** Placeholder option; defaults to "Select…" (required) / "Any" (optional). */
  placeholder?: string;
};

export type EnquiryFormConfig = {
  /** 2–4 site-specific questions, shown first under "Your vehicle preferences". */
  fields: EnquirySelect[];
  /** Max-budget steps in AUD; the last one is shown as "$X+". */
  budgetSteps: number[];
  /** Examples in the optional "Additional requirements" box. */
  messageHint: string;
};

// ── Shared option lists ──────────────────────────────────────────────────
const NOT_SURE = "Not sure yet";

const FUEL_ALL = ["Petrol", "Diesel", "Hybrid", "Plug-in Hybrid", "Electric"];
const SIZES = ["Small", "Medium", "Large", NOT_SURE];
const TRANSMISSION = ["Automatic", "Manual"];
const TOWING = [
  "Not needed",
  "Light (up to 1,500 kg)",
  "2,000 kg or more",
  "2,500 kg or more",
  "3,000 kg or more",
  "3,500 kg (maximum)",
];

const towing = (): EnquirySelect => ({ name: "towing", label: "Towing capacity needed", options: TOWING });
const fuel = (options = FUEL_ALL): EnquirySelect => ({ name: "fuel", label: "Fuel type", options });
const transmission = (): EnquirySelect => ({ name: "transmission", label: "Transmission", options: TRANSMISSION });
const size = (noun: string): EnquirySelect => ({ name: "size", label: `${noun} size`, options: SIZES, required: true });

const BUDGET_STANDARD = [15000, 20000, 25000, 30000, 40000, 50000, 60000, 75000, 100000, 150000];
const BUDGET_SMALL = [10000, 15000, 20000, 25000, 30000, 40000, 50000, 75000];
const BUDGET_WORK = [20000, 30000, 40000, 50000, 60000, 70000, 80000, 100000, 150000];
const BUDGET_PERFORMANCE = [20000, 30000, 50000, 75000, 100000, 150000, 200000, 300000];
// $75k = the EV novated-lease full FBT-exemption cap from 1 Apr 2027 (May 2026 review).
const BUDGET_EV = [25000, 30000, 40000, 50000, 60000, 75000, 90000, 120000];

// ── Per-site forms ───────────────────────────────────────────────────────
export const ENQUIRY_FORMS: Record<string, EnquiryFormConfig> = {
  suv: {
    fields: [
      size("SUV"),
      { name: "seats", label: "Seats needed", options: ["5 seats", "7 seats or more"] },
      fuel(),
      { name: "drive", label: "Drivetrain", options: ["2WD is fine", "AWD", "4WD (off-road)"] },
    ],
    budgetSteps: BUDGET_STANDARD,
    messageHint: "Preferred year, kilometres, towing needs, safety features, boot space or anything else that matters to you.",
  },
  utes: {
    fields: [
      { name: "cab", label: "Cab type", options: ["Single Cab", "Extra Cab", "Dual Cab", NOT_SURE], required: true },
      { name: "drive", label: "Drive type", options: ["4x2", "4x4"] },
      { name: "tray", label: "Tub or tray", options: ["Tub (Pick-up)", "Cab Chassis (Tray)"] },
      towing(),
    ],
    budgetSteps: BUDGET_WORK,
    messageHint: "Main use (work, towing, touring), payload, canopy, tow bar, bull bar, year, kilometres or anything else that matters to you.",
  },
  peoplemovers: {
    fields: [
      { name: "seats", label: "Minimum seating capacity", options: ["7 seats", "8 seats or more"], required: true },
      fuel(["Petrol", "Diesel", "Hybrid", "Electric"]),
      { name: "access", label: "Wheelchair access needed", options: ["No", "Yes – wheelchair accessible"] },
    ],
    budgetSteps: BUDGET_STANDARD,
    messageHint: "Preferred year, kilometres, sliding doors, child seat anchor points, luggage space, accessibility (e.g. NDIS) or anything else that matters to you.",
  },
  sedans: {
    fields: [size("Sedan"), fuel(["Petrol", "Diesel", "Hybrid", "Plug-in Hybrid", "Electric"]), transmission()],
    budgetSteps: BUDGET_STANDARD,
    messageHint: "Preferred year, kilometres, fuel economy, safety features or anything else that matters to you.",
  },
  hatchbacks: {
    fields: [size("Hatchback"), fuel(["Petrol", "Hybrid", "Electric"]), transmission()],
    budgetSteps: BUDGET_SMALL,
    messageHint: "First car or P-plater, preferred year, kilometres, fuel economy, safety rating or anything else that matters to you.",
  },
  wagons: {
    fields: [
      size("Wagon"),
      fuel(["Petrol", "Diesel", "Hybrid"]),
      { name: "drive", label: "Drivetrain", options: ["2WD is fine", "AWD", "4WD"] },
      towing(),
    ],
    budgetSteps: BUDGET_STANDARD,
    messageHint: "Preferred year, kilometres, cargo space, roof racks, towing needs or anything else that matters to you.",
  },
  coupes: {
    fields: [
      { name: "seats", label: "Seats", options: ["2 seats", "4 seats (2+2)", "Either"], required: true },
      transmission(),
      { name: "power", label: "Performance", options: ["Everyday sporty", "Performance (150 kW+)", "High performance (250 kW+)"] },
      { name: "drive", label: "Drive type", options: ["RWD", "AWD", "FWD"] },
    ],
    budgetSteps: BUDGET_PERFORMANCE,
    messageHint: "Preferred year, kilometres, colour, service history, modifications or anything else that matters to you.",
  },
  convertibles: {
    fields: [
      { name: "seats", label: "Seats", options: ["2 seats", "4 seats", "Either"], required: true },
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
      { name: "wheelbase", label: "Wheelbase", options: ["Short", "Medium", "Long", "Extra Long"] },
      { name: "roof", label: "Roof height", options: ["Low", "Medium", "High", "Extra High"] },
      { name: "seats", label: "Seats needed", options: ["2 seats", "3 seats", "5 seats or more"] },
    ],
    budgetSteps: BUDGET_WORK,
    messageHint: "Load space, payload, shelving, barn or lift-up rear doors, side doors, year, kilometres or anything else that matters to you.",
  },
  "4x4": {
    fields: [
      { name: "body", label: "Body type", options: ["Ute", "SUV", "Wagon", NOT_SURE], required: true },
      { name: "use", label: "Main use", options: ["Weekend off-roading", "Remote touring", "Towing a caravan or boat", "Work"] },
      fuel(["Diesel", "Petrol"]),
      towing(),
    ],
    budgetSteps: BUDGET_WORK,
    messageHint: "Low-range, diff locks, snorkel, lift kit, bull bar, long-range tank, year, kilometres or anything else that matters to you.",
  },
  "4wd": {
    fields: [
      { name: "body", label: "Body type", options: ["SUV", "Wagon", "People Mover", NOT_SURE], required: true },
      { name: "seats", label: "Seats needed", options: ["5 seats", "7 seats or more"] },
      { name: "use", label: "Main use", options: ["Family touring", "Towing a caravan or boat", "Off-road adventures"] },
      towing(),
    ],
    budgetSteps: BUDGET_WORK,
    messageHint: "Caravan or boat weight, third-row space, low-range, year, kilometres or anything else that matters to you.",
  },
  awd: {
    fields: [
      {
        name: "body",
        label: "Body type",
        options: ["SUV", "Sedan", "Hatchback", "Wagon", "Coupe", "People Mover", NOT_SURE],
        required: true,
      },
      { name: "size", label: "Size", options: ["Small", "Medium", "Large"] },
      fuel(),
      { name: "seats", label: "Seats needed", options: ["5 seats", "7 seats or more"] },
    ],
    budgetSteps: BUDGET_STANDARD,
    messageHint: "Snow or gravel driving, towing, performance, year, kilometres or anything else that matters to you.",
  },
  electric: {
    fields: [
      { name: "body", label: "Body type", options: ["SUV", "Hatchback", "Sedan", "Van", NOT_SURE], required: true },
      { name: "range", label: "Minimum driving range", options: ["300 km+", "400 km+", "500 km+", "600 km+", NOT_SURE] },
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
      {
        name: "hybridType",
        label: "Hybrid type",
        options: ["Hybrid (self-charging)", "Plug-in Hybrid (PHEV)", "Open to either"],
        required: true,
      },
      { name: "body", label: "Body type", options: ["SUV", "Hatchback", "Sedan", "Wagon", "People Mover", "Ute"] },
      { name: "seats", label: "Seats needed", options: ["5 seats", "7 seats or more"] },
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

export const CONDITION_OPTIONS = ["New", "Used", "Demo", "Open to any"];

export function getEnquiryForm(siteKey: string): EnquiryFormConfig {
  return ENQUIRY_FORMS[siteKey] ?? ENQUIRY_FORMS.suv;
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
