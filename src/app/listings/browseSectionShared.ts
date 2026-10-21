import { getRegionsByState } from "../sell-my-caravan-region/regions-data";

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
}
