// Server-only: the /listings/ pages the index rules (utils/seo/indexRules.ts)
// allow, for the listing sitemaps.
//
// The backend's sitemap API (/sitemap/{type}) only has the caravan-era types:
// states, regions, makes, models and make × state/region. Everything else the
// rules index is built here from params-count — body size, seats, drive type,
// each site's extra filters, single years and price bands (alone or with a
// state/region), and make/model × state/region. Every path is rebuilt with
// buildSlugFromFilters (canonical segment order — middleware 410s any other),
// must pass isIndexableListingPath, and is only listed when it has listings
// (middleware noindexes empty pages).
import { NextResponse } from "next/server";
import { site } from "@/config/sites";
import { FILTER_DEF_BY_FIELD } from "@/config/filterDefs";
import { buildSlugFromFilters } from "@/app/components/slugBuilter";
import { parseSlugToFilters } from "@/app/components/urlBuilder";
import { subjectFieldsFor } from "@/app/listings/browseSectionShared";
import { fetchSiteFacets, fetchSiteSchema } from "@/lib/siteSchema";
import { INDEXABLE_PRICE_BANDS, isIndexableListingPath } from "@/utils/seo/indexRules";
import { canonicalSitemapPaths } from "@/utils/seo/sitemapPaths";

const API_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE;
const API_KEY = process.env.MPN_API_KEY;

/** Absolute URL of /listings/ — sitemap paths are relative to it. */
export const LISTINGS_URL = `${(process.env.NEXT_PUBLIC_SITE_URL || site.url).replace(/\/$/, "")}/listings/`;

type Scope = Record<string, string>;
type Count = { slug: string; count: number };

const apiHeaders = (): Record<string, string> => ({
  Accept: "application/json",
  ...(API_KEY ? { "X-Secret-Key": API_KEY } : {}),
});

// At most this many API calls in flight — a cold cache would otherwise fire a
// few hundred params-count calls at once. A finishing call hands its slot
// straight to the next waiting one.
const MAX_IN_FLIGHT = 6;
let inFlight = 0;
const waiting: (() => void)[] = [];

async function throttled<T>(fn: () => Promise<T>): Promise<T> {
  if (inFlight < MAX_IN_FLIGHT) inFlight++;
  else await new Promise<void>((resolve) => waiting.push(resolve));
  try {
    return await fn();
  } finally {
    const next = waiting.shift();
    if (next) next();
    else inFlight--;
  }
}

/** params-count grouped by `groupBy` within `scope` — values with listings only.
 * Throws on failure: a sitemap silently missing pages is worse than a 500,
 * which crawlers retry. */
