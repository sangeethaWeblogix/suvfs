import { listingSitemapRoute, pricePaths } from "@/lib/listingSitemaps";

// Built from the index rules' price bands, not the API's /sitemap/price (caravan bands).
export const GET = listingSitemapRoute(pricePaths, { changefreq: "weekly", priority: "0.7" });
