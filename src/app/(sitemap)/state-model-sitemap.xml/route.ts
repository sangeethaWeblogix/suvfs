import { listingSitemapRoute, modelLocationPaths } from "@/lib/listingSitemaps";

export const GET = listingSitemapRoute(() => modelLocationPaths("state"), { changefreq: "daily", priority: "0.5" });
