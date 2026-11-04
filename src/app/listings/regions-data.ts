export interface StateInfo {
  slug: string;
  label: string;
}

export interface RegionInfo {
  /** Region slug as used in listings URLs (e.g. "melbourne-region") */
  slug: string;
  /** Short slug without the "-region" suffix or state prefix */
  pageSlug: string;
  label: string;
  state: StateInfo;
}

export const STATES = {
  victoria: { slug: "victoria", label: "Victoria" },
  "new-south-wales": { slug: "new-south-wales", label: "New South Wales" },
  queensland: { slug: "queensland", label: "Queensland" },
  tasmania: { slug: "tasmania", label: "Tasmania" },
  "south-australia": { slug: "south-australia", label: "South Australia" },
  "western-australia": { slug: "western-australia", label: "Western Australia" },
} as const satisfies Record<string, StateInfo>;

type StateKey = keyof typeof STATES;

function region(slug: string, label: string, stateKey: StateKey, pageSlug?: string): RegionInfo {
  return {
    slug,
    // Default: strip "-region" suffix. Override with explicit pageSlug for
    // regions that also have a state-name prefix (e.g. "tasmania-north-west-region").
    pageSlug: pageSlug ?? slug.replace(/-region$/, ""),
    label,
    state: STATES[stateKey],
  };
}

export const ALL_REGIONS: RegionInfo[] = [
  // Victoria
  region("melbourne-region", "Melbourne", "victoria"),
  region("geelong-region", "Geelong", "victoria"),
  region("ballarat-region", "Ballarat", "victoria"),
  region("latrobe-gippsland-region", "Latrobe Gippsland", "victoria"),
  region("mornington-peninsula-region", "Mornington Peninsula", "victoria"),
  region("shepparton-region", "Shepparton", "victoria"),
  region("hume-region", "Hume", "victoria"),
  region("bendigo-region", "Bendigo", "victoria"),
  region("north-west-region", "North West", "victoria"),
  region("warrnambool-and-south-west-region", "Warrnambool And South West", "victoria"),

  // New South Wales
  region("sydney-region", "Sydney", "new-south-wales"),
  region("hunter-region", "Hunter", "new-south-wales"),
  region("coffs-harbour-region", "Coffs Harbour", "new-south-wales"),
  region("newcastle-region", "Newcastle", "new-south-wales"),
  region("southern-highlands-region", "Southern Highlands", "new-south-wales"),
  region("richmond-tweed-region", "Richmond Tweed", "new-south-wales"),
  region("central-coast-region", "Central Coast", "new-south-wales"),
  region("central-west-region", "Central West", "new-south-wales"),
  region("mid-north-coast-region", "Mid North Coast", "new-south-wales"),
  region("murray-region", "Murray", "new-south-wales"),
  region("new-england-region", "New England", "new-south-wales"),
  region("riverina-region", "Riverina", "new-south-wales"),
  region("capital-region", "Capital", "new-south-wales"),
  region("orana-region", "Orana", "new-south-wales"),
  region("illawarra-region", "Illawarra", "new-south-wales"),
  region("canberra-region", "Canberra", "new-south-wales"),

  // Queensland
  region("moreton-bay-north-region", "Moreton Bay North", "queensland"),
  region("wide-bay-region", "Wide Bay", "queensland"),
  region("gold-coast-region", "Gold Coast", "queensland"),
  region("brisbane-region", "Brisbane", "queensland"),
  region("sunshine-coast-region", "Sunshine Coast", "queensland"),
  region("logan-beaudesert-region", "Logan Beaudesert", "queensland"),
  region("moreton-bay-south-region", "Moreton Bay South", "queensland"),
  region("townsville-region", "Townsville", "queensland"),
  region("mackay-isaac-whitsunday-region", "Mackay Isaac Whitsunday", "queensland"),
  region("ipswich-region", "Ipswich", "queensland"),
  region("toowoomba-region", "Toowoomba", "queensland"),
  region("cairns-region", "Cairns", "queensland"),

  // Tasmania — slug prefixed to stay unique; pageSlug strips the prefix.
  region("tasmania-north-west-region", "North West", "tasmania", "north-west"),
  region("hobart-region", "Hobart", "tasmania"),
  region("launceston-region", "Launceston", "tasmania"),

  // South Australia — slug prefixed; pageSlug strips the prefix.
  region("adelaide-region", "Adelaide", "south-australia"),
  region("south-australia-south-east-region", "South Australia South East", "south-australia", "south-east"),

  // Western Australia — slug prefixed; pageSlug strips the prefix.
  region("perth-region", "Perth", "western-australia"),
  region("mandurah-region", "Mandurah", "western-australia"),
  region("western-australia-outback-south-region", "Western Australia Outback South", "western-australia", "outback-south"),
  region("bunbury-region", "Bunbury", "western-australia"),
];

export function getRegionsByState(stateSlug: string): RegionInfo[] {
  return ALL_REGIONS.filter((r) => r.state.slug === stateSlug);
}
