  // utils/parseFilters.ts
import { parseFilterSegment } from "@/config/filterDefs";

export interface Filters {
  condition?: string;
  state?: string;
  region?: string;
  suburb?: string;
  pincode?: string;
  from_price?: string;
  to_price?: string;
  make?: string;
  model?: string;
  orderby?: string;
  radius_kms?: string;
  page?: string;
  from_year?: number | string;
  to_year?: number | string;
  search?: string;
  clickid?: string | null;
  keyword?: string; // parsed -> canonicalized to `search`
  /** Car-site filters from config/filterDefs.ts (fuel_type, from_odometer, …). */
  [key: string]: unknown;
}

/**
 * Parse path segments & query params into a Filters object.
 * @param slugParts Array of path segments (already decoded if possible)
 * @param query Optional query params object (e.g. from req.query or searchParams)
 */
export function parseSlugToFilters(
  slugParts: string[],
  query?: Record<string, string | string[] | undefined> // Works with most frameworks
): Filters {
  const filters: Filters = {};
  const conditionMap: Record<string, string> = {
    new: "New",
    used: "Used",
  };

  // Caravan-era segments (-category, -kg-atm, -length-in-feet,
  // -people-sleeping-capacity, -caravans-range) are not parsed: car listings
  // have none of these attributes. They stay reserved so they are never read
  // as a make/model — the rebuilt canonical path then differs and middleware
  // answers 410.
  const hasReservedSuffix = (s: string) =>
    /-(category|condition|state|region|suburb|keyword)$/.test(s) ||
    /-(kg-atm|length-in-feet|people-sleeping-capacity|caravans-range)$/.test(s) ||
    /^over-\d+/.test(s) ||
    /^under-\d+/.test(s) ||
    /^between-/.test(s) ||
    /^\d{4}$/.test(s) ||
    s.includes("="); // e.g. search=, keyword=

  slugParts.forEach((_part) => {
    const decoded = decodeURIComponent(_part);
    const part = decoded.split("?")[0];
    if (!part) return;

    // --- Car-site filters (fuel-type, odometer, seats, …) ---
    const siteFilter = parseFilterSegment(part);
    if (siteFilter) {
      Object.assign(filters, siteFilter);
      return;
    }

    // --- Typed segments ---
    if (part.endsWith("-condition")) {
      // Multi-select: new-or-demo-condition → "New,demo"
      filters.condition = part
        .replace("-condition", "")
        .toLowerCase()
        .split("-or-")
        .map((slug) => conditionMap[slug] || slug)
        .join(",");
      return;
    }

    if (part.endsWith("-state")) {
      filters.state = part
        .replace("-state", "")
        .replace(/-/g, " ")
        .toLowerCase();
      return;
    }

    if (part.endsWith("-region")) {
      filters.region = part
        .replace("-region", "")
        .replace(/-/g, " ")
        .toLowerCase();
      return;
    }
    const suburbWithPin = part.match(/^([a-z0-9-]+)-(\d{4})-suburb$/);
    if (suburbWithPin) {
      const [, suburbPart, pincode] = suburbWithPin;
      filters.suburb = suburbPart.replace(/-/g, " ").toLowerCase();
      filters.pincode = pincode;
      return;
    }

    // Suburb only (e.g., jacana-suburb)
    const suburbOnly = part.match(/^([a-z0-9-]+)-suburb$/);
    if (suburbOnly) {
      const [, suburbPart] = suburbOnly;
      filters.suburb = suburbPart.replace(/-/g, " ").toLowerCase();
      return;
    }

    // Pincode only (rare case)
    if (/^\d{4}$/.test(part)) {
      filters.pincode = part;
      return;
    }
    // Price
    if (/^over-\d+$/.test(part)) {
      filters.from_price = part.replace("over-", "");
      return;
    }
    if (/^under-\d+$/.test(part)) {
      filters.to_price = part.replace("under-", "");
      return;
    }
    if (/^between-\d+-\d+$/.test(part)) {
      const match = part.match(/between-(\d+)-(\d+)/);
      if (match) {
        filters.from_price = match[1];
        filters.to_price = match[2];
      }
      return;
    }

    // Search + fallback
    if (part.endsWith("-search")) {
      const keyword = part
        .replace(/-search$/, "")
        .replace(/-/g, " ")
        .trim();

      filters.search = keyword;
      return;
    }

    if (part.startsWith("radius_kms=")) {
      const radiusVal = part.replace("radius_kms=", "");
      if (!isNaN(Number(radiusVal))) {
        filters.radius_kms = radiusVal;
        return;
      }
    }

    // make / model fallback – only if safe and no search is present
    if (
      !hasReservedSuffix(part) &&
      !part.includes("=") &&
      isNaN(Number(part)) &&
      !filters.search // prevent make/model if search is there
    ) {
      if (!filters.make) {
        filters.make = part;
        return;
      }
      if (!filters.model) {
        filters.model = part;
        return;
      }
    }
  });

  // If suburb present, ignore region due to canonical URL structure

  // ---- QUERY STRING SUPPORT ----
  if (query) {
    // Helper: handle arrays from query (e.g., Next.js gives string[])
    const getScalar = (v: string | string[] | undefined): string | undefined =>
      Array.isArray(v) ? v[0] : v;

    if (query.radius_kms) filters.radius_kms = getScalar(query.radius_kms);
    if (query.clickid) filters.clickid = getScalar(query.clickid);
    if (query.orderby) filters.orderby = getScalar(query.orderby);
    if (query.search) filters.search = getScalar(query.search);
    if (query.keyword && !filters.search)
      filters.search = getScalar(query.keyword); // fallback
  }

  return filters;
}
