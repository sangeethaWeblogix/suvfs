import { NextRequest, NextResponse } from "next/server";

export const preferredRegion = "syd1";
const API_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE;
const API_KEY = process.env.MPN_API_KEY;

/**
 * Band-count lookup for the browse-section filter links (Price/ATM/Length/Sleep).
 * Mirrors fetchBandCountServer in fetchBrowseSectionData.ts so the client-side
 * refetch (filters changed after initial SSR) uses the same WP
 * product_exists_check endpoint instead of the heavier pool_test one.
 */
export async function GET(request: NextRequest) {
  const paramsStr = request.nextUrl.searchParams.toString();
  try {
    const res = await fetch(`${API_BASE}/product_exists_check?${paramsStr}`, {
      headers: {
        Accept: "application/json",
        ...(API_KEY ? { "X-Secret-Key": API_KEY } : {}),
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, exists: false, count: 0 }, { status: res.status });
    }

    const json = await res.json();
    return NextResponse.json(json);
  } catch (err) {
    console.error(
      `[product-exists-check] WP API fetch failed | params="${paramsStr}" | error="${(err as Error).message}"`
    );
    return NextResponse.json({ success: false, exists: false, count: 0 }, { status: 502 });
  }
}
