import { apiSitemapPaths, listingSitemapRoute } from "@/lib/listingSitemaps";

export const GET = listingSitemapRoute(() => apiSitemapPaths("makes"), { changefreq: "weekly", priority: "0.7" });
