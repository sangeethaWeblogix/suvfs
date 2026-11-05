// Server-only: link lists for the /sitemap/ HTML sitemap (footer "Sitemap").
//
// Every URL in the XML sitemaps (products + each listings sitemap) gets a
// plain, crawlable link from /sitemap/ or one of its /sitemap/{section}/
// pages, so no indexable page is an "orphan" (Ahrefs: "has no incoming
// internal links"). It uses the same generators as the XML sitemaps, so both
// always list the same URLs.
import { site } from "@/config/sites";
import { parseSlugToFilters } from "@/app/components/urlBuilder";
import { generateHeadingFromFilters } from "@/utils/seo/meta";
import { apiSitemapPaths, modelLocationPaths, pricePaths, subjectPaths, yearPaths } from "@/lib/listingSitemaps";

const API_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE;
const API_KEY = process.env.MPN_API_KEY;

/** Links shown per /sitemap/{section}/{n}/ page. */
export const SITEMAP_PAGE_SIZE = 200;

export type SitemapLink = { href: string; label: string };
type Source = { key: string; load: () => Promise<SitemapLink[]> };
export type SitemapSection = Source & { title: string; description: string };

/** "toyota/prado/queensland-state/" -> "Toyota Prado for Sale in Queensland" (like that page's title). */
function listingLink(path: string): SitemapLink {
  const segments = path.split("/").filter(Boolean);
  const label = generateHeadingFromFilters(parseSlugToFilters(segments))
    .replace(/(,| in) Australia$/, "");
  return { href: `/listings/${segments.join("/")}/`, label };
}

const listingLinks = async (...loads: Promise<string[]>[]) => (await Promise.all(loads)).flat().map(listingLink);

/** "2022-mercedes-benz-glc200-awd" -> "2022 Mercedes Benz Glc200 Awd" */
const humanize = (slug: string) =>
  slug.split("-").filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

/** Every product in listings-sitemap.xml. */
async function productLinks(): Promise<SitemapLink[]> {
  const res = await fetch(`${API_BASE}/sitemap/listings`, {
    headers: { Accept: "application/json", ...(API_KEY ? { "X-Secret-Key": API_KEY } : {}) },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`sitemap/listings HTTP ${res.status}`);
  const data = await res.json();
  if (!data?.success || !Array.isArray(data.paths)) throw new Error("Invalid sitemap API response (listings)");
  return data.paths.map((p: string) => {
    const slug = String(p).replace(/^\/+|\/+$/g, "");
    return { href: `/product/${slug}/`, label: humanize(slug) };
  });
}

// ── Main /sitemap/ page: small lists shown in full (one API call each) ──

export const INLINE_SOURCES = {
  states: { key: "states", load: () => listingLinks(apiSitemapPaths("states")) },
  regions: { key: "regions", load: () => listingLinks(apiSitemapPaths("regions")) },
  makes: { key: "makes", load: () => listingLinks(apiSitemapPaths("makes")) },
  models: { key: "models", load: () => listingLinks(apiSitemapPaths("models")) },
} satisfies Record<string, Source>;

export const BUY_BASICS: SitemapLink[] = [
  { href: "/listings/", label: `${site.plural} for Sale` },
  { href: "/listings/new-condition/", label: `New ${site.plural} for Sale` },
  { href: "/listings/used-condition/", label: `Used ${site.plural} for Sale` },
];

// ── Large lists: /sitemap/{key}/ pages, SITEMAP_PAGE_SIZE links each ──

export const SITEMAP_SECTIONS: SitemapSection[] = [
  {
    key: "listings",
    title: `All ${site.plural} Listed for Sale (A–Z)`,
    description: `Every new and used ${site.noun} listed for sale.`,
    load: productLinks,
  },
  {
    key: "make-locations",
    title: `${site.singular} Makes by State & Region`,
    description: `Each make of ${site.noun} for sale in each state and region.`,
    load: () => listingLinks(apiSitemapPaths("state-make"), apiSitemapPaths("region-make")),
  },
  {
    key: "model-locations",
    title: `${site.singular} Models by State & Region`,
    description: `Each ${site.noun} model for sale in each state and region.`,
    load: () => listingLinks(modelLocationPaths("state"), modelLocationPaths("region")),
  },
  {
    key: "features",
    title: `${site.plural} by Size, Seats & Features`,
    description: `${site.plural} for sale by body size, seats, drive type and more.`,
    load: () => listingLinks(subjectPaths()),
  },
  {
    key: "years",
    title: `${site.plural} by Year`,
    description: `${site.plural} for sale by model year.`,
    load: () => listingLinks(yearPaths()),
  },
  {
    key: "prices",
    title: `${site.plural} by Price`,
    description: `${site.plural} for sale by price range.`,
    load: () => listingLinks(pricePaths()),
  },
];

// The generators make many API calls, so each list is built once per hour per
// server instance (failures are not cached).
const TTL_MS = 60 * 60 * 1000;
const cache = new Map<string, { at: number; links: Promise<SitemapLink[]> }>();

export function getLinks(source: Source): Promise<SitemapLink[]> {
  const hit = cache.get(source.key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.links;

  const links = source.load().then((all) => {
    const byHref = new Map(all.map((l) => [l.href, l]));
    return [...byHref.values()].sort((a, b) => a.label.localeCompare(b.label, "en", { numeric: true }));
  });
  cache.set(source.key, { at: Date.now(), links });
  links.catch(() => cache.delete(source.key));
  return links;
}
