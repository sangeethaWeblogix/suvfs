// Per-site settings for the car marketplace network.
// One codebase serves every site; each Vercel project sets NEXT_PUBLIC_SITE_KEY
// (and NEXT_PUBLIC_CFS_API_BASE = .../wp-json/mpn/v1/car-sites/<key>).
// Keys match the cars API site keys (see /wp-json/mpn/v1/car-sites).
//
// This file must stay free of browser/server-only imports: next.config.ts,
// middleware and client components all read it.

export type SiteConfig = {
  /** API site key, e.g. "utes". */
  key: string;
  /** Bare domain, e.g. "utesforsale.com". */
  domain: string;
  /** Canonical origin, no trailing slash. */
  url: string;
  /** Brand as written in copy, e.g. "UtesForSale.com". */
  brand: string;
  /** Site name for titles / schema, e.g. "Utes For Sale". */
  title: string;
  /** Vehicle noun for headings, e.g. "Ute" / "Utes". */
  singular: string;
  plural: string;
  /** Vehicle noun mid-sentence, e.g. "ute" / "utes" ("SUV" stays upper-case). */
  noun: string;
  nounPlural: string;
  /** Indefinite article for `noun`: "an SUV", "a ute". */
  article: "a" | "an";
  /** URL slug for per-site pages: /sell-my-<slug>/, /<slug>-enquiry-form/. */
  slug: string;
  /** Primary brand colour as "#RRGGBB": buttons, links, filter highlights. */
  color: string;
  /** Same colour as "r, g, b" for rgba() usages — derived from `color`. */
  colorRgb: string;
  /** Secondary brand colour as "#RRGGBB": dark surfaces such as the footer. */
  secondaryColor: string;
  /** Logo path under /public. */
  logo: string;
  /** Favicon path under /public. */
  favicon: string;
  /** Home page banner (2000×517) under /public. */
  homeBanner: string;
  /** Phone-sized home banner (about 1.94:1, e.g. 1024×529) under /public. */
  homeBannerMobile: string;
};

// Network-wide brand colours; a site can override them in its SEEDS entry.
const PRIMARY_COLOR = "#4736FE";
const SECONDARY_COLOR = "#252525";

