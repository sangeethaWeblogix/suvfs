import { NextRequest, NextResponse } from "next/server";
import { isIndexableListingPath } from "@/utils/seo/indexRules";

// Whether a /listings/ URL is meant to be indexed (car-site rules in
// utils/seo/indexRules.ts) — non-indexed pages (condition-only pages, deep
// filter combos, etc.) get a stripped-down hero (no banner image, no
// description) on the listings page.
export async function GET(request: NextRequest) {
  const targetPath = (request.nextUrl.searchParams.get("path") ?? "").replace(/^https?:\/\/[^/]+/, "").trim();
  return NextResponse.json({ indexed: isIndexableListingPath(targetPath) });
}
