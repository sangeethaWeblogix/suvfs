import { apiSitemapPaths, listingSitemapRoute } from "@/lib/listingSitemaps";

export const GET = listingSitemapRoute(() => apiSitemapPaths("region-make"), { changefreq: "daily", priority: "0.5" });
