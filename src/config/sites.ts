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
  /** Vehicle-specific introductory copy shown in the home page hero. */
  homeIntro: string;
  /** Lead search term for the home title, e.g. "Convertible Cars" (defaults to `plural`). */
  homeTitleTerm: string;
  /** Home page meta title, e.g. "Convertible Cars for Sale – New & Used Convertibles in Australia". */
  homeTitle: string;
  /** Home page H1, e.g. "Convertibles for Sale in Australia". */
  homeH1: string;
  /** Meta description shared by the home and listings pages. */
  metaDescription: string;
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
  /** Home page "Buyer Guide" photo (3:2, e.g. 1024×682) under /public. */
  buyerGuideImage: string;
  /** "Thinking of selling?" card photo (3:2, e.g. 1024×682) under /public. */
  sellerCardImage: string;
  /** Product details page banner photo (3:1, e.g. 1024×342), vehicle on the right, under /public. */
  detailsBannerImage: string;
  /** Solid side-profile vehicle glyph (square SVG) for feature icons, under /public. */
  vehicleIcon: string;
  /** Branded marketplace device mockups used on seller and dealer landing pages. */
  sellMockupDesktop: string;
  sellMockupMobile: string;
  dealerMockupDesktop: string;
  dealerMockupMobile: string;
  /** 1200×630 social share image and PNG logo for schema.org, under /public
   * (made from `logo` by scripts/generate-site-seo-images.mjs). */
  ogImage: string;
  schemaLogo: string;
  /** 400×400 initials tile for the author avatar, under /public (same script). */
  avatar: string;
  /** Google Search Console HTML-tag verification token for this site. */
  googleVerification: string;
};

// Network-wide brand colours; a site can override them in its SEEDS entry.
const PRIMARY_COLOR = "#4736FE";
const SECONDARY_COLOR = "#252525";

// Network-wide Search Console token (copied from CFS); a site with its own
// Search Console property overrides it in its SEEDS entry.
const GOOGLE_VERIFICATION = "6tT6MT6AJgGromLaqvdnyyDQouJXq0VHS-7HC194xEo";

