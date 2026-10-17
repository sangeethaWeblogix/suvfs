// src/app/api/listing-specs/route.ts
// TEMPORARY: the /pool listings API does not return odometer / transmission /
// fuel_type / seats yet, so listing cards fetch them here from the product
// detail API. One request per page (slugs batched by useListingSpecs), cached
// in memory. Remove once /pool includes these fields.
import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.MPN_API_BASE || process.env.NEXT_PUBLIC_CFS_API_BASE;
const API_KEY = process.env.MPN_API_KEY;

const TTL_MS = 30 * 60 * 1000;
const MAX_SLUGS = 30;
const CONCURRENCY = 6;
const MAX_CACHE_ENTRIES = 2000;

type Specs = { odometer?: string; transmission?: string; fuel_type?: string; seats?: string };

const cache = new Map<string, { specs: Specs | null; expires: number }>();

const str = (v: unknown) => (v == null || v === "" ? undefined : String(v));

async function fetchSpecs(slug: string): Promise<Specs | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(slug)}`, {
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "application/json", ...(API_KEY && { "X-Secret-Key": API_KEY }) },
    });
    if (!res.ok) return null;
    const raw = await res.json();
    return {
      odometer: str(raw?.odometer),
      transmission: str(raw?.transmission),
      fuel_type: str(raw?.fuel_type),
      seats: str(raw?.seats),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function GET(request: NextRequest) {
  if (!API_BASE) return NextResponse.json({ specs: {} });

  const slugs = [...new Set(
    (request.nextUrl.searchParams.get("slugs") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => /^[a-z0-9-]+$/i.test(s))
  )].slice(0, MAX_SLUGS);

  const out: Record<string, Specs | null> = {};
  const now = Date.now();
  const todo = slugs.filter((s) => {
    const hit = cache.get(s);
    if (hit && hit.expires > now) { out[s] = hit.specs; return false; }
    return true;
  });

  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, todo.length) }, async () => {
      while (next < todo.length) {
        const slug = todo[next++];
        const specs = await fetchSpecs(slug);
        out[slug] = specs;
        if (cache.size >= MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value as string);
        cache.set(slug, { specs, expires: Date.now() + TTL_MS });
      }
    })
  );

  return NextResponse.json({ specs: out });
}
