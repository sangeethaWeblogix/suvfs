 import { parseSlugToFilters } from "@/app/components/urlBuilder";
import { site } from "@/config/sites";
import type { Metadata } from "next";
import { isIndexableListingPath } from "./indexRules";

// ─── Title generation from parsed filters (no API call needed) ───
const STATE_NAMES: Record<string, string> = {
  "victoria": "Victoria",
  "new-south-wales": "New South Wales",
  "queensland": "Queensland",
  "south-australia": "South Australia",
  "western-australia": "Western Australia",
  "tasmania": "Tasmania",
  "northern-territory": "Northern Territory",
  "australian-capital-territory": "Australian Capital Territory",
};

function titleCase(s: string): string {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function fmtPrice(n: string): string {
  return `$${parseInt(n, 10).toLocaleString("en-AU")}`;
}

function getPriceText(parsed: ReturnType<typeof parseSlugToFilters>): string {
  const from = parsed.from_price ? String(parsed.from_price) : null;
  const to   = parsed.to_price   ? String(parsed.to_price)   : null;
  if (from && to) return `${fmtPrice(from)} - ${fmtPrice(to)}`;
  if (to)         return `Under ${fmtPrice(to)}`;
  if (from)       return `Over ${fmtPrice(from)}`;
  return "";
}

export function generateTitleFromFilters(
  parsed: ReturnType<typeof parseSlugToFilters>
): string {
  // Build location suffix (shared)
  const locationSuffix = parsed.state
    ? (() => {
        const sk = parsed.state.toLowerCase().replace(/\s+/g, "-");
        const sn = STATE_NAMES[sk] ?? titleCase(parsed.state);
        return parsed.region
          ? ` in ${titleCase(parsed.region)}, ${sn}`
          : ` in ${sn}, Australia`;
      })()
    : " in Australia";

  // Keyword search: treat search term as the primary noun
  if (parsed.search) {
    const kw = titleCase(parsed.search);
    const noun = kw.toLowerCase().endsWith(site.plural.toLowerCase()) ? kw : `${kw} ${site.plural}`;
    return `${noun} for Sale${locationSuffix}`;
  }

  const parts: string[] = [];

  // Year prefix
  if (parsed.from_year) parts.push(String(parsed.from_year));

  if (parsed.condition === "New" || parsed.condition === "new") parts.push("New");
  else if (parsed.condition === "Used" || parsed.condition === "used") parts.push("Used");

  if (parsed.make) parts.push(titleCase(parsed.make));
  if (parsed.model) parts.push(titleCase(parsed.model));

  const baseNoun = parts.length > 0 ? `${parts.join(" ")} ${site.plural}` : site.plural;
  const price = getPriceText(parsed);
  const pricePart = price ? ` ${price}` : "";

  return `${baseNoun} for Sale${pricePart}${locationSuffix}`;
}

export async function metaFromSlug(
  filters: string[] = [],
  searchParams: Record<string, string | string[] | undefined> = {}
): Promise<Metadata> {
  const BASE_URL = site.url;

  const parsed = parseSlugToFilters(filters, searchParams);

  const slugPath = filters.length > 0 ? filters.join("/") : "";
  const canonicalUrl = `${BASE_URL}/listings/${slugPath ? slugPath + "/" : ""}`;
  const urlPath = `/listings/${slugPath ? slugPath + "/" : ""}`;
  const robotsResult = { index: isIndexableListingPath(urlPath) };

  // ── suburb canonical fix ──
  let canonical = canonicalUrl;
  if (parsed.suburb) {
    const locationSegments = filters.filter(
      (seg) =>
        seg.endsWith("-state") ||
        seg.endsWith("-region") ||
        seg.endsWith("-suburb")
    );
    canonical = `${BASE_URL}/listings/${locationSegments.join("/")}/`;
  }

  // ── keyword combination canonical fix ──
  // For /listings/victoria-state/.../keyword-search/ → canonical = /listings/keyword-search/
  const searchSeg = (parsed.search ?? parsed.keyword)
    ? filters.find((seg) => seg.endsWith("-search"))
    : null;
  if (searchSeg && !robotsResult.index) {
    canonical = `${BASE_URL}/listings/${searchSeg}/`;
  }

  // Append searchParams (except page=1 and shuffle_seed)
  const spEntries = Object.entries(searchParams).filter(([k, v]) => {
    if (k === "page" && String(v) === "1") return false;
    if (k === "shuffle_seed") return false;
    return true;
  });
  if (spEntries.length > 0) {
    const qs = spEntries
      .map(([k, v]) => `${k}=${Array.isArray(v) ? v[0] : v}`)
      .join("&");
    canonical += `?${qs}`;
  }

  const title = generateTitleFromFilters(parsed);
  const description =
    `Browse new and used ${site.nounPlural} for sale across Australia. Compare prices, makes and models from dealers and private sellers.`;

  return {
    title: { absolute: title },
    description,
    robots: { index: robotsResult.index },
    verification: {
      google: site.googleVerification,
    },
    alternates: { canonical, languages: {}, media: {} },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [
        {
          url: `${site.url}${site.ogImage}`,
          width: 1200,
          height: 630,
          alt: `${site.plural} for Sale Australia`,
        },
      ],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
