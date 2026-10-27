import { listingSitemapRoute, subjectPaths } from "@/lib/listingSitemaps";

// Body size, seats, drive type and this site's extra filters, alone or in a state/region.
export const GET = listingSitemapRoute(subjectPaths, { changefreq: "daily", priority: "0.6" });
