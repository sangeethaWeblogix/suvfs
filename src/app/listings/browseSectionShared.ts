import { SINGLE_VALUE_SUBJECTS } from "@/utils/seo/indexRules";
import { BUDGET_BAND_PARAMS } from "./siteBrowseFilters";
import { ALL_REGIONS, getRegionsByState } from "../sell-my-caravan-region/regions-data";

export function toStateSlug(state: string): string {
  return state.trim().toLowerCase().replace(/ /g, "-");
}

export function stateLabel(state: string): string {
  return state
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// API group_by=region responses come back as raw hyphenated slugs with only
// the first letter capitalized (e.g. "Latrobe-gippsland") — clean that up
// for display.
export function cleanRegionName(name: string): string {
  return name
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export const STATES = [
  { name: "Victoria",            href: "/listings/victoria-state/" },
  { name: "New South Wales",     href: "/listings/new-south-wales-state/" },
  { name: "Queensland",          href: "/listings/queensland-state/" },
  { name: "South Australia",     href: "/listings/south-australia-state/" },
  { name: "Western Australia",   href: "/listings/western-australia-state/" },
  { name: "Tasmania",            href: "/listings/tasmania-state/" },
];

// State is the ONLY active filter — show every real region of that state
// (not just the curated popular subset), since there's nothing else to
// narrow the browsing by.
export function buildAllRegionsForState(state: string) {
  const stateSlug = toStateSlug(state);
  return getRegionsByState(stateSlug).map((r) => ({
    name: r.label,
    href: `/listings/${r.state.slug}-state/${r.pageSlug}-region/`,
  }));
}

export type CountItem = { name: string; slug: string; count: number };

export interface BrowseSectionData {
  makeCounts?: CountItem[] | null;
  /** Listings per region of the state — only on state pages. */
  regionCounts?: CountItem[] | null;
  /** Listings per value of each indexable filter (drive type, seats, body size) in this location. */
  subjectCounts?: Record<string, CountItem[]> | null;
  /** Make pages only (no location): this make's listings per state, region and model. */
  makeStateCounts?: CountItem[] | null;
  makeRegionCounts?: CountItem[] | null;
  modelCounts?: CountItem[] | null;
  /** Listings per budget band in this location (BUDGET_BANDS order); null = unknown. */
  priceCounts?: (number | null)[] | null;
}

/** The indexable filters this site's filter panel actually has — no point
 * counting body size on the utes site. An empty schema (API down) counts all. */
export function subjectFieldsFor(schemaFields: string[]): string[] {
  return schemaFields.length ? SINGLE_VALUE_SUBJECTS.filter((f) => schemaFields.includes(f)) : SINGLE_VALUE_SUBJECTS;
}

/** Counts behind the browse section for one location — shared by the server
 * (SSR/ISR) and client fetches, which differ only in how they call params-count.
 * `fetchTotal` returns the listing total for a scope, or null when unknown. */
export async function loadBrowseCounts(
  fetchGroup: (groupBy: string, scope: Record<string, string>) => Promise<CountItem[]>,
  fetchTotal: (scope: Record<string, string>) => Promise<number | null>,
  { state, region, make }: { state?: string; region?: string; make?: string },
  subjectFields: string[] = SINGLE_VALUE_SUBJECTS,
): Promise<BrowseSectionData> {
  const scope: Record<string, string> = {};
  if (state) scope.state = state;
  if (state && region) scope.region = region;
  const makeScope = make && !state ? { make } : null;
  const [makeCounts, regionCounts, makeStateCounts, makeRegionCounts, modelCounts, priceCounts, ...subjects] = await Promise.all([
    fetchGroup("make", scope),
    state && !region ? fetchGroup("region", scope) : Promise.resolve(null),
    makeScope ? fetchGroup("state", makeScope) : Promise.resolve(null),
    makeScope ? fetchGroup("region", makeScope) : Promise.resolve(null),
    makeScope ? fetchGroup("model", makeScope) : Promise.resolve(null),
    Promise.all(BUDGET_BAND_PARAMS.map((band) => fetchTotal({ ...scope, ...band }))),
    ...subjectFields.map((field) => fetchGroup(field, scope)),
  ]);
  return {
    makeCounts,
    regionCounts,
    makeStateCounts,
    makeRegionCounts,
    modelCounts,
    priceCounts,
    subjectCounts: Object.fromEntries(subjectFields.map((field, i) => [field, subjects[i]])),
  };
}

/** A region slug from params-count (e.g. "melbourne", "north-west") → its
 * region page under its state, or undefined when the region is unknown. */
export function findRegionBySlug(slug: string) {
  return ALL_REGIONS.find((r) => r.slug === `${slug}-region`) ?? ALL_REGIONS.find((r) => r.pageSlug === slug);
}