/** "#4736FE" → "71, 54, 254" */
function hexToRgb(hex: string): string {
  const n = parseInt(hex.replace("#", ""), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

// Branding per site: logo.svg and favicon.ico live in public/sites/<key>/;
// `color` / `secondaryColor` / `logo` / `favicon` override the defaults
// (see public/sites/README.md).
type SiteSeed = Pick<SiteConfig, "key" | "domain" | "brand" | "singular" | "plural" | "noun" | "nounPlural" | "article" | "slug"> &
  Partial<Pick<SiteConfig, "color" | "secondaryColor" | "logo" | "favicon" | "homeBanner" | "homeBannerMobile">>;

const SEEDS: SiteSeed[] = [
  { key: "suv",          domain: "suvforsale.com.au",          brand: "SuvForSale.com.au",          singular: "SUV",          plural: "SUVs",          noun: "SUV",          nounPlural: "SUVs",          article: "an", slug: "suv" },
  { key: "utes",         domain: "utesforsale.com",            brand: "UtesForSale.com",            singular: "Ute",          plural: "Utes",          noun: "ute",          nounPlural: "utes",          article: "a",  slug: "ute" },
  { key: "peoplemovers", domain: "peoplemoversforsale.com.au", brand: "PeopleMoversForSale.com.au", singular: "People Mover", plural: "People Movers", noun: "people mover", nounPlural: "people movers", article: "a",  slug: "people-mover" },
  { key: "sedans",       domain: "sedancarsforsale.com.au",    brand: "SedanCarsForSale.com.au",    singular: "Sedan",        plural: "Sedans",        noun: "sedan",        nounPlural: "sedans",        article: "a",  slug: "sedan" },
  { key: "hatchbacks",   domain: "hatchbackcarsforsale.com.au", brand: "HatchbackCarsForSale.com.au",  singular: "Hatchback",    plural: "Hatchbacks",    noun: "hatchback",    nounPlural: "hatchbacks",    article: "a",  slug: "hatchback" },
  { key: "wagons",       domain: "wagoncarsforsale.com.au",    brand: "WagonCarsForSale.com.au",    singular: "Wagon",        plural: "Wagons",        noun: "wagon",        nounPlural: "wagons",        article: "a",  slug: "wagon" },
  { key: "coupes",       domain: "coupecarsforsale.com.au",    brand: "CoupeCarsForSale.com.au",    singular: "Coupe",        plural: "Coupes",        noun: "coupe",        nounPlural: "coupes",        article: "a",  slug: "coupe" },
  { key: "convertibles", domain: "convertiblecarsforsale.com.au", brand: "ConvertibleCarsForSale.com.au", singular: "Convertible",  plural: "Convertibles",  noun: "convertible",  nounPlural: "convertibles",  article: "a",  slug: "convertible" },
  { key: "vans",         domain: "vansforsale.au",             brand: "VansForSale.au",             singular: "Van",          plural: "Vans",          noun: "van",          nounPlural: "vans",          article: "a",  slug: "van" },
  { key: "4x4",          domain: "4x4forsale.com.au",          brand: "4x4ForSale.com.au",          singular: "4x4",          plural: "4x4s",          noun: "4x4",          nounPlural: "4x4s",          article: "a",  slug: "4x4" },
  { key: "electric",     domain: "electriccarsforsale.au",     brand: "ElectricCarsForSale.au",     singular: "Electric Car", plural: "Electric Cars", noun: "electric car", nounPlural: "electric cars", article: "an", slug: "electric-car" },
  { key: "hybrid",       domain: "hybridcarsforsale.com.au",   brand: "HybridCarsForSale.com.au",   singular: "Hybrid Car",   plural: "Hybrid Cars",   noun: "hybrid car",   nounPlural: "hybrid cars",   article: "a",  slug: "hybrid-car" },
];

export const SITES: Record<string, SiteConfig> = Object.fromEntries(
  SEEDS.map((s) => [
    s.key,
    {
      ...s,
      // Canonical host is www (the API's site.url is the bare domain; Vercel
      // redirects bare → www).
      url: `https://www.${s.domain}`,
      title: `${s.plural} For Sale`,
      color: s.color ?? PRIMARY_COLOR,
      colorRgb: hexToRgb(s.color ?? PRIMARY_COLOR),
      secondaryColor: s.secondaryColor ?? SECONDARY_COLOR,
      logo: s.logo ?? `/sites/${s.key}/logo.svg`,
      favicon: s.favicon ?? `/sites/${s.key}/favicon.ico`,
      homeBanner: s.homeBanner ?? `/sites/${s.key}/home-banner.jpg`,
      homeBannerMobile: s.homeBannerMobile ?? `/sites/${s.key}/home-banner-mobile.jpg`,
    } satisfies SiteConfig,
  ]),
);

export const DEFAULT_SITE_KEY = "suv";

export function getSite(key: string | undefined = process.env.NEXT_PUBLIC_SITE_KEY): SiteConfig {
  return SITES[key ?? DEFAULT_SITE_KEY] ?? SITES[DEFAULT_SITE_KEY];
}

/** The site this build serves (fixed at build time per Vercel project). */
export const site = getSite();

/** Listings-page promo cards in public/sites/<key>/, made by scripts/generate-site-promos.mjs. */
export function promoPaths(s: SiteConfig) {
  return {
    sell: `/sites/${s.key}/sell-my-${s.slug}.jpg`,
    dealer: `/sites/${s.key}/${s.slug}-dealer-advertising.jpg`,
  };
}

export const sitePromos = promoPaths(site);

/** Per-site page paths, always with a trailing slash. */
export const sitePaths = {
  sell: `/sell-my-${site.slug}/`,
  enquiry: `/${site.slug}-enquiry-form/`,
};
