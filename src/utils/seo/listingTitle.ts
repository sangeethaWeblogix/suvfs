import { site } from "@/config/sites";

/** Filter fields the listings meta title depends on. Fits both the server's
 * parseSlugToFilters() output and the client's FilterState. */
export type ListingTitleFilters = {
  condition?: string;
  make?: string;
  model?: string;
  state?: string;
  region?: string;
  suburb?: string;
  from_price?: string | number;
  to_price?: string | number;
  from_year?: string | number;
  to_year?: string | number;
  search?: string;
  keyword?: string;
};

const STATES: Record<string, { name: string; abbr: string }> = {
  "victoria": { name: "Victoria", abbr: "VIC" },
  "new-south-wales": { name: "New South Wales", abbr: "NSW" },
  "queensland": { name: "Queensland", abbr: "QLD" },
  "south-australia": { name: "South Australia", abbr: "SA" },
  "western-australia": { name: "Western Australia", abbr: "WA" },
  "tasmania": { name: "Tasmania", abbr: "TAS" },
  "northern-territory": { name: "Northern Territory", abbr: "NT" },
  "australian-capital-territory": { name: "Australian Capital Territory", abbr: "ACT" },
};

const titleCase = (s: string) =>
  s.replace(/[-+]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const money = (n: string | number) =>
  `$${parseInt(String(n), 10).toLocaleString("en-AU")}`;

/**
 * Listings meta title built with the backend's own formula (seo_v2.meta_title),
 * so a page shows the same title when the pool API fails or is still loading:
 *   "SUVs for Sale in Australia"
 *   "New Toyota SUVs for Sale in Queensland"
 *   "Toyota RAV4 for Sale in Melbourne, Victoria"
 *   "SUVs for Sale Under $30,000 in Australia"
 *   "SUVs for Sale near Richmond VIC"
 *   "SUVs for Sale in Australia (2020+ Models)"
 */
export function listingMetaTitle(f: ListingTitleFilters): string {
  let lead: string;
  const kw = f.search || f.keyword;
  if (kw) {
    const k = titleCase(kw);
    lead = k.toLowerCase().endsWith(site.plural.toLowerCase()) ? k : `${k} ${site.plural}`;
  } else {
    const parts: string[] = [];
    const cond = String(f.condition ?? "").toLowerCase();
    if (cond === "new") parts.push("New");
    else if (cond === "used") parts.push("Used");
    if (f.make) parts.push(titleCase(f.make));
    // A model page names the model alone ("Toyota RAV4", not "Toyota RAV4 SUVs").
    parts.push(f.model ? titleCase(f.model) : site.plural);
    lead = parts.join(" ");
  }

  let price = "";
  if (f.from_price && f.to_price) price = ` Between ${money(f.from_price)} to ${money(f.to_price)}`;
  else if (f.to_price) price = ` Under ${money(f.to_price)}`;
  else if (f.from_price) price = ` Over ${money(f.from_price)}`;

  const st = f.state ? STATES[f.state.toLowerCase().replace(/\s+/g, "-")] : undefined;
  const stateName = st?.name ?? (f.state ? titleCase(f.state) : "");
  let location = " in Australia";
  if (f.suburb) location = ` near ${titleCase(f.suburb)}${st ? ` ${st.abbr}` : ""}`;
  else if (f.region) location = ` in ${titleCase(f.region)}${stateName ? `, ${stateName}` : ""}`;
  else if (stateName) location = ` in ${stateName}`;

  const from = f.from_year ? String(f.from_year) : "";
  const to = f.to_year ? String(f.to_year) : "";
  let years = "";
  if (from && to) years = from === to ? ` (${from} Models)` : ` (${from}–${to} Models)`;
  else if (from) years = ` (${from}+ Models)`;
  else if (to) years = ` (Up to ${to} Models)`;

  return `${lead} for Sale${price}${location}${years}`;
}
