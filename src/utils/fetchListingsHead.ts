import { cache } from "react";
import { site } from "@/config/sites";
import { parseSlugToFilters } from "@/app/components/urlBuilder";
import { appendFilterParams } from "@/config/filterDefs";
import { poolUrl } from "@/lib/apiBase";
import { websiteLd, organizationLd, WEBSITE_ID } from "@/utils/seo/siteSchema";

/** Local shapes for the /pool response fields this file actually reads —
 * kept here instead of importing from the (removed) old listings API module. */
type Item = {
  title: string;
  slug?: string;
  condition?: string;
  regular_price?: number | string | null;
  sale_price?: number | string | null;
  r2_thumbnails?: string[];
};

type ApiResponse = {
  success?: boolean;
  seo_v2?: {
    h1?: string;
    meta_title?: string;
    meta_description?: string;
    short_description?: string;
    footer_description?: string;
    faq?: string | { q: string; a: string }[];
  };
  pagination?: {
    total_products?: number;
  };
  data?: {
    products?: Item[];
    exclusive_products?: Item[];
    emp_exclusive_products?: Item[];
    premium_products?: Item[];
  };
  emp_exclusive_products?: Item[];
};

const BASE_URL = site.url;
const API_KEY = process.env.MPN_API_KEY;

/** Manual TTL cache (mirrors seoCache/productCache in middleware.ts) instead of
 * Next's `next: { revalidate }` fetch Data Cache — that internal stream-teeing
 * mechanism races with bots that disconnect mid-render, throwing
 * "controller[kState].transformAlgorithm is not a function". Plain in-memory
 * Map, server-side only — doesn't touch response headers, so it has no effect
 * on Cloudflare's edge cache. */
const headPoolCache = new Map<string, { data: ApiResponse | null; expires: number }>();
const HEAD_POOL_CACHE_TTL = 60 * 60 * 1000; // 1 hour

/** Same backend endpoint as /api/pool-listings/ (pool_test, engine=typesense) —
 * used here instead of new_optimize_code because pool_test has proven far more
 * reliable (new_optimize_code intermittently returns a PHP notice from the ACF
 * plugin instead of JSON). Response is flat (products/premium_products/etc. at
 * the top level); adapted into the nested ApiResponse shape buildListingsJsonLd
 * already expects, so no caller changes are needed. */
async function fetchPoolListingsForHead(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters: any,
  page: number
): Promise<ApiResponse | null> {
  const params = new URLSearchParams();
  params.set("order_by", "default");
  params.set("seed", "1"); // fixed seed — this is for SEO schema, not user-facing shuffle
  params.set("page", String(page));
  if (filters.state) params.set("state", String(filters.state));
  if (filters.make) params.set("make", String(filters.make));
  if (filters.model) params.set("model", String(filters.model));
  if (filters.region) params.set("region", String(filters.region));
  if (filters.suburb) params.set("suburb", String(filters.suburb));
  if (filters.pincode) params.set("pincode", String(filters.pincode));
  if (filters.from_price) params.set("from_price", String(filters.from_price));
  if (filters.to_price) params.set("to_price", String(filters.to_price));
  if (filters.from_year) params.set("from_year", String(filters.from_year));
  if (filters.to_year) params.set("to_year", String(filters.to_year));
  if (filters.condition) params.set("condition", String(filters.condition));
  if (filters.search || filters.keyword) params.set("search", String(filters.search ?? filters.keyword));
  appendFilterParams(params, filters);

  const url = poolUrl(params.toString());

  const cached = headPoolCache.get(url);
  if (cached && cached.expires > Date.now()) return cached.data;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        Accept: "application/json",
        ...(API_KEY && { "X-Secret-Key": API_KEY }),
      },
      cache: "no-store",
    });
  } catch {
    return null;
  }
  if (!res.ok) return null;

  const raw = await res.text();
  const jsonStart = raw.indexOf("{");
  const cleaned = jsonStart <= 0 ? raw : raw.substring(jsonStart);

  let json: any;
  try {
    json = JSON.parse(cleaned);
  } catch {
    return null;
  }

  // /pool buckets products into featured/new/used (+ premium/exclusive) —
  // flatten the non-exclusive buckets into the flat `products` list this
  // module's JSON-LD builder expects (no more top-level flat `products`).
  const combinedProducts = [
    ...(json.featured_products ?? []),
    ...(json.new_products ?? []),
    ...(json.used_products ?? []),
  ];
  const data: ApiResponse = {
    success: json.success,
    seo_v2: json.seo ?? json.seo_v2,
    pagination: json.pagination,
    data: {
      products: combinedProducts,
      exclusive_products: json.exclusive_products ?? [],
      emp_exclusive_products: json.exclusive_products ?? [],
      premium_products: json.premium_products ?? [],
    },
    emp_exclusive_products: json.exclusive_products ?? [],
  };
  headPoolCache.set(url, { data, expires: Date.now() + HEAD_POOL_CACHE_TTL });
  return data;
}

