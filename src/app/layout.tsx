
  // export const dynamic = "force-dynamic"

  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap-icons/font/bootstrap-icons.css";
  import "./globals.css?=42";
  import Navbar from "./navbar/Navbar";
  import NavbarSkeleton from "./navbar/NavbarSkeleton";
  import Footer from "./footer/Footer";
  import React, { Suspense } from "react";
  import Script from "next/script";
  import { Metadata } from "next";
  import { Montserrat } from "next/font/google";
  import ScrollToTop from "./navigation/ScrollToTopGlobal";
  import UTMTracker from "./UTMTracker";
  // import NextTopLoader from "nextjs-toploader";
import NavigationHistory from "@/components/NavigationHistory";
import VisitorQualifier from "@/components/VisitorQualifier";
import VisitorStatus from "@/components/VisitorStatus";
import { BannerProvider } from "@/components/BannerHandler";
import GlobalErrorTracker from "@/components/GlobalErrorTracker";
import { headers } from "next/headers";
import { site } from "@/config/sites";
import { metaFromSlug } from "@/utils/seo/meta";
import { fetchProductMeta } from "@/utils/fetchProductMeta";
import fetchListingsForHead, { buildListingsJsonLd, buildBreadcrumbs } from "@/utils/fetchListingsHead";
import GlobalImageFallback from "@/components/GlobalImageFallback";
import { getStateBySlug, buildStateJsonLd } from "./sell-my-caravan-region/states-data";
import { fetchBlogs } from "@/api/blog/api";
import { getRegionByStateAndPageSlug, buildRegionJsonLd } from "./sell-my-caravan-region/regions-data";
import { fetchBlogDetail } from "./[slug]/fetchBlogDetail";
import { isNonBlogSlug } from "@/utils/isNonBlogSlug";
import { fetchProductDetail } from "@/utils/fetchProductDetail";