function paramsCount(groupBy: string, scope: Scope = {}): Promise<{ items: Count[]; total: number }> {
  return throttled(async () => {
    const qs = new URLSearchParams({ group_by: groupBy, ...scope });
    const res = await fetch(`${API_BASE}/params-count?${qs}`, {
      headers: apiHeaders(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`params-count HTTP ${res.status} (${qs})`);
    const json = await res.json();
    return {
      items: ((json?.data ?? []) as Count[]).filter((c) => c.count > 0),
      total: Number(json?.total_products ?? 0),
    };
  });
}

/** Listing paths from the backend sitemap API, canonical and indexable. */
export async function apiSitemapPaths(type: string): Promise<string[]> {
  const res = await throttled(() => fetch(`${API_BASE}/sitemap/${type}`, { headers: apiHeaders() }));
  const data = await res.json();
  if (!data?.success || !Array.isArray(data.paths)) {
    throw new Error(`Invalid sitemap API response (${type})`);
  }
  return canonicalSitemapPaths(data.paths);
}

/** Path relative to /listings/ ("toyota/victoria-state/"), or null when noindex. */
function indexablePath(filters: Scope): string | null {
  const path = `${buildSlugFromFilters(filters)}/`;
  return isIndexableListingPath(path) ? path.replace(/^\/listings\//, "") : null;
}

const unique = (paths: (string | null)[]) => [...new Set(paths.filter((p): p is string => !!p))];

/** Australia ({}), each state and each region with listings matching `scope` —
 * one call, plus one per state. */
async function locationsWithListings(scope: Scope = {}): Promise<Scope[]> {
  const { items: states, total } = await paramsCount("state", scope);
  const regions = await Promise.all(
    states.map(async (s) =>
      (await paramsCount("region", { ...scope, state: s.slug })).items.map((r) => ({ state: s.slug, region: r.slug })),
    ),
  );
  return [...(total > 0 ? [{}] : []), ...states.map((s) => ({ state: s.slug })), ...regions.flat()];
}

/** Pages for each location where `scope` (one year, one price band) has listings. */
async function scopePaths(scope: Scope): Promise<(string | null)[]> {
  return (await locationsWithListings(scope)).map((loc) => indexablePath({ ...loc, ...scope }));
}

/** One body size, seats value, drive type or site extra (fuel type, cab type,
 * …), alone or in a state/region. */
export async function subjectPaths(): Promise<string[]> {
  const [schema, locations] = await Promise.all([fetchSiteSchema(), locationsWithListings()]);
  const fields = subjectFieldsFor(schema.map((s) => s.field));
  const paths = await Promise.all(
    locations.flatMap((loc) =>
      fields.map(async (field) => {
        const def = FILTER_DEF_BY_FIELD[field];
        if (def?.control !== "multi") return [];
        const { items } = await paramsCount(field, loc);
        return items.map((c) => indexablePath({ ...loc, [def.param]: c.slug }));
      }),
    ),
  );
  return unique(paths.flat());
}

/** Single-year pages (2024-year), alone or in a state/region. */
export async function yearPaths(): Promise<string[]> {
  const facets = await fetchSiteFacets();
  if (!facets) throw new Error("Site facets unavailable");
  const years = Object.entries((facets.years ?? {}) as Record<string, number>)
    .filter(([, count]) => Number(count) > 0)
    .map(([year]) => year);
  const paths = await Promise.all(years.map((year) => scopePaths({ from_year: year, to_year: year })));
  return unique(paths.flat());
}

/** The indexable price bands, alone or in a state/region. The API's price
 * sitemap uses the caravan sites' bands, so these are built here instead. */
export async function pricePaths(): Promise<string[]> {
  const paths = await Promise.all(
    [...INDEXABLE_PRICE_BANDS].map((band) => {
      const { from_price, to_price } = parseSlugToFilters([band]);
      return scopePaths({
        ...(from_price && { from_price: String(from_price) }),
        ...(to_price && { to_price: String(to_price) }),
      });
    }),
  );
  return unique(paths.flat());
}

/** Make + model in a state, or in a region. params-count can't group by make
 * and model together, so a location's models are counted in one call and
 * matched to their make through the API's models sitemap. Model slugs that
 * several makes share (GWM/Haval "jolion", SsangYong/KGM "torres") are
 * counted per make instead. */
export async function modelLocationPaths(level: "state" | "region"): Promise<string[]> {
  const [models, locations] = await Promise.all([apiSitemapPaths("models"), locationsWithListings()]);
  const makesByModel = new Map<string, string[]>();
  for (const path of models) {
    const { make, model } = parseSlugToFilters(path.split("/").filter(Boolean));
    if (make && model) makesByModel.set(model, [...(makesByModel.get(model) ?? []), make]);
  }
  const isShared = (model: string) => (makesByModel.get(model)?.length ?? 0) > 1;
  const sharedMakes = [...new Set([...makesByModel.values()].filter((makes) => makes.length > 1).flat())];

  const scoped = locations.filter((loc) => (level === "region" ? !!loc.region : !!loc.state && !loc.region));
  const paths = await Promise.all(
    scoped.flatMap((loc) => [
      paramsCount("model", loc).then(({ items }) =>
        items.map((c) => {
          const makes = makesByModel.get(c.slug);
          return makes?.length === 1 ? indexablePath({ ...loc, make: makes[0], model: c.slug }) : null;
        }),
      ),
      ...sharedMakes.map((make) =>
        paramsCount("model", { ...loc, make }).then(({ items }) =>
          items.filter((c) => isShared(c.slug)).map((c) => indexablePath({ ...loc, make, model: c.slug })),
        ),
      ),
    ]),
  );
  return unique(paths.flat());
}

/** GET handler serving `load()`'s paths as a <urlset>, or a 500 when they
 * can't be built. */
export function listingSitemapRoute(
  load: () => Promise<string[]>,
  { changefreq, priority }: { changefreq: string; priority: string },
): () => Promise<NextResponse> {
  return async () => {
    try {
      const paths = await load();
      const lastmod = new Date().toISOString();
      const urls = paths
        .map(
          (path) => `
  <url>
    <loc>${LISTINGS_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
        )
        .join("");
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;
      return new NextResponse(sitemap, {
        headers: { "Content-Type": "application/xml; charset=utf-8" },
      });
    } catch (error) {
      console.error("❌ Sitemap error:", error);
      return new NextResponse("Failed to generate sitemap", { status: 500 });
    }
  };
}
