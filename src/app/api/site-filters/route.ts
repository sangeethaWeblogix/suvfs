import { NextRequest, NextResponse } from "next/server";

export const preferredRegion = "syd1";

const API_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE;
const API_KEY = process.env.MPN_API_KEY;

/**
 * Facet counts for the site's own filters (GET /car-sites/{site}/filters).
 * Each facet ignores its own selection, so one call serves the whole panel.
 * Shape: { makes, states, conditions, years, <field>: {slug: count} | {min, max}, buckets }.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams.toString();
  try {
    const res = await fetch(`${API_BASE}/filters${params ? `?${params}` : ""}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
        ...(API_KEY && { "X-Secret-Key": API_KEY }),
      },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      console.error(`[site-filters] HTTP ${res.status} | params="${params}"`);
      return NextResponse.json({}, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } });
  } catch (err) {
    console.error(`[site-filters] fetch failed | params="${params}" | ${(err as Error).message}`);
    return NextResponse.json({}, { status: 502 });
  }
}