// Top-level route segments that are NOT handled by the [slug] blog-details
// catch-all — used to avoid firing a wasted fetchBlogDetail() call for them.
const RESERVED_TOP_LEVEL_SLUGS = new Set([
  "about-us", "api", "author", "blog", "buyer-safety-guide", "suv-enquiry-form",
  "caravan-homepage-takeover", "caravan-manufacturers", "caravan-sales", "contact",
  "cookie-policy", "dealer-advertising", "family-caravan-category-sponsorship",
  "hybrid-caravan-category-sponsorship", "listings", "login",
  "luxury-caravan-category-sponsorship", "off-road-caravan-category-sponsorship",
  "off-road-caravan-market-report", "off-road-caravan-types", "off-road-caravans",
  "off-road-caravans-manufacturers", "pop-top-caravan-category-sponsorship",
  "privacy-collection-statement", "privacy-policy", "product", "product-detail-demo",
  "sell-my-suv", "store", "terms-conditions", "touring-caravan-category-sponsorship",
  "404", "410", "sitemap.xml", "robots.txt", "favicon.ico",
]);

  const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    display: "swap",
    variable: "--font-montserrat",
    preload: true,
  });

  
  export const metadata: Metadata = {
    icons: { icon: "/favicon.ico" },
    // robots: "index, follow",
    verification: {
      google: "6tT6MT6AJgGromLaqvdnyyDQouJXq0VHS-7HC194xEo", // ✅ this auto generates <meta name="google-site-verification" />
    },
    other: {
      "google-adsense-account": "ca-pub-7836481431078711",
    },

  };
  
  
  export default async function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    // Per-slug metadata for /listings/* pages — injected directly into <head> JSX
    // (avoids async generateMetadata + streaming = metadata-in-body issue in Next.js 15)
    const h = await headers();
    const pathname = h.get("x-pathname") ?? "";
    const xRobots = h.get("x-robots") ?? "";
    const isListingSlug =
      pathname.startsWith("/listings/") &&
      pathname !== "/listings/" &&
      pathname !== "/listings";

    let slugTitle = "";
    let slugDescription = "";
    let slugCanonical = "";
    let slugRobots = "";

    const isProductPage =
      pathname.startsWith("/product/") &&
      pathname !== "/product/" &&
      pathname !== "/product";

    const isContactPage = pathname === "/contact/" || pathname === "/contact";
    const isMainListings = pathname === "/listings/" || pathname === "/listings";
    const isHomePage = pathname === "/" || pathname === "";
    const isOffRoadCaravansPage = pathname === "/off-road-caravans/" || pathname === "/off-road-caravans";
    const isOffRoadCaravanTypesPage = pathname === "/off-road-caravan-types/" || pathname === "/off-road-caravan-types";
    const isOffRoadMarketReportPage = pathname === "/off-road-caravan-market-report/" || pathname === "/off-road-caravan-market-report";
    const isSellMyCaravanPage = pathname === "/sell-my-suv/" || pathname === "/sell-my-suv";
    const isDealerAdvertisingPage = pathname === "/dealer-advertising/" || pathname === "/dealer-advertising";
    const isBlogPage = pathname === "/blog/" || pathname === "/blog";

    let blogPageJsonLd: object | null = null;
    if (isBlogPage) {
      const data = await fetchBlogs(1);
      blogPageJsonLd = [
        {
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "SUVs for Sale Blog",
          description:
            "Latest news, in-depth reviews, and expert advice on the latest in the SUV market.",
          url: "https://www.caravansforsale.com.au/blog/",
          publisher: {
            "@type": "Organization",
            name: "SUVs for Sale",
            url: "https://www.caravansforsale.com.au",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.caravansforsale.com.au/" },
            { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.caravansforsale.com.au/blog/" },
          ],
        },
        ...(data.items.length > 0
          ? [
              {
                "@context": "https://schema.org",
                "@type": "ItemList",
                name: "Latest Blog Posts",
                itemListElement: data.items.map((post, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  url: post.link,
                  name: post.title,
                })),
              },
            ]
          : []),
      ];
    }

    // /{slug}/ blog details page — the [slug] catch-all route. Only fetch for a bare
    // single-segment path that isn't one of the other known static top-level routes;
    // fetchBlogDetail is React-cache()'d so [slug]/layout.tsx's own call for the same
    // slug within this request reuses this result instead of hitting the API again.
    let blogDetailJsonLd: object | null = null;
    const genericSlugSegments = pathname.replace(/^\//, "").replace(/\/$/, "").split("/").filter(Boolean);
    const isGenericSlugPage =
      genericSlugSegments.length === 1 &&
      !RESERVED_TOP_LEVEL_SLUGS.has(genericSlugSegments[0].toLowerCase()) &&
      !isNonBlogSlug(genericSlugSegments[0]) &&
      !genericSlugSegments[0].startsWith("thank-you-");
    if (isGenericSlugPage) {
      const slug = genericSlugSegments[0];
      const blogData = await fetchBlogDetail(slug);
      const post = blogData?.data?.blog_detail ?? {};
      const seo = blogData?.seo ?? {};
      const faqs: { heading: string; content: string }[] = blogData?.data?.blog_detail?.faq ?? [];

      if (post?.title) {
        const canonical = `https://www.caravansforsale.com.au/${slug}/`;
        const blogTitle = seo.metatitle || post.title || "SUVs for Sale Blog";
        const blogDescription =
          seo.metadescription || post.short_description || "Read more on SUVs for Sale.";
        const bannerImage =
          post.banner_image || post.image || "https://www.caravansforsale.com.au/load.svg";
        const safeIso = (dateStr?: string) => {
          if (!dateStr) return new Date().toISOString();
          const d = new Date(dateStr);
          return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
        };

        blogDetailJsonLd = [
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
            headline: blogTitle,
            description: blogDescription,
            image: bannerImage,
            author: { "@type": "Person", name: "Tom" },
            publisher: { "@type": "Organization", name: "SUVs for Sale" },
            datePublished: safeIso(post.date),
            dateModified: safeIso(post.date),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.caravansforsale.com.au/" },
              { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.caravansforsale.com.au/blog/" },
              { "@type": "ListItem", position: 3, name: blogTitle, item: canonical },
            ],
          },
          ...(faqs.length > 0
            ? [
                {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: faqs.map((faq) => ({
                    "@type": "Question",
                    name: faq.heading,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: faq.content.replace(/<[^>]*>/g, "").trim(),
                    },
                  })),
                },
              ]
            : []),
        ];
      }
    }

    // /sell-my-suv/{state}/ and /sell-my-suv/{state}/{region}/ — JSON-LD is
    // data-driven per slug, so look it up here instead of hardcoding like the other pages.
    let sellMyCaravanStateJsonLd: object | null = null;
    let sellMyCaravanRegionJsonLd: object | null = null;
    if (pathname.startsWith("/sell-my-suv/") && !isSellMyCaravanPage) {
      const segments = pathname.replace(/^\/sell-my-suv\//, "").replace(/\/$/, "").split("/").filter(Boolean);
      if (segments.length === 1) {
        const state = getStateBySlug(segments[0]);
        if (state) sellMyCaravanStateJsonLd = buildStateJsonLd(state);
      } else if (segments.length === 2) {
        const region = getRegionByStateAndPageSlug(segments[0], segments[1]);
        if (region) sellMyCaravanRegionJsonLd = buildRegionJsonLd(region);
      }
    }

    // Static pages whose metadata ends up after </head> due to streaming — inject directly
    const STATIC_META: Record<string, { title: string; description: string; canonical: string }> = {
      "/caravan-manufacturers/": {
        title: "Top 10 SUV Manufacturers in Australia: Best Brands of 2024",
        description: "See how top Australian SUV manufacturers excel with the best in innovative designs, quality construction, cost efficiency, and expert craftsmanship.",
        canonical: "https://www.caravansforsale.com.au/caravan-manufacturers/",
      },
      "/off-road-caravans-manufacturers/": {
        title: "Top Off-Road SUV Manufacturers in Australia: Best Brands 2024",
        description: "Discover Australia's leading off-road SUV manufacturers. Compare top brands known for rugged build quality, innovative design, and outback-ready performance.",
        canonical: "https://www.caravansforsale.com.au/off-road-caravans-manufacturers/",
      },
    };
    const staticMeta = STATIC_META[pathname] ?? null;

    let productMeta = { title: "", description: "", canonical: "", ogImage: "" };
    let productJsonLd: Record<string, unknown> | null = null;

    if (isProductPage) {
      const slug = pathname.replace(/^\/product\//, "").replace(/\/$/, "");
      productMeta = await fetchProductMeta(slug);

      // fetchProductDetail is React-cache()'d, so this reuses the same call
      // product/[slug]/page.tsx makes for its own render — no extra network round-trip.
      const data = await fetchProductDetail(slug);
      const pd = (data as any)?.data?.product_details ?? {};
      const seo = (data as any)?.seo ?? (data as any)?.product?.seo ?? {};
      const pdName = seo.metatitle || seo.meta_title || pd.name || (data as any)?.name || "";
      const pdDesc = seo.metadescription || seo.meta_description || pd.short_description || (data as any)?.short_description || "";
      const canonicalUrl = `https://www.caravansforsale.com.au/product/${slug}/`;

      const rawImages = pd.image_url ?? pd.images ?? [];
      const images: string[] = (Array.isArray(rawImages) ? rawImages : [rawImages]).filter(Boolean);

      const rawPrice = pd.sale_price || pd.regular_price || pd.price;
      const priceStr = rawPrice ? String(rawPrice).replace(/[^0-9.]/g, "") : null;

      if (pdName) {
        productJsonLd = {
          "@context": "https://schema.org",
          "@type": "Product",
          name: pdName,
          ...(pdDesc && { description: pdDesc }),
          ...(images.length > 0 && { image: images }),
          ...(pd.make && { brand: { "@type": "Brand", name: pd.make } }),
          ...(pd.condition && {
            itemCondition:
              String(pd.condition).toLowerCase() === "new"
                ? "https://schema.org/NewCondition"
                : "https://schema.org/UsedCondition",
          }),
          offers: {
            "@type": "Offer",
            priceCurrency: "AUD",
            ...(priceStr && { price: priceStr }),
            availability: "https://schema.org/InStock",
            url: canonicalUrl,
            seller: { "@type": "Organization", name: "SUVs For Sale" },
          },
        };
      }
    }

    // Listings JSON-LD — fetched here so both schemas render inside <head>
    // Second call hits Next.js data cache (revalidate: 3600), no extra network round-trip.
    let listingsCollectionLd: object | null = null;
    let listingsSearchResultsLd: object | null = null;
    if (isMainListings || isListingSlug) {
      const normalizedPath = pathname.endsWith("/") ? pathname : pathname + "/";
      const listingsData = await fetchListingsForHead(normalizedPath);
      if (listingsData) {
        const crumbs = buildBreadcrumbs(pathname);
        const pageUrl = `https://www.caravansforsale.com.au${normalizedPath}`;
        const { collectionPageLd, searchResultsLd } = buildListingsJsonLd(
          listingsData,
          pageUrl,
          crumbs
        );
        listingsCollectionLd = collectionPageLd;
        listingsSearchResultsLd = searchResultsLd;
      }
    }

    // Bare /listings/ went through the same async-generateMetadata + streaming
    // bug as slugged pages (title landed in <head>, description/canonical/robots/
    // og/twitter landed after </head>) because it was excluded from the fix below.
    const hasSlugMeta = isListingSlug || isMainListings;

    if (hasSlugMeta) {
      const slugString = pathname.replace(/^\/listings\//, "").replace(/\/$/, "");
      const slugParts = isMainListings ? [] : slugString.split("/").filter(Boolean);

      // Middleware signals 0 products via x-robots: noindex — use it directly, no API call needed
      if (isListingSlug && xRobots === "noindex") {
        slugRobots = "noindex";
        slugCanonical = `https://www.caravansforsale.com.au/listings/${slugParts.join("/")}/`;
        slugDescription = "Browse SUVs for sale across Australia. Compare prices on off-road, hybrid, pop top, touring, luxury models with size, weight & sleeping capacity.";
      } else {
        // try {
          // All SEO from metaFromSlug — pure computation, no API call
          const meta = await metaFromSlug(slugParts, {});
          slugCanonical = (meta.alternates?.canonical as string) ?? "";
          if (meta.robots && typeof meta.robots === "object" && "index" in meta.robots) {
            slugRobots = (meta.robots as { index: boolean }).index ? "index, follow" : "noindex";
          } else {
            slugRobots = "index, follow";
          }
          if (meta.title && typeof meta.title === "object" && "absolute" in meta.title) {
            slugTitle = (meta.title as { absolute: string }).absolute;
          }
          slugDescription = "Browse SUVs for sale across Australia. Compare prices on off-road, hybrid, pop top, touring, luxury models with size, weight & sleeping capacity.";
        // } catch {
        //   const parts = slugParts
        //     .map((p: string) =>
        //       p.replace(/-(category|state|region|condition|search|suburb)$/, "")
        //        .replace(/-/g, " ")
        //        .replace(/\b\w/g, (c: string) => c.toUpperCase())
        //     )
        //     .filter(Boolean);
        //   slugTitle = parts.length
        //     ? `${parts.join(" ")} Caravans for Sale in Australia`
        //     : "Caravans for Sale in Australia";
        //   slugCanonical = `https://www.caravansforsale.com.au/listings/${slugParts.join("/")}/`;
        //   slugDescription = "Browse caravans for sale across Australia. Compare prices on off-road, hybrid, pop top, touring, luxury models with size, weight & sleeping capacity.";
        //   slugRobots = "index, follow";
        // }
      }
    }

    return (
      <html lang="en" style={{ "--brand": site.color, "--brand-rgb": site.colorRgb } as React.CSSProperties}>
        <head>
          {/* Static pages SEO — injected here to avoid metadata-in-body streaming issue */}
          {staticMeta && <title>{staticMeta.title}</title>}
          {staticMeta && <meta name="description" content={staticMeta.description} />}
          {staticMeta && <link rel="canonical" href={staticMeta.canonical} />}
          {staticMeta && <meta name="robots" content="index, follow" />}
          {staticMeta && <meta property="og:title" content={staticMeta.title} />}
          {staticMeta && <meta property="og:description" content={staticMeta.description} />}
          {staticMeta && <meta property="og:url" content={staticMeta.canonical} />}
          {staticMeta && <meta name="twitter:title" content={staticMeta.title} />}
          {staticMeta && <meta name="twitter:description" content={staticMeta.description} />}
          {/* Product page SEO — injected here to avoid metadata-in-body streaming issue */}
          {isProductPage && productMeta.title && <title>{productMeta.title}</title>}
          {isProductPage && productMeta.description && <meta name="description" content={productMeta.description} />}
          {isProductPage && productMeta.canonical && <link rel="canonical" href={productMeta.canonical} />}
          {isProductPage && <meta name="robots" content="index, follow" />}
          {isProductPage && productMeta.title && <meta property="og:title" content={productMeta.title} />}
          {isProductPage && productMeta.description && <meta property="og:description" content={productMeta.description} />}
          {isProductPage && productMeta.ogImage && <meta property="og:image" content={productMeta.ogImage} />}
          {isProductPage && productMeta.canonical && <meta property="og:url" content={productMeta.canonical} />}
          {isProductPage && productMeta.title && <meta name="twitter:title" content={productMeta.title} />}
          {isProductPage && productMeta.description && <meta name="twitter:description" content={productMeta.description} />}
          {/* Per-slug SEO tags for /listings/* (incl. bare /listings/) — rendered before streaming starts */}
          {/* <title> is set by generateMetadata in [...slug]/page.tsx via fast metaFromSlug (no API call) */}
          {hasSlugMeta && slugDescription && <meta name="description" content={slugDescription} />}
          {hasSlugMeta && slugCanonical && <link rel="canonical" href={slugCanonical} />}
          {hasSlugMeta && <meta name="robots" content={slugRobots} />}
          {hasSlugMeta && slugTitle && <meta property="og:title" content={slugTitle} />}
          {hasSlugMeta && slugDescription && <meta property="og:description" content={slugDescription} />}
          {hasSlugMeta && slugCanonical && <meta property="og:url" content={slugCanonical} />}
          {hasSlugMeta && slugTitle && <meta name="twitter:title" content={slugTitle} />}
          {hasSlugMeta && slugDescription && <meta name="twitter:description" content={slugDescription} />}
          {/* Home page JSON-LD */}
          {isHomePage && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@graph": [
                    {
                      "@type": "WebSite",
                      "@id": "https://www.caravansforsale.com.au/#website",
                      "url": "https://www.caravansforsale.com.au",
                      "name": "SUVs For Sale",
                      "description": "Australia's Marketplace for New & Used SUVs",
                      "inLanguage": "en-AU",
                      "potentialAction": {
                        "@type": "SearchAction",
                        "target": {
                          "@type": "EntryPoint",
                          "urlTemplate": "https://www.caravansforsale.com.au/listings/{search_term_string}-search/",
                        },
                        "query-input": "required name=search_term_string",
                      },
                    },
                    {
                      "@type": "Organization",
                      "@id": "https://www.caravansforsale.com.au/#organization",
                      "name": "SUVs For Sale",
                      "url": "https://www.caravansforsale.com.au",
                      "logo": {
                        "@type": "ImageObject",
                        "url": "https://www.caravansforsale.com.au/images/cfs-logo-black.png",
                      },
                      "contactPoint": {
                        "@type": "ContactPoint",
                        "contactType": "customer support",
                        "areaServed": "AU",
                        "availableLanguage": "English",
                      },
                    },
                  ],
                }),
              }}
            />
          )}
          {/* Off Road Caravans page JSON-LD */}
          {isOffRoadCaravansPage && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@graph": [
                    {
                      "@type": "CollectionPage",
                      "@id": "https://www.caravansforsale.com.au/off-road-caravans/",
                      "url": "https://www.caravansforsale.com.au/off-road-caravans/",
                      "name": "Off Road SUVs Australia | New & Used Off Road SUVs for Sale",
                      "description": "Discover Australia's largest collection of off road SUVs. Compare full off road, semi off road and hybrid SUVs, browse live listings, read expert reviews and explore detailed buying guides.",
                      "inLanguage": "en-AU",
                      "breadcrumb": { "@id": "https://www.caravansforsale.com.au/off-road-caravans/#breadcrumb" },
                      "isPartOf": { "@type": "WebSite", "url": "https://www.caravansforsale.com.au/" },
                    },
                    {
                      "@type": "BreadcrumbList",
                      "@id": "https://www.caravansforsale.com.au/off-road-caravans/#breadcrumb",
                      "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Home",             "item": "https://www.caravansforsale.com.au/" },
                        { "@type": "ListItem", "position": 2, "name": "Off Road SUVs", "item": "https://www.caravansforsale.com.au/off-road-caravans/" },
                      ],
                    },
                    {
                      "@type": "FAQPage",
                      "mainEntity": [
                        {
                          "@type": "Question",
                          "name": "What is an off road SUV?",
                          "acceptedAnswer": { "@type": "Answer", "text": "An off road SUV is an SUV built to handle rough, unsealed tracks and remote terrain. They typically feature heavy-duty chassis, independent suspension, reinforced bodywork, larger water and battery capacity, and off-road tyres to handle Australia's outback and bush conditions." },
                        },
                        {
                          "@type": "Question",
                          "name": "What is the difference between semi off road and full off road SUVs?",
                          "acceptedAnswer": { "@type": "Answer", "text": "Semi off road SUVs are built for light unsealed roads and easy bush tracks, with upgraded suspension and stronger construction. Full off road SUVs are engineered for extreme terrain — think river crossings, rocky tracks and remote touring — with independent suspension, heavy-duty chassis and full off-grid capability." },
                        },
                        {
                          "@type": "Question",
                          "name": "Can off road SUVs go off grid?",
                          "acceptedAnswer": { "@type": "Answer", "text": "Yes. Most off road SUVs come with or can be fitted with solar panels, lithium batteries, large fresh water tanks and composting or cassette toilets, allowing extended stays in remote areas without external power or water hookups." },
                        },
                        {
                          "@type": "Question",
                          "name": "Do I need a special vehicle to tow an off road SUV?",
                          "acceptedAnswer": { "@type": "Answer", "text": "Yes. Off road SUVs are heavier and wider than standard SUVs. You'll need a high-capacity 4WD with a tow bar rated to the SUV's ATM. Always check the SUV's ATM and the tow vehicle's GVM and tow rating before purchasing." },
                        },
                        {
                          "@type": "Question",
                          "name": "Are off road SUVs suitable for families?",
                          "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. Many off road models come in family-friendly layouts with bunk beds, multiple sleeping berths, full kitchens and ensuites. Brands like Jayco, New Age and Trakmaster offer popular family off road models across a range of budgets." },
                        },
                        {
                          "@type": "Question",
                          "name": "What is the average price of an off road SUV in Australia?",
                          "acceptedAnswer": { "@type": "Answer", "text": "Off road SUV prices in Australia typically range from around $40,000 for entry-level semi off road models to over $150,000 for premium full off road expedition SUVs. The most popular mid-range models sit between $60,000 and $100,000." },
                        },
                      ],
                    },
                  ],
                }),
              }}
            />
          )}
          {/* Off Road Caravan Types page JSON-LD */}
          {isOffRoadCaravanTypesPage && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@graph": [
                    {
                      "@type": "CollectionPage",
                      "@id": "https://www.caravansforsale.com.au/off-road-caravan-types/",
                      "url": "https://www.caravansforsale.com.au/off-road-caravan-types/",
                      "name": "Off Road SUV Types Compared | Semi, Full, Hybrid & Extreme",
                      "description": "Compare semi, full, extreme and hybrid off road SUVs in Australia. Understand terrain capability, towing, weight, construction and off-grid features.",
                      "inLanguage": "en-AU",
                      "breadcrumb": { "@id": "https://www.caravansforsale.com.au/off-road-caravan-types/#breadcrumb" },
                      "isPartOf": { "@type": "WebSite", "url": "https://www.caravansforsale.com.au/" },
                    },
                    {
                      "@type": "BreadcrumbList",
                      "@id": "https://www.caravansforsale.com.au/off-road-caravan-types/#breadcrumb",
                      "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Home",              "item": "https://www.caravansforsale.com.au/" },
                        { "@type": "ListItem", "position": 2, "name": "Off Road SUVs", "item": "https://www.caravansforsale.com.au/off-road-caravans/" },
                        { "@type": "ListItem", "position": 3, "name": "Off Road SUV Types", "item": "https://www.caravansforsale.com.au/off-road-caravan-types/" },
                      ],
                    },
                    {
                      "@type": "FAQPage",
                      "mainEntity": [
                        { "@type": "Question", "name": "What are the main types of off road SUVs?",                          "acceptedAnswer": { "@type": "Answer", "text": "The most commonly used categories in Australia are semi off road, full off road, extreme off road and hybrid off road SUVs. These are commonly used market descriptions rather than one nationally standardised classification system, so specifications should always be compared between individual models." } },
                        { "@type": "Question", "name": "What is the difference between semi off road and full off road SUVs?","acceptedAnswer": { "@type": "Answer", "text": "Semi off road SUVs are generally intended for sealed roads, gravel and maintained unsealed roads. Full off road SUVs typically add more substantial suspension, chassis, ground clearance, protection and off-grid equipment for more demanding remote-road travel." } },
                        { "@type": "Question", "name": "What is an extreme off road SUV?",                                   "acceptedAnswer": { "@type": "Answer", "text": "Extreme off road is generally a marketing term used for highly specified SUVs designed around serious remote travel. They often include heavy-duty suspension, increased payload, extensive protection and larger water, battery and solar systems." } },
                        { "@type": "Question", "name": "What is a hybrid off road SUV?",                                     "acceptedAnswer": { "@type": "Answer", "text": "A hybrid off road SUV combines features of an off-road camper trailer and an SUV. Hybrids are commonly more compact than conventional SUVs while retaining hard-sided sleeping accommodation and many SUV-style amenities." } },
                        { "@type": "Question", "name": "Is a hybrid SUV better than a full off road SUV?",               "acceptedAnswer": { "@type": "Answer", "text": "Neither type is automatically better. A hybrid generally offers more compact dimensions and manoeuvrability, while a full-size off road SUV usually offers greater internal living space and storage. The right choice depends on your travel plans." } },
                        { "@type": "Question", "name": "Do I need a 4WD to tow an off road SUV?",                            "acceptedAnswer": { "@type": "Answer", "text": "Not every off road SUV automatically requires a 4WD, but the tow vehicle must be suitable for the SUV's loaded weight and intended terrain. Remote or demanding off-road travel will generally favour appropriately rated four-wheel-drive tow vehicles." } },
                        { "@type": "Question", "name": "Does full off road mean an SUV can go anywhere?",                      "acceptedAnswer": { "@type": "Answer", "text": "No. An SUV marketed as full off road still has limits. Always check the manufacturer's intended-use statement, specifications and warranty conditions before travelling on difficult terrain." } },
                        { "@type": "Question", "name": "Are off road SUVs heavier than touring SUVs?",                    "acceptedAnswer": { "@type": "Answer", "text": "They often can be because stronger chassis components, suspension, larger tyres, additional batteries, water tanks and protection systems add weight. However, weight varies significantly between models." } },
                        { "@type": "Question", "name": "Is independent suspension essential for an off road SUV?",            "acceptedAnswer": { "@type": "Answer", "text": "Independent suspension is common on full off-road SUVs because it can improve wheel movement over uneven terrain, but it is only one part of the overall design. Chassis, tyres, brakes, clearance, body construction and payload are also important." } },
                        { "@type": "Question", "name": "How do I know which off road SUV is right for me?",                   "acceptedAnswer": { "@type": "Answer", "text": "Start with the roads you genuinely intend to travel, then consider your tow vehicle, SUV ATM, payload requirements, desired layout, number of travellers, off-grid duration and budget. Choose the level of off-road capability that matches those needs rather than simply buying the most heavily specified SUV available." } },
                      ],
                    },
                  ],
                }),
              }}
            />
          )}
          {/* Off Road Caravan Market Report page JSON-LD */}
          {isOffRoadMarketReportPage && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@graph": [
                    {
                      "@type": "Article",
                      "@id": "https://www.caravansforsale.com.au/off-road-caravan-market-report/",
                      "url": "https://www.caravansforsale.com.au/off-road-caravan-market-report/",
                      "headline": "Australian Off Road SUV Market Report 2026",
                      "description": "Analysis of active off road SUV advertisements on SuvForSale.com.au covering prices, supply, sizes, weights, brands and location data across Australia.",
                      "inLanguage": "en-AU",
                      "publisher": { "@type": "Organization", "name": "SuvForSale.com.au", "url": "https://www.caravansforsale.com.au/" },
                      "breadcrumb": { "@id": "https://www.caravansforsale.com.au/off-road-caravan-market-report/#breadcrumb" },
                    },
                    {
                      "@type": "BreadcrumbList",
                      "@id": "https://www.caravansforsale.com.au/off-road-caravan-market-report/#breadcrumb",
                      "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Home",              "item": "https://www.caravansforsale.com.au/" },
                        { "@type": "ListItem", "position": 2, "name": "Off Road SUVs", "item": "https://www.caravansforsale.com.au/off-road-caravans/" },
                        { "@type": "ListItem", "position": 3, "name": "Market Report",     "item": "https://www.caravansforsale.com.au/off-road-caravan-market-report/" },
                      ],
                    },
                    {
                      "@type": "FAQPage",
                      "mainEntity": [
                        { "@type": "Question", "name": "How much does an off road SUV cost in Australia?",         "acceptedAnswer": { "@type": "Answer", "text": "The current median advertised asking price for off road SUVs on SuvForSale.com.au varies by condition. New SUVs typically carry a higher median than used SUVs. Check the live market data on this page for current figures." } },
                        { "@type": "Question", "name": "Which state has the most off road SUVs for sale?",         "acceptedAnswer": { "@type": "Answer", "text": "Victoria typically has the largest number of off road SUVs advertised on SuvForSale.com.au, followed by New South Wales and Queensland." } },
                        { "@type": "Question", "name": "What is the most common off road SUV size?",               "acceptedAnswer": { "@type": "Answer", "text": "The 18–20ft range is consistently one of the most common size categories advertised across Australian off road SUV listings." } },
                        { "@type": "Question", "name": "Are the prices in this report actual sale prices?",             "acceptedAnswer": { "@type": "Answer", "text": "No. All prices shown are advertised asking prices from active marketplace listings. The final amount paid may differ from the advertised price." } },
                        { "@type": "Question", "name": "What is ATM and why does it matter for off road SUVs?",    "acceptedAnswer": { "@type": "Answer", "text": "ATM means Aggregate Trailer Mass — the maximum allowable laden weight of the SUV as specified by the manufacturer. It is a key figure when determining whether a tow vehicle is rated to tow a specific SUV." } },
                      ],
                    },
                  ],
                }),
              }}
            />
          )}
          {/* Sell My Caravan page JSON-LD */}
          {isSellMyCaravanPage && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@graph": [
                    {
                      "@type": "WebPage",
                      "@id": "https://www.caravansforsale.com.au/sell-my-suv/#webpage",
                      "url": "https://www.caravansforsale.com.au/sell-my-suv/",
                      "name": "Sell My SUV Online Australia | List Until Sold for $49",
                      "description":
                        "Sell your SUV online across Australia for just $49. List until sold, edit anytime, pay no commission and connect directly with genuine SUV buyers.",
                      "inLanguage": "en-AU",
                      "isPartOf": { "@id": "https://www.caravansforsale.com.au/#website" },
                    },
                    {
                      "@type": "Service",
                      "@id": "https://www.caravansforsale.com.au/sell-my-suv/#service",
                      "name": "Private SUV Listing Service",
                      "url": "https://www.caravansforsale.com.au/sell-my-suv/",
                      "description":
                        "List your SUV for sale on SuvForSale.com.au for a one-time $49 fee. No commissions, no subscriptions, live until sold.",
                      "provider": {
                        "@type": "Organization",
                        "name": "SUVs For Sale",
                        "url": "https://www.caravansforsale.com.au",
                      },
                      "areaServed": {
                        "@type": "Country",
                        "name": "Australia",
                      },
                      "offers": {
                        "@type": "Offer",
                        "price": "49",
                        "priceCurrency": "AUD",
                        "description": "One-time listing fee, live until sold, no commissions",
                      },
                    },
                    {
                      "@type": "FAQPage",
                      "@id": "https://www.caravansforsale.com.au/sell-my-suv/#faqpage",
                      "mainEntity": [
                        {
                          "@type": "Question",
                          "name": "How do I sell my SUV online in Australia?",
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "You can sell your SUV online by creating a private seller listing on SuvForSale.com.au. Add your SUV details, upload clear photos, set your asking price and publish your ad so buyers across Australia can contact you directly.",
                          },
                        },
                        {
                          "@type": "Question",
                          "name": "How much does it cost to list my SUV?",
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "It costs $49 inc. GST to list your SUV on SuvForSale.com.au. This is a one-time listing fee with no monthly subscription, no hidden charges and no commission when your SUV sells.",
                          },
                        },
                        {
                          "@type": "Question",
                          "name": "How long does my SUV listing stay live?",
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Your SUV listing stays live until sold. You do not need to keep paying monthly fees to keep your ad active. Once your SUV is sold, you can remove the listing from the website.",
                          },
                        },
                        {
                          "@type": "Question",
                          "name": "Can I edit my SUV listing after publishing?",
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes. After your listing is published, you can update your SUV details, change the asking price, add or replace photos and improve your description if needed.",
                          },
                        },
                        {
                          "@type": "Question",
                          "name": "How do buyers contact me?",
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Interested buyers can contact you directly through your SUV listing. This allows you to answer questions, arrange inspections, negotiate the price and manage the sale privately.",
                          },
                        },
                        {
                          "@type": "Question",
                          "name": "Do I pay commission when my SUV sells?",
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "No. SuvForSale.com.au does not charge commission when your SUV sells. You pay the one-time listing fee and keep 100% of the agreed sale price.",
                          },
                        },
                        {
                          "@type": "Question",
                          "name": "How should I price my SUV?",
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Check similar SUVs for sale before setting your price. Compare by make, model, year, condition, length, ATM, tare weight, sleeping capacity, features and location. A realistic asking price can help attract more genuine buyers.",
                          },
                        },
                        {
                          "@type": "Question",
                          "name": "Is it safe to sell my SUV privately online?",
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, but you should take normal precautions. Speak with buyers directly, meet in a safe location, confirm payment has cleared before handover and complete any required transfer paperwork for your state or territory.",
                          },
                        },
                      ],
                    },
                  ],
                }),
              }}
            />
          )}
          {/* Sell My Caravan state/region sub-pages JSON-LD */}
          {sellMyCaravanStateJsonLd && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(sellMyCaravanStateJsonLd) }}
            />
          )}
          {sellMyCaravanRegionJsonLd && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(sellMyCaravanRegionJsonLd) }}
            />
          )}
          {/* Dealer Advertising page JSON-LD */}
          {isDealerAdvertisingPage && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(
                  [
                    {
                      "@context": "https://schema.org",
                      "@type": "WebPage",
                      "@id": "https://www.caravansforsale.com.au/dealer-advertising/#webpage",
                      "url": "https://www.caravansforsale.com.au/dealer-advertising/",
                      "name": "SUV Dealer Advertising | Unlimited Listings $299/Month | SuvForSale",
                      "description": "Advertise your SUV dealership on SuvForSale.com.au. Unlimited listings, zero lead fees, $299/month (inc. GST). Cancel anytime.",
                      "isPartOf": { "@id": "https://www.caravansforsale.com.au/#website" },
                      "breadcrumb": { "@id": "https://www.caravansforsale.com.au/dealer-advertising/#breadcrumb" },
                    },
                    {
                      "@context": "https://schema.org",
                      "@type": "BreadcrumbList",
                      "@id": "https://www.caravansforsale.com.au/dealer-advertising/#breadcrumb",
                      "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.caravansforsale.com.au/" },
                        { "@type": "ListItem", "position": 2, "name": "Dealer Advertising", "item": "https://www.caravansforsale.com.au/dealer-advertising/" },
                      ],
                    },
                    {
                      "@context": "https://schema.org",
                      "@type": "Service",
                      "name": "SUV Dealer Advertising",
                      "provider": {
                        "@type": "Organization",
                        "name": "SUVs For Sale",
                        "url": "https://www.caravansforsale.com.au/",
                      },
                      "description": "Unlimited SUV listings on SuvForSale.com.au for $299/month (inc. GST). Zero lead fees, no lock-in contracts, automatic inventory sync.",
                      "url": "https://www.caravansforsale.com.au/dealer-advertising/",
                      "areaServed": { "@type": "Country", "name": "Australia" },
                      "offers": {
                        "@type": "Offer",
                        "price": "299",
                        "priceCurrency": "AUD",
                        "priceSpecification": {
                          "@type": "UnitPriceSpecification",
                          "price": "299",
                          "priceCurrency": "AUD",
                          "unitText": "MONTH",
                        },
                      },
                    },
                    {
                      "@context": "https://schema.org",
                      "@type": "FAQPage",
                      "mainEntity": [
                        {
                          "@type": "Question",
                          "name": "How much does the dealer subscription cost, and what's included?",
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "The dealer subscription is $299 per month (including GST). This flat monthly fee allows your dealership to list unlimited SUVs on SuvForSale.com.au. There are no per-listing charges, and we never charge per lead or take success commissions – no matter how many inquiries or sales you get, $299/month covers it all.",
                          },
                        },
                        {
                          "@type": "Question",
                          "name": "How are my SUV listings added and kept up-to-date automatically?",
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "We sync directly with your dealership's website. Your listings are pulled automatically and refreshed weekly to match your current inventory.",
                          },
                        },
                        {
                          "@type": "Question",
                          "name": "What kind of audience will my SUVs reach?",
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "SuvForSale.com.au is an SUV-only marketplace with a focused, nationwide audience of serious buyers.",
                          },
                        },
                        {
                          "@type": "Question",
                          "name": "Do I have to commit to a long-term contract?",
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "No. The subscription is month-to-month with no lock-in contracts. You can cancel anytime.",
                          },
                        },
                        {
                          "@type": "Question",
                          "name": "How do I get started, and what support can I expect?",
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Getting started is fast and easy. Our team assists with onboarding, website feed integration, and ongoing dealer support.",
                          },
                        },
                      ],
                    },
                  ],
                  null,
                  2
                ).replace(/</g, "\\u003c"),
              }}
            />
          )}
          {/* Blog page JSON-LD */}
          {blogPageJsonLd && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPageJsonLd) }}
            />
          )}
          {/* Product details page JSON-LD */}
          {productJsonLd && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
            />
          )}
          {/* Blog details [slug] page JSON-LD */}
          {blogDetailJsonLd && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(blogDetailJsonLd, null, 2).replace(/</g, "\\u003c") }}
            />
          )}
          {/* Contact page JSON-LD */}
          {isContactPage && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@graph": [
                    {
                      "@type": "WebSite",
                      "@id": "https://www.caravansforsale.com.au/#website",
                      "url": "https://www.caravansforsale.com.au/",
                      "name": "SUVs For Sale",
                      "alternateName": "SUVs For Sale by Marketplace Network",
                    },
                    {
                      "@type": "Organization",
                      "@id": "https://www.caravansforsale.com.au/#organization",
                      "name": "Marketplace Network Pty Ltd",
                      "legalName": "Marketplace Network Pty Ltd",
                      "taxID": "ABN 70 694 987 052",
                      "url": "https://www.caravansforsale.com.au/",
                      "logo": {
                        "@type": "ImageObject",
                        "url": "https://www.caravansforsale.com.au/images/cfs-logo-black.svg",
                        "caption": "SUVs For Sale by Marketplace Network",
                      },
                      "contactPoint": {
                        "@type": "ContactPoint",
                        "contactType": "customer service",
                        "url": "https://www.caravansforsale.com.au/contact/",
                        "availableLanguage": "en",
                        "areaServed": "AU",
                      },
                    },
                    {
                      "@type": "ContactPage",
                      "@id": "https://www.caravansforsale.com.au/contact/#webpage",
                      "url": "https://www.caravansforsale.com.au/contact/",
                      "name": "Contact Us | Get in Touch with SUVs For Sale",
                      "isPartOf": { "@id": "https://www.caravansforsale.com.au/#website" },
                      "about": { "@id": "https://www.caravansforsale.com.au/#organization" },
                      "description": "Have a question about buying, selling, or dealer advertising solutions? Fill out our online contact form to get in touch with the SUVs For Sale customer support team.",
                      "breadcrumb": { "@id": "https://www.caravansforsale.com.au/contact/#breadcrumb" },
                    },
                    {
                      "@type": "BreadcrumbList",
                      "@id": "https://www.caravansforsale.com.au/contact/#breadcrumb",
                      "itemListElement": [
                        {
                          "@type": "ListItem",
                          "position": 1,
                          "name": "Home",
                          "item": "https://www.caravansforsale.com.au/",
                        },
                        {
                          "@type": "ListItem",
                          "position": 2,
                          "name": "Contact Us",
                          "item": "https://www.caravansforsale.com.au/contact/",
                        },
                      ],
                    },
                  ],
                }),
              }}
            />
          )}
          {/* Listings page JSON-LD — CollectionPage + BreadcrumbList */}
          {listingsCollectionLd && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(listingsCollectionLd) }}
            />
          )}
          {/* Listings page JSON-LD — SearchResultsPage with product list */}
          {listingsSearchResultsLd && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(listingsSearchResultsLd) }}
            />
          )}
          {/* ✅ Google Tag Manager (Head) */}
          <Script
            id="gtm-head"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){
                  w[l]=w[l]||[];
                  w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
                  var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),
                    dl=l!='dataLayer'?'&l='+l:'';
                  j.async=true;
                  j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                  f?f.parentNode.insertBefore(j,f):d.head.appendChild(j);
                })(window,document,'script','dataLayer','GTM-N3362FGQ');
              `,
            }}
          />



        </head>
        <body
          className={`flex flex-col min-h-screen new_font ${montserrat.className}`}
        >
          {/* ✅ Google Tag Manager (noscript) - right after body */}
         <noscript>
  <iframe
    src="https://www.googletagmanager.com/ns.html?id=GTM-N3362FGQ"
    height="0"
    width="0"
    style={{ display: "none", visibility: "hidden" }}
  />
</noscript>

  
         <Suspense fallback={null}>
  <UTMTracker />
</Suspense>
<Suspense fallback={null}>
  <NavigationHistory />
</Suspense>
<Suspense fallback={null}>
  <VisitorQualifier />
</Suspense>
<Suspense fallback={null}>
  <VisitorStatus />
</Suspense>
<Suspense fallback={<NavbarSkeleton />}>
  <Navbar />
</Suspense>
                  <Suspense fallback={null}>

          <ScrollToTop />
          </Suspense>
          <main className="product-page style-5 flex-1">
            {/* <NextTopLoader
          color="var(--brand)"
          height={3}
          showSpinner={false}
        /> */}
          <GlobalErrorTracker />
                    <GlobalImageFallback />

          <BannerProvider>
          {children}
          </BannerProvider>
                    </main>
          <Footer />
        </body>
      </html>
      
    );
  }
  