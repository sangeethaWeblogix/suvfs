import { apiSitemapPaths, listingSitemapRoute } from "@/lib/listingSitemaps";

export const GET = listingSitemapRoute(() => apiSitemapPaths("states"), { changefreq: "monthly", priority: "0.8" });
