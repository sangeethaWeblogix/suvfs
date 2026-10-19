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
  /** Bare domain, e.g. "utesforsale.com.au". */
  domain: string;
  /** Canonical origin, no trailing slash. */
  url: string;
  /** Brand as written in copy, e.g. "UtesForSale.com.au". */
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
  /** Brand colour (placeholder until real branding lands). */
  color: string;
  /** Same colour as "r, g, b" for rgba() usages. */
  colorRgb: string;
  /** Logo path under /public. */
  logo: string;
};

const PLACEHOLDER_COLOR = "#4736FE";
const PLACEHOLDER_RGB = "71, 54, 254";

type SiteSeed = Pick<SiteConfig, "key" | "domain" | "brand" | "singular" | "plural" | "noun" | "nounPlural" | "article" | "slug"> &
  Partial<Pick<SiteConfig, "color" | "colorRgb" | "logo">>;

const SEEDS: SiteSeed[] = [
  { key: "suv",          domain: "suvforsale.com.au",          brand: "SuvForSale.com.au",          singular: "SUV",          plural: "SUVs",          noun: "SUV",          nounPlural: "SUVs",          article: "an", slug: "suv", logo: "/images/sfs_logo.svg" },
  { key: "utes",         domain: "utesforsale.com.au",         brand: "UtesForSale.com.au",         singular: "Ute",          plural: "Utes",          noun: "ute",          nounPlural: "utes",          article: "a",  slug: "ute" },
  { key: "peoplemovers", domain: "peoplemoversforsale.com.au", brand: "PeopleMoversForSale.com.au", singular: "People Mover", plural: "People Movers", noun: "people mover", nounPlural: "people movers", article: "a",  slug: "people-mover" },
  { key: "sedans",       domain: "sedansforsale.com.au",       brand: "SedansForSale.com.au",       singular: "Sedan",        plural: "Sedans",        noun: "sedan",        nounPlural: "sedans",        article: "a",  slug: "sedan" },
  { key: "hatchbacks",   domain: "hatchbacksforsale.com.au",   brand: "HatchbacksForSale.com.au",   singular: "Hatchback",    plural: "Hatchbacks",    noun: "hatchback",    nounPlural: "hatchbacks",    article: "a",  slug: "hatchback" },
  { key: "wagons",       domain: "wagonsforsale.com.au",       brand: "WagonsForSale.com.au",       singular: "Wagon",        plural: "Wagons",        noun: "wagon",        nounPlural: "wagons",        article: "a",  slug: "wagon" },
  { key: "coupes",       domain: "coupesforsale.com.au",       brand: "CoupesForSale.com.au",       singular: "Coupe",        plural: "Coupes",        noun: "coupe",        nounPlural: "coupes",        article: "a",  slug: "coupe" },
  { key: "convertibles", domain: "convertiblesforsale.com.au", brand: "ConvertiblesForSale.com.au", singular: "Convertible",  plural: "Convertibles",  noun: "convertible",  nounPlural: "convertibles",  article: "a",  slug: "convertible" },
  { key: "vans",         domain: "vansforsale.com.au",         brand: "VansForSale.com.au",         singular: "Van",          plural: "Vans",          noun: "van",          nounPlural: "vans",          article: "a",  slug: "van" },
  { key: "4x4",          domain: "4x4forsale.com.au",          brand: "4x4ForSale.com.au",          singular: "4x4",          plural: "4x4s",          noun: "4x4",          nounPlural: "4x4s",          article: "a",  slug: "4x4" },
  { key: "electric",     domain: "electriccarsforsale.com.au", brand: "ElectricCarsForSale.com.au", singular: "Electric Car", plural: "Electric Cars", noun: "electric car", nounPlural: "electric cars", article: "an", slug: "electric-car" },
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
      color: s.color ?? PLACEHOLDER_COLOR,
      colorRgb: s.colorRgb ?? PLACEHOLDER_RGB,
      // Placeholder text logos until real branding lands (public/sites/<key>/logo.svg).
      logo: s.logo ?? `/sites/${s.key}/logo.svg`,
    } satisfies SiteConfig,
  ]),
);

export const DEFAULT_SITE_KEY = "suv";

export function getSite(key: string | undefined = process.env.NEXT_PUBLIC_SITE_KEY): SiteConfig {
  return SITES[key ?? DEFAULT_SITE_KEY] ?? SITES[DEFAULT_SITE_KEY];
}

/** The site this build serves (fixed at build time per Vercel project). */
export const site = getSite();

/** Per-site page paths, always with a trailing slash. */
export const sitePaths = {
  sell: `/sell-my-${site.slug}/`,
  enquiry: `/${site.slug}-enquiry-form/`,
};