function stripHtml(raw: string): string {
  return raw
    .replace(/<\/(h[1-6]|p|div|li|br)\s*>/gi, ". ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/\s*\.\s*\.\s*/g, ". ") // collapse doubled periods from adjacent block tags
    .replace(/\s+/g, " ")
    .replace(/\s+\./g, ".")
    .trim();
}

type Faq = { q: string; a: string };

function parseFaq(raw?: string | Faq[]): Faq[] {
  if (!raw) return [];
  try {
    // The API now sends faq as a real array; older rows were a JSON string.
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((f): f is Faq => !!f?.q && !!f?.a);
  } catch {
    return [];
  }
}

/** A car on the listings page: name, photos, price and condition — only what
 * /pool returns, so no per-car API calls. The @id is the product page's
 * vehicle node, where the full Car schema (brand, model, specs) lives. */
function buildCarListItem(item: Item, position: number) {
  const url = `${BASE_URL}/product/${item.slug}/`;
  const rawPrice = item.sale_price != null && item.sale_price !== "" ? item.sale_price : item.regular_price;
  const price = String(rawPrice ?? "").replace(/[^0-9.]/g, "");
  const images = (item.r2_thumbnails ?? []).slice(0, 5);
  const condition =
    item.condition?.toLowerCase() === "new"
      ? "https://schema.org/NewCondition"
      : "https://schema.org/UsedCondition";

  return {
    "@type": "ListItem",
    position,
    url,
    item: {
      // Google only reads a bare Car for its (US-only) vehicle listings —
      // the Product type makes it eligible for product snippets / merchant listings.
      "@type": ["Product", "Car"],
      "@id": `${url}#vehicle`,
      name: item.title,
      url,
      ...(images.length > 0 && { image: images }),
      itemCondition: condition,
      offers: {
        "@type": "Offer",
        url,
        ...(price && { price }),
        priceCurrency: "AUD",
        availability: "https://schema.org/InStock",
        itemCondition: condition,
      },
    },
  };
}

/** One @graph for the listings page: site, organisation, the page itself,
 * its breadcrumb, the cars shown on it and its FAQ (only when the page has
 * one), linked by @id. */
export function buildListingsJsonLd(
  response: ApiResponse,
  pageUrl: string,
  breadcrumbs: { name: string; url: string }[]
) {
  const seo = response?.seo_v2;
  const pageTitle = seo?.h1 || seo?.meta_title || `${site.plural} for Sale in Australia`;

  // Exclusive listings can also appear in the main buckets — list each car once.
  const seen = new Set<string>();
  const allProducts = [
    ...(response.data?.products || []),
    ...(response.data?.emp_exclusive_products || []),
  ].filter((p) => p.slug && !seen.has(p.slug) && seen.add(p.slug));

  // The hero text shown on the page — first paragraph of the short description.
  const shortDescription = seo?.short_description
    ? stripHtml(seo.short_description.split(/\n\s*\n/)[0])
    : "";
  const pageDescription = shortDescription || seo?.meta_description || "";

  const faqItems = parseFaq(seo?.faq);

  const breadcrumbId = `${pageUrl}#breadcrumb`;
  const listId = `${pageUrl}#listings`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      websiteLd(),
      organizationLd(),
      {
        "@type": "CollectionPage",
        "@id": pageUrl,
        url: pageUrl,
        name: pageTitle,
        ...(pageDescription && { description: pageDescription }),
        inLanguage: "en-AU",
        isPartOf: { "@id": WEBSITE_ID },
        breadcrumb: { "@id": breadcrumbId },
        ...(allProducts.length > 0 && { mainEntity: { "@id": listId } }),
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: b.url,
        })),
      },
      ...(allProducts.length > 0
        ? [
            {
              "@type": "ItemList",
              "@id": listId,
              itemListOrder: "https://schema.org/ItemListUnordered",
              numberOfItems: allProducts.length,
              itemListElement: allProducts.map((item, idx) => buildCarListItem(item, idx + 1)),
            },
          ]
        : []),
      ...(faqItems.length > 0
        ? [
            {
              "@type": "FAQPage",
              "@id": `${pageUrl}#faq`,
              isPartOf: { "@id": pageUrl },
              mainEntity: faqItems.map((f) => ({
                "@type": "Question",
                name: stripHtml(f.q),
                acceptedAnswer: {
                  "@type": "Answer",
                  text: stripHtml(f.a),
                },
              })),
            },
          ]
        : []),
    ],
  };
}

// React.cache deduplicates within a single request; the 1hr cross-request cache
// is handled by headPoolCache above.
const fetchListingsForHead = cache(
  async (pathnameKey: string): Promise<ApiResponse | null> => {
    try {
      if (pathnameKey === "/listings/") {
        return await fetchPoolListingsForHead({}, 1);
      }
      const slugString = pathnameKey
        .replace(/^\/listings\//, "")
        .replace(/\/$/, "");
      const slugParts = slugString.split("/").filter(Boolean);
      const rawFilters = parseSlugToFilters(slugParts, {});
      const page = rawFilters.page ? Number(rawFilters.page) : 1;
      return await fetchPoolListingsForHead(rawFilters, page);
    } catch {
      return null;
    }
  }
);

export function buildBreadcrumbs(pathname: string): { name: string; url: string }[] {
  const crumbs: { name: string; url: string }[] = [
    { name: "Home", url: `${BASE_URL}/` },
    { name: `${site.plural} for Sale`, url: `${BASE_URL}/listings/` },
  ];
  if (pathname === "/listings/" || pathname === "/listings") return crumbs;

  const slugString = pathname.replace(/^\/listings\//, "").replace(/\/$/, "");
  const slugParts = slugString.split("/").filter(Boolean);
  slugParts.forEach((segment, i) => {
    const label = segment
      .replace(/-(state|region|condition|search|suburb)$/, "")
      .replace(/[-+]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push({
      name: label,
      url: `${BASE_URL}/listings/${slugParts.slice(0, i + 1).join("/")}/`,
    });
  });
  return crumbs;
}

export default fetchListingsForHead;
