import { apiSitemapPaths, listingSitemapRoute } from "@/lib/listingSitemaps";

export const GET = listingSitemapRoute(() => apiSitemapPaths("models"), { changefreq: "daily", priority: "0.5" });
