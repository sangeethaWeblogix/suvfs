// src/api/requirements/api.ts
import { WP_ORIGIN } from "@/lib/apiBase";
import { site } from "@/config/sites";

const API_KEY = process.env.MPN_API_KEY; // ✅ Add this

export type Requirement = {
  id?: number; // if the API returns one
  featured?: "0" | "1";
  condition: string; // e.g., "Used" | "New"
  location: string; // e.g., "2033"
  requirements: string; // text
  budget: string; // number as string
  active?: "0" | "1";
  created_at?: string;
};

type ListResp = {
  success: boolean;
  data: Requirement[]; // screenshot shows an array under data
};

export async function fetchRequirements(): Promise<Requirement[]> {
  if (!WP_ORIGIN) return [];
  // Featured home enquiries for this site only.
  const url = `${WP_ORIGIN}/wp-json/mpn/v1/cars/get-home-enquiries-list?site=${encodeURIComponent(site.key)}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 },
      headers: {
        Accept: "application/json",
        ...(API_KEY && { "X-Secret-Key": API_KEY }),
      },
    });
    if (!res.ok) return [];
    const json: ListResp = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

 