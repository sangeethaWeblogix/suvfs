import { SITES, site, type SiteConfig } from "./sites";

/** The three sister car sites each site cross-links to ("Explore Other
 * Vehicle Options" on the home, listings, product and blog pages). */
const RELATED_SITE_KEYS: Record<string, [string, string, string]> = {
  suv: ["4x4", "wagons", "hybrid"],
  utes: ["4x4", "vans", "suv"],
  peoplemovers: ["vans", "suv", "4wd"],
  sedans: ["hatchbacks", "coupes", "wagons"],
  hatchbacks: ["sedans", "wagons", "electric"],
  wagons: ["suv", "sedans", "peoplemovers"],
  coupes: ["convertibles", "sedans", "hatchbacks"],
  convertibles: ["coupes", "sedans", "electric"],
  vans: ["utes", "peoplemovers", "suv"],
  "4x4": ["suv", "utes", "4wd"],
  "4wd": ["4x4", "suv", "peoplemovers"],
  electric: ["hybrid", "hatchbacks", "suv"],
  hybrid: ["electric", "suv", "sedans"],
};

/** Short "for …" reason shown after each related site's link. */
export const RELATED_SITE_BENEFITS: Record<string, string> = {
  suv: "versatile family driving",
  utes: "work-ready practicality",
  peoplemovers: "extra passenger space",
  sedans: "comfortable everyday driving",
  hatchbacks: "compact, city-friendly practicality",
  wagons: "flexible passenger and cargo space",
  coupes: "sporty styling and performance",
  convertibles: "open-air driving",
  vans: "business and cargo versatility",
  "4x4": "off-road capability",
  "4wd": "family touring and towing",
  electric: "efficient electric driving",
  hybrid: "improved fuel efficiency",
};

export function getRelatedSites(): [SiteConfig, SiteConfig, SiteConfig] {
  const keys = RELATED_SITE_KEYS[site.key] ?? RELATED_SITE_KEYS.suv;
  return keys.map((key) => SITES[key]) as [SiteConfig, SiteConfig, SiteConfig];
}
