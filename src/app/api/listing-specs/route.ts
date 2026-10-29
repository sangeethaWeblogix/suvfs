// src/app/api/listing-specs/route.ts
// TEMPORARY: the /pool listings API does not return odometer / transmission /
// fuel_type / seats yet, so listing cards fetch them here from the product
// detail API. One request per page (slugs batched by useListingSpecs), cached
// in memory by fetchListingDetails. Remove once /pool includes these fields.
import { NextRequest, NextResponse } from "next/server";
import { fetchListingDetails } from "@/utils/fetchListingDetails";

const MAX_SLUGS = 30;

type Specs = { odometer?: string; transmission?: string; fuel_type?: string; seats?: string };

export async function GET(request: NextRequest) {
  const slugs = [...new Set(
    (request.nextUrl.searchParams.get("slugs") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => /^[a-z0-9-]+$/i.test(s))
  )].slice(0, MAX_SLUGS);

  const details = await fetchListingDetails(slugs);

  const out: Record<string, Specs | null> = {};
  for (const slug of slugs) {
    const d = details[slug];
    out[slug] = d
      ? { odometer: d.odometer, transmission: d.transmission, fuel_type: d.fuel_type, seats: d.seats }
      : null;
  }

  return NextResponse.json({ specs: out });
}
