// Backend URLs — all derived from NEXT_PUBLIC_CFS_API_BASE in .env.
// e.g. https://admin-cars.marketplacenetwork.com.au/wp-json/mpn/v1/car-sites/suv
export const API_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE ?? "";

// WordPress site root of the same backend (e.g. https://admin-cars.marketplacenetwork.com.au),
// used for other WP namespaces: ads-manager banners, contact-form-7.
export const WP_ORIGIN = API_BASE ? new URL(API_BASE).origin : "";

/** Listings pool URL. Uses /cars/pool?site=<key> rather than
 * /car-sites/<key>/pool: same products, but only the ?site= form returns the
 * site's SEO overrides (short/footer description + FAQ) in seo_v2. */
export function poolUrl(query = ""): string {
  const q = query.replace(/^\?/, "");
  const m = API_BASE.match(/\/car-sites\/([^/]+)\/?$/);
  if (!m) return `${API_BASE}/pool${q ? `?${q}` : ""}`;
  return `${API_BASE.slice(0, m.index)}/cars/pool?site=${m[1]}${q ? `&${q}` : ""}`;
}
