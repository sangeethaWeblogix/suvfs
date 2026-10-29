// Per-listing vehicle details from the product detail API. The /pool listings
// API only returns title/price/condition/location, so listing cards (via
// /api/listing-specs) fill the rest from here. Server-side only, cached in memory.

const API_BASE = process.env.MPN_API_BASE || process.env.NEXT_PUBLIC_CFS_API_BASE;
const API_KEY = process.env.MPN_API_KEY;

const TTL_MS = 30 * 60 * 1000;
const CONCURRENCY = 6;
const MAX_CACHE_ENTRIES = 2000;

export type ListingDetail = {
  make?: string;
  model?: string;
  variant?: string;
  year?: string;
  body_type?: string;
  odometer?: string;
  transmission?: string;
  fuel_type?: string;
  drive_type?: string;
  seats?: string;
  suburb?: string;
};

const cache = new Map<string, { detail: ListingDetail | null; expires: number }>();

const str = (v: unknown) => (v == null || v === "" ? undefined : String(v));
// make/model come back as taxonomy objects ({ name, slug }).
const nameOf = (v: unknown) =>
  typeof v === "object" && v !== null ? str((v as { name?: unknown }).name) : str(v);

/** null = the listing doesn't exist (cached); undefined = request failed (not
 * cached, so a slow or flaky backend doesn't pin an empty result for 30 min). */
async function fetchOne(slug: string, timeoutMs: number): Promise<ListingDetail | null | undefined> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(slug)}`, {
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "application/json", ...(API_KEY && { "X-Secret-Key": API_KEY }) },
    });
    if (res.status === 404) return null;
    if (!res.ok) return undefined;
    const raw = await res.json();
    return {
      make: nameOf(raw?.make),
      model: nameOf(raw?.model),
      variant: str(raw?.variant),
      year: str(raw?.year),
      body_type: str(raw?.body_type),
      odometer: str(raw?.odometer),
      transmission: str(raw?.transmission),
      fuel_type: str(raw?.fuel_type),
      drive_type: str(raw?.drive_type ?? raw?.drivetrain),
      seats: str(raw?.seats),
      suburb: str(raw?.suburb),
    };
  } catch {
    return undefined;
  } finally {
    clearTimeout(timeoutId);
  }
}

/** Details for each slug (missing key = lookup failed). Uncached slugs are
 * fetched CONCURRENCY at a time, each giving up after `timeoutMs`. */
export async function fetchListingDetails(
  slugs: string[],
  timeoutMs = 8000
): Promise<Record<string, ListingDetail | null>> {
  const out: Record<string, ListingDetail | null> = {};
  if (!API_BASE) return out;

  const now = Date.now();
  const todo = [...new Set(slugs)].filter((s) => {
    const hit = cache.get(s);
    if (hit && hit.expires > now) { out[s] = hit.detail; return false; }
    return true;
  });

  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, todo.length) }, async () => {
      while (next < todo.length) {
        const slug = todo[next++];
        const detail = await fetchOne(slug, timeoutMs);
        if (detail === undefined) continue;
        out[slug] = detail;
        if (cache.size >= MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value as string);
        cache.set(slug, { detail, expires: Date.now() + TTL_MS });
      }
    })
  );

  return out;
}
