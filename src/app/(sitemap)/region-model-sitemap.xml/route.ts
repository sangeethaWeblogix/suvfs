import { listingSitemapRoute, modelLocationPaths } from "@/lib/listingSitemaps";

export const GET = listingSitemapRoute(() => modelLocationPaths("region"), { changefreq: "daily", priority: "0.5" });
