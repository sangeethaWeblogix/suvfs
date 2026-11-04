import type { NextConfig } from "next";
import { site, SITES, portalLinks } from "./src/config/sites";

// The enquiry page folder is named after the SUV site (/suv-enquiry-form/).
// Other sites serve it under their own slug (/ute-enquiry-form/) and 301 the
// SUV URL to it.
const siteSlugRewrites =
  site.slug === "suv"
    ? []
    : [{ source: `/${site.slug}-enquiry-form/`, destination: "/suv-enquiry-form/" }];
const siteSlugRedirects =
  site.slug === "suv"
    ? []
    : [{ source: "/suv-enquiry-form/", destination: `/${site.slug}-enquiry-form/`, permanent: true }];

// Selling and dealer pages moved to the unified portal — every old per-site
// URL (current and legacy, any depth) 301s there.
const portalRedirects = [
  ...[...new Set(["suv", site.slug, "caravan"])].flatMap((slug) => [
    { source: `/sell-my-${slug}/`, destination: portalLinks.sell, permanent: true },
    { source: `/sell-my-${slug}/:path*/`, destination: portalLinks.sell, permanent: true },
  ]),
  // Legacy flat state pages and /sell-my-caravan-region/{region}/ pages.
  { source: "/sell-my-caravan-:state/", destination: portalLinks.sell, permanent: true },
  { source: "/sell-my-caravan-region/:path*/", destination: portalLinks.sell, permanent: true },
  { source: "/dealer-advertising/", destination: portalLinks.dealer, permanent: true },
];

const farFuture = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();

const nextConfig: NextConfig = {
  // scripts/dev-site.mjs gives each locally-run site its own build folder.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  trailingSlash: true,
  reactStrictMode: false,
  //  productionBrowserSourceMaps: false,
  images: {
    domains: [
      "media.caravansforsale.com.au",
      "www.caravansforsale.com.au",
      "admin.caravansforsale.com.au",
      "caravansforsale.b-cdn.net",
      "wb79vudhmjvv4ng6.public.blob.vercel-storage.com",
      "caravansforsale.imagestack.net",
    ],
    remotePatterns: [
      { protocol: "https", hostname: "**.caravansforsale.com.au", pathname: "/**" },
      { protocol: "https", hostname: "caravansforsale.b-cdn.net", pathname: "/**" },
      { protocol: "https", hostname: "caravansforsale.imagestack.net", pathname: "/**" },
      { protocol: "https", hostname: "wb79vudhmjvv4ng6.public.blob.vercel-storage.com", pathname: "/**" },
      // Every car site's own image CDN (images.<domain> — listing and blog images).
      // Without these, next/image throws on e.g. a blog featured image and the
      // whole page falls back to client-side rendering (empty HTML for crawlers).
      ...Object.values(SITES).map((s) => ({ protocol: "https" as const, hostname: `**.${s.domain}`, pathname: "/**" })),
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
  },
  compress: true,

  async rewrites() {
    return [
      {
        source: "/blob/:path*",
        destination:
          "https://wb79vudhmjvv4ng6.public.blob.vercel-storage.com/:path*",
      },
      ...siteSlugRewrites,
      // Browsers and crawlers that ask for /favicon.ico get this site's own icon.
      { source: "/favicon.ico", destination: site.favicon },
    ];
  },
  experimental: {
    // ✅ Built-in critical CSS inlining
    optimizeCss: true,
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },

  
  // compiler: {
  //  removeConsole: {
  //    exclude: ["error"],
  //   },
  // },

  // ✅ Redirects: malformed URLs, old enquiry URL, sell/dealer pages → portal
  async redirects() {
    return [
      ...siteSlugRedirects,
      ...portalRedirects,

      // ── Malformed feed URLs ──────────────────────────────────────────────
      {
        source: "/:path*/feed/:rest*",
        destination: "/:path*",
        permanent: true,
      },
      {
        source: "/:path*/feedfeed/:rest*",
        destination: "/:path*",
        permanent: true,
      },
      {
        source: "/:path*/feedfeedfeed/:rest*",
        destination: "/:path*",
        permanent: true,
      },

      // ── /caravan-enquiry-form/ → /suv-enquiry-form/ ──
      { source: "/caravan-enquiry-form/", destination: "/suv-enquiry-form/", permanent: true },
    ];
  },
  async headers() {
    return [
      // ===========================================
      // HOME PAGE
      // ===========================================
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },

      // ===========================================
      // LISTINGS PAGES - Main caching targets
      // ===========================================

      // Main listings page
      {
        source: "/listings/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, max-age=3600",
          },
        ],
      },

      // All listing subpages (filters, categories, makes, etc.)
      {
        source: "/listings/:path*/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, max-age=3600",
          },
        ],
      },

      // ===========================================
      // CATEGORY PAGES
      // ===========================================
      {
        source: "/:slug-category/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },

      // ===========================================
      // CONDITION PAGES
      // ===========================================
      {
        source: "/new-condition/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/used-condition/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },

      // ===========================================
      // STATE/LOCATION PAGES
      // ===========================================
      {
        source: "/:state-state/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },

      // ===========================================
      // STATIC ASSETS - Long cache (production only: dev chunk names
      // are not content-hashed, so browsers would keep stale code)
      // ===========================================
      ...(process.env.NODE_ENV === "production"
        ? [
            {
              source: "/_next/static/:path*",
              headers: [
                { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
                { key: "Expires", value: farFuture },
              ],
            },
          ]
        : []),

      // ===========================================
      // IMAGES - 1 year cache (cache-bust via filename/query when changed)
      // ===========================================
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Expires", value: farFuture },
        ],
      },

      // ===========================================
      // FONTS - 1 year cache
      // ===========================================
      {
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Expires", value: farFuture },
        ],
      },

      // ===========================================
      // FAVICON & ROOT STATIC FILES
      // ===========================================
      {
        source: "/favicon.ico",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
          { key: "Expires", value: farFuture },
        ],
      },
      {
        source: "/:file*.svg",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Expires", value: farFuture },
        ],
      },

      // ===========================================
      // API ROUTES - No cache
      // ===========================================
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
