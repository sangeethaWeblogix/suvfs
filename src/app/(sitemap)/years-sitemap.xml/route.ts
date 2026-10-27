import { listingSitemapRoute, yearPaths } from "@/lib/listingSitemaps";

export const GET = listingSitemapRoute(yearPaths, { changefreq: "weekly", priority: "0.5" });