/** "#4736FE" → "71, 54, 254" */
function hexToRgb(hex: string): string {
  const n = parseInt(hex.replace("#", ""), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

// Branding per site: logo.svg and favicon.ico live in public/sites/<key>/;
// `color` / `secondaryColor` / `logo` / `favicon` override the defaults
// (see public/sites/README.md).
type SiteSeed = Pick<SiteConfig, "key" | "domain" | "brand" | "singular" | "plural" | "noun" | "nounPlural" | "homeIntro" | "article" | "slug"> &
  Partial<Pick<SiteConfig, "homeTitleTerm" | "color" | "secondaryColor" | "logo" | "favicon" | "homeBanner" | "homeBannerMobile" | "buyerGuideImage" | "sellerCardImage" | "detailsBannerImage" | "vehicleIcon" | "googleVerification">>;

const SEEDS: SiteSeed[] = [
  { key: "suv",          domain: "suvforsale.com.au",          brand: "SuvForSale.com.au",          singular: "SUV",          plural: "SUVs",          noun: "SUV",          nounPlural: "SUVs",          homeIntro: "Browse thousands of new and used SUVs for sale across Australia from trusted dealers and private sellers. Compare compact, family, off-road, hybrid and luxury SUVs to find the right vehicle for your lifestyle.", article: "an", slug: "suv", homeTitleTerm: "SUV Cars" },
  { key: "utes",         domain: "utesforsale.com",            brand: "UtesForSale.com",            singular: "Ute",          plural: "Utes",          noun: "ute",          nounPlural: "utes",          homeIntro: "Browse thousands of new and used utes for sale across Australia from trusted dealers and private sellers. Compare 4x2, 4x4, single-cab, extra-cab and dual-cab utes to find the right vehicle for work or adventure.", article: "a",  slug: "ute" },
  { key: "peoplemovers", domain: "peoplemoversforsale.com.au", brand: "PeopleMoversForSale.com.au", singular: "People Mover", plural: "People Movers", noun: "people mover", nounPlural: "people movers", homeIntro: "Browse new and used people movers for sale across Australia from trusted dealers and private sellers. Compare spacious seven-, eight- and nine-seat models to find the right vehicle for your family, group or business.", article: "a",  slug: "people-mover" },
  { key: "sedans",       domain: "sedansforsale.com.au",       brand: "SedansForSale.com.au",       singular: "Sedan",        plural: "Sedans",        noun: "sedan",        nounPlural: "sedans",        homeIntro: "Browse thousands of new and used sedans for sale across Australia from trusted dealers and private sellers. Compare compact, family, performance and luxury sedans to find the right car for your everyday drive.", article: "a",  slug: "sedan", homeTitleTerm: "Sedan Cars" },
  { key: "hatchbacks",   domain: "hatchbacksforsale.com.au",   brand: "HatchbacksForSale.com.au",   singular: "Hatchback",    plural: "Hatchbacks",    noun: "hatchback",    nounPlural: "hatchbacks",    homeIntro: "Browse thousands of new and used hatchbacks for sale across Australia from trusted dealers and private sellers. Compare compact, family, sporty, hybrid and electric hatchbacks to find the right car for your lifestyle.", article: "a",  slug: "hatchback", homeTitleTerm: "Hatchback Cars" },
  { key: "wagons",       domain: "wagonsforsale.com.au",       brand: "WagonsForSale.com.au",       singular: "Wagon",        plural: "Wagons",        noun: "wagon",        nounPlural: "wagons",        homeIntro: "Browse new and used wagons for sale across Australia from trusted dealers and private sellers. Compare family, touring, performance and luxury wagons to find the right blend of comfort, space and practicality.", article: "a",  slug: "wagon", homeTitleTerm: "Wagon Cars" },
  { key: "coupes",       domain: "coupesforsale.com.au",       brand: "CoupesForSale.com.au",       singular: "Coupe",        plural: "Coupes",        noun: "coupe",        nounPlural: "coupes",        homeIntro: "Browse new and used coupes for sale across Australia from trusted dealers and private sellers. Compare sporty, performance, grand touring and luxury coupes to find the right car for an engaging drive.", article: "a",  slug: "coupe" },
  { key: "convertibles", domain: "convertiblesforsale.com.au", brand: "ConvertiblesForSale.com.au", singular: "Convertible",  plural: "Convertibles",  noun: "convertible",  nounPlural: "convertibles",  homeIntro: "Browse new and used convertibles for sale across Australia from trusted dealers and private sellers. Compare soft-top, hard-top, sporty and luxury convertibles to find the right car for open-air driving.", article: "a",  slug: "convertible", homeTitleTerm: "Convertible Cars" },
  { key: "vans",         domain: "vansforsale.au",             brand: "VansForSale.au",             singular: "Van",          plural: "Vans",          noun: "van",          nounPlural: "vans",          homeIntro: "Browse thousands of new and used vans for sale across Australia from trusted dealers and private sellers. Compare compact, cargo, passenger and large vans to find the right vehicle for your work, family or travels.", article: "a",  slug: "van" },
  { key: "4x4",          domain: "4x4forsale.com.au",          brand: "4x4ForSale.com.au",          singular: "4x4",          plural: "4x4s",          noun: "4x4",          nounPlural: "4x4s",          homeIntro: "Browse thousands of new and used 4x4s for sale across Australia from trusted dealers and private sellers. Compare 4x4 utes, wagons and SUVs, from rugged tourers and work vehicles to family and luxury 4WDs, to find the right vehicle for your next adventure.", article: "a",  slug: "4x4" },
  { key: "4wd",          domain: "4wdforsale.com.au",          brand: "4wdForSale.com.au",          singular: "4WD",          plural: "4WDs",          noun: "4WD",          nounPlural: "4WDs",          homeIntro: "Browse new and used 4WDs for sale across Australia from trusted dealers and private sellers. Compare large 4WD SUVs, wagons and 7-seat people movers with strong towing capacity to find the right vehicle for family touring and towing.", article: "a",  slug: "4wd", googleVerification: "4pgT715RCCkhLDEKdgR3mPKHTGBwy9TB8QzK8Y78hw8" },
  { key: "awd",          domain: "awdforsale.com.au",          brand: "awdForSale.com.au",          singular: "AWD",          plural: "AWDs",          noun: "AWD",          nounPlural: "AWDs",          homeIntro: "Browse new and used all-wheel-drive vehicles for sale across Australia from trusted dealers and private sellers. Compare AWD SUVs, wagons, hatchbacks and performance cars to find confident traction, everyday comfort and the right vehicle for every road.", article: "an", slug: "awd" },
  { key: "electric",     domain: "electriccarsforsale.au",    brand: "ElectricCarsForSale.au",     singular: "Electric Car", plural: "Electric Cars", noun: "electric car", nounPlural: "electric cars", homeIntro: "Browse new and used electric cars for sale across Australia from trusted dealers and private sellers. Compare hatchbacks, sedans, SUVs and performance EVs by range, charging and features to find the right electric car for you.", article: "an", slug: "electric-car" },
  { key: "hybrid",       domain: "hybridcarsforsale.com.au",   brand: "HybridCarsForSale.com.au",   singular: "Hybrid Car",   plural: "Hybrid Cars",   noun: "hybrid car",   nounPlural: "hybrid cars",   homeIntro: "Browse new and used hybrid cars for sale across Australia from trusted dealers and private sellers. Compare mild hybrid, full hybrid and plug-in hybrid models to find the right balance of efficiency and performance.", article: "a",  slug: "hybrid-car", googleVerification: "bc2L5Uoz_kZ1xXahenqp7R7oHro9aXm2Z9c2afSxVKY" },
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
      homeTitleTerm: s.homeTitleTerm ?? s.plural,
      homeTitle: `${s.homeTitleTerm ?? s.plural} for Sale – New & Used ${s.plural} in Australia`,
      homeH1: `${s.plural} for Sale in Australia`,
      metaDescription: `Browse new and used ${s.plural} for sale across Australia. Compare ${s.singular} prices, makes and models from dealers and private sellers to find your next vehicle.`,
      color: s.color ?? PRIMARY_COLOR,
      colorRgb: hexToRgb(s.color ?? PRIMARY_COLOR),
      secondaryColor: s.secondaryColor ?? SECONDARY_COLOR,
      logo: s.logo ?? `/sites/${s.key}/logo.svg`,
      favicon: s.favicon ?? `/sites/${s.key}/favicon.ico`,
      homeBanner: s.homeBanner ?? `/sites/${s.key}/home-banner.jpg`,
      homeBannerMobile: s.homeBannerMobile ?? `/sites/${s.key}/home-banner-mobile.jpg`,
      buyerGuideImage: s.buyerGuideImage ?? `/sites/${s.key}/buyer-guide.jpg`,
      sellerCardImage: s.sellerCardImage ?? `/sites/${s.key}/seller-card.jpg`,
      detailsBannerImage: s.detailsBannerImage ?? `/sites/${s.key}/details-banner.jpg`,
      vehicleIcon: s.vehicleIcon ?? `/sites/${s.key}/vehicle-icon.svg`,
      sellMockupDesktop: `/sites/${s.key}/sell-mockup-desktop.jpg`,
      sellMockupMobile: `/sites/${s.key}/sell-mockup-mobile.jpg`,
      dealerMockupDesktop: `/sites/${s.key}/dealer-mockup-desktop.jpg`,
      dealerMockupMobile: `/sites/${s.key}/dealer-mockup-mobile.jpg`,
      ogImage: `/sites/${s.key}/og-image.png`,
      schemaLogo: `/sites/${s.key}/logo.png`,
      avatar: `/sites/${s.key}/avatar.png`,
      googleVerification: s.googleVerification ?? GOOGLE_VERIFICATION,
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
