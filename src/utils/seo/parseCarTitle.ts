/**
 * The /pool listing endpoint only returns a flat `title` per car — no
 * separate make/model/fuel/transmission fields (those are on the product
 * detail endpoint, too slow to call for every car on a listings page). This
 * derives them from the title text instead, the same way motorhomesforsale
 * does (mfs src/utils/seo/parseVehicleTitle.ts): make and model are matched
 * against the site's own real make/model lists (params-count), not guessed
 * from free text. Anything that can't be recognised is left out.
 *
 * Titles look like "2019 Toyota Landcruiser Prado GXL Turbo Diesel Automatic 4WD".
 */

export type NameItem = { name: string };

export type ParsedCarTitle = {
  year?: string;
  make?: string;
  model?: string;
  fuelType?: string;
  transmission?: string;
  drive?: "FWD" | "RWD" | "AWD" | "4WD";
  engineDisplacementLtr?: number;
};

// Other spellings titles use for a make in the params-count list.
const MAKE_ALIASES: Record<string, string[]> = {
  GWM: ["Great Wall Motors", "Great Wall Motor", "Great Wall"],
  "Mercedes-Benz": ["Mercedes Benz"],
};

// Longest first, so "Plug-in Hybrid" wins over "Hybrid".
const FUEL_TYPES: [RegExp, string][] = [
  [/\b(plug-?in hybrid|phev)\b/i, "Plug-in Hybrid"],
  [/\bhybrid\b/i, "Hybrid"],
  [/\belectric\b/i, "Electric"],
  [/\bdiesel\b(?!\s+heater)/i, "Diesel"],
  [/\bpetrol\b/i, "Petrol"],
];

const DRIVES: [RegExp, ParsedCarTitle["drive"]][] = [
  [/\b(4wd|4x4|four wheel drive)\b/i, "4WD"],
  [/\b(awd|all wheel drive|xdrive|4matic|quattro)\b/i, "AWD"],
  [/\b(fwd|front wheel drive)\b/i, "FWD"],
  [/\b(rwd|rear wheel drive)\b/i, "RWD"],
];

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Longest name in `list` that `text` starts with (case-insensitive). */
function matchAtStart(text: string, list: NameItem[]): string | undefined {
  let best: string | undefined;
  for (const { name } of list) {
    if (!name || (best && name.length <= best.length)) continue;
    if (new RegExp(`^${escapeRegex(name)}(?![\\w-])`, "i").test(text)) best = name;
  }
  return best;
}

export function parseCarTitle(title: string, makes: NameItem[], models: NameItem[]): ParsedCarTitle {
  const result: ParsedCarTitle = {};
  let rest = title.trim();

  const yearMatch = rest.match(/^((?:19|20)\d{2})\s+/);
  if (yearMatch) {
    result.year = yearMatch[1];
    rest = rest.slice(yearMatch[0].length);
  }

  // Match the list's names plus their aliases; report the list's spelling
  // ("BYD", not the title's "Byd"; "GWM" for "Great Wall Motor").
  const candidates = makes.flatMap(({ name }) => [
    { name, canonical: name },
    ...(MAKE_ALIASES[name] ?? []).map((alias) => ({ name: alias, canonical: name })),
  ]);
  const matched = matchAtStart(rest, candidates);
  if (matched) {
    const make = candidates.find((c) => c.name === matched)!;
    result.make = make.canonical;
    rest = rest.slice(matched.length).trim();
    // Model only straight after a recognised make; keep the title's own
    // spelling ("X-Trail") rather than the list's ("X-TRAIL").
    const model = matchAtStart(rest, models);
    if (model) result.model = rest.slice(0, model.length);
  }

  const fuel = FUEL_TYPES.find(([re]) => re.test(title));
  if (fuel) result.fuelType = fuel[1];

  const trans = title.match(/\b(automatic|manual)\b/i);
  if (trans) result.transmission = trans[1].charAt(0).toUpperCase() + trans[1].slice(1).toLowerCase();

  const drive = DRIVES.find(([re]) => re.test(title));
  if (drive) result.drive = drive[1];

  const engine = title.match(/\b(\d(?:\.\d)?)\s?L\b/i);
  if (engine) result.engineDisplacementLtr = parseFloat(engine[1]);

  return result;
}
