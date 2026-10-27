import { apiSitemapPaths, listingSitemapRoute } from "@/lib/listingSitemaps";

export const GET = listingSitemapRoute(() => apiSitemapPaths("state-make"), { changefreq: "daily", priority: "0.5" });
