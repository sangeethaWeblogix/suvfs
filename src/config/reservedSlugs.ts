import { sitePaths } from "@/config/sites";

/**
 * Top-level route segments that are real pages/routes — NOT blog posts handled
 * by the [slug] catch-all. Used by the root layout (skip the blog-detail fetch)
 * and by middleware (any other single-segment URL is checked against the blog
 * API and 410'd when the post doesn't exist, instead of a soft-404 200 page).
 * Add new top-level routes here.
 */
export const RESERVED_TOP_LEVEL_SLUGS = new Set([
  "about-us", "api", "author", "blog", "buyer-safety-guide", sitePaths.enquiry.replace(/\//g, ""),
  "caravan-homepage-takeover", "caravan-manufacturers", "caravan-sales", "contact",
  "cookie-policy", "family-caravan-category-sponsorship",
  "hybrid-caravan-category-sponsorship", "listings", "login",
  "luxury-caravan-category-sponsorship", "pop-top-caravan-category-sponsorship",
  "privacy-collection-statement", "privacy-policy", "product", "product-detail-demo",
  "store", "terms-conditions", "touring-caravan-category-sponsorship",
  "404", "410", "sitemap", "sitemap.xml", "robots.txt", "favicon.ico",
  "home-demo", "footer", "navbar", "images",
]);
