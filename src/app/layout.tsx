
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
import { site, sitePaths } from "@/config/sites";
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
import { buildCarPageJsonLd } from "@/utils/seo/carSchema";
import { websiteLd, organizationLd, ORGANIZATION_ID } from "@/utils/seo/siteSchema";

// Top-level route segments that are NOT handled by the [slug] blog-details
// catch-all — used to avoid firing a wasted fetchBlogDetail() call for them.
const RESERVED_TOP_LEVEL_SLUGS = new Set([
  "about-us", "api", "author", "blog", "buyer-safety-guide", sitePaths.enquiry.replace(/\//g, ""),
  "caravan-homepage-takeover", "caravan-manufacturers", "caravan-sales", "contact",
  "cookie-policy", "dealer-advertising", "family-caravan-category-sponsorship",
  "hybrid-caravan-category-sponsorship", "listings", "login",
  "luxury-caravan-category-sponsorship", "pop-top-caravan-category-sponsorship",
  "privacy-collection-statement", "privacy-policy", "product", "product-detail-demo",
  sitePaths.sell.replace(/\//g, ""), "store", "terms-conditions", "touring-caravan-category-sponsorship",
  "404", "410", "sitemap.xml", "robots.txt", "favicon.ico",
]);

// Capitalised indefinite article for sentence-start use ("An SUV", "A ute").
const Article = site.article === "an" ? "An" : "A";

  const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    display: "swap",
    variable: "--font-montserrat",
    preload: true,
  });

  
  export const metadata: Metadata = {
    icons: { icon: site.favicon },
    // robots: "index, follow",
    verification: {
      google: site.googleVerification, // ✅ this auto generates <meta name="google-site-verification" />
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
    const isSellMyCaravanPage = pathname === sitePaths.sell || pathname === sitePaths.sell.slice(0, -1);
    const isDealerAdvertisingPage = pathname === "/dealer-advertising/" || pathname === "/dealer-advertising";
    const isBlogPage = pathname === "/blog/" || pathname === "/blog";

    let blogPageJsonLd: object | null = null;
    if (isBlogPage) {
      const data = await fetchBlogs(1);
      blogPageJsonLd = [
        { "@context": "https://schema.org", ...websiteLd() },
        { "@context": "https://schema.org", ...organizationLd() },
        {
          "@context": "https://schema.org",
          "@type": "Blog",
          name: `${site.plural} for Sale Blog`,
          description:
            `Latest news, in-depth reviews, and expert advice on the latest in the ${site.noun} market.`,
          url: `${site.url}/blog/`,
          publisher: { "@id": ORGANIZATION_ID },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog/` },
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
        const canonical = `${site.url}/${slug}/`;
        const blogTitle = seo.metatitle || post.title || `${site.plural} for Sale Blog`;
        const blogDescription =
          seo.metadescription || post.short_description || `Read more on ${site.plural} for Sale.`;
        const bannerImage =
          post.banner_image || post.image || `${site.url}/load.svg`;
        const safeIso = (dateStr?: string) => {
          if (!dateStr) return new Date().toISOString();
          const d = new Date(dateStr);
          return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
        };

        blogDetailJsonLd = [
          { "@context": "https://schema.org", ...websiteLd() },
          { "@context": "https://schema.org", ...organizationLd() },
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
            headline: blogTitle,
            description: blogDescription,
            image: bannerImage,
            author: { "@type": "Person", name: "Tom" },
            publisher: { "@id": ORGANIZATION_ID },
            datePublished: safeIso(post.date),
            dateModified: safeIso(post.date),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog/` },
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

    // {sitePaths.sell}{state}/ and {sitePaths.sell}{state}/{region}/ — JSON-LD is
    // data-driven per slug, so look it up here instead of hardcoding like the other pages.
    let sellMyCaravanStateJsonLd: object | null = null;
    let sellMyCaravanRegionJsonLd: object | null = null;
    if (pathname.startsWith(sitePaths.sell) && !isSellMyCaravanPage) {
      const segments = pathname.slice(sitePaths.sell.length).replace(/\/$/, "").split("/").filter(Boolean);
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
        title: `Top 10 ${site.singular} Manufacturers in Australia: Best Brands of 2024`,
        description: `See how top Australian ${site.noun} manufacturers excel with the best in innovative designs, quality construction, cost efficiency, and expert craftsmanship.`,
        canonical: `${site.url}/caravan-manufacturers/`,
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
      const raw = (data as any)?.raw;
      if (raw?.slug && raw?.title) {
        const seo = (data as any)?.seo ?? {};
        productJsonLd = buildCarPageJsonLd(raw, { title: seo.metatitle, description: seo.metadescription });
      }
    }

    // Listings JSON-LD — fetched here so both schemas render inside <head>
    // Second call hits Next.js data cache (revalidate: 3600), no extra network round-trip.
    let listingsJsonLd: object | null = null;
    if (isMainListings || isListingSlug) {
      const normalizedPath = pathname.endsWith("/") ? pathname : pathname + "/";
      const listingsData = await fetchListingsForHead(normalizedPath);
      if (listingsData) {
        const crumbs = buildBreadcrumbs(pathname);
        const pageUrl = `${site.url}${normalizedPath}`;
        listingsJsonLd = await buildListingsJsonLd(listingsData, pageUrl, crumbs);
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
        slugCanonical = `${site.url}/listings/${slugParts.join("/")}/`;
        slugDescription = site.metaDescription;
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
          slugDescription = site.metaDescription;
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
      <html lang="en" style={{ "--brand": site.color, "--brand-rgb": site.colorRgb, "--brand-secondary": site.secondaryColor, "--seller-card-image": `url(${site.sellerCardImage})`, "--details-banner-image": `url(${site.detailsBannerImage})` } as React.CSSProperties}>
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
                  "@graph": [websiteLd(), organizationLd()],
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
                    websiteLd(),
                    organizationLd(),
                    {
                      "@type": "WebPage",
                      "@id": `${site.url}${sitePaths.sell}#webpage`,
                      "url": `${site.url}${sitePaths.sell}`,
                      "name": `Sell My ${site.singular} Online Australia | List Until Sold for $49`,
                      "description":
                        `Sell your ${site.noun} online across Australia for just $49. List until sold, edit anytime, pay no commission and connect directly with genuine ${site.noun} buyers.`,
                      "inLanguage": "en-AU",
                      "isPartOf": { "@id": `${site.url}/#website` },
                    },
                    {
                      "@type": "Service",
                      "@id": `${site.url}${sitePaths.sell}#service`,
                      "name": `Private ${site.singular} Listing Service`,
                      "url": `${site.url}${sitePaths.sell}`,
                      "description":
                        `List your ${site.noun} for sale on ${site.brand} for a one-time $49 fee. No commissions, no subscriptions, live until sold.`,
                      "provider": { "@id": ORGANIZATION_ID },
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
                      "@id": `${site.url}${sitePaths.sell}#faqpage`,
                      "mainEntity": [
                        {
                          "@type": "Question",
                          "name": `How do I sell my ${site.noun} online in Australia?`,
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `You can sell your ${site.noun} online by creating a private seller listing on ${site.brand}. Add your ${site.noun} details, upload clear photos, set your asking price and publish your ad so buyers across Australia can contact you directly.`,
                          },
                        },
                        {
                          "@type": "Question",
                          "name": `How much does it cost to list my ${site.noun}?`,
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `It costs $49 inc. GST to list your ${site.noun} on ${site.brand}. This is a one-time listing fee with no monthly subscription, no hidden charges and no commission when your ${site.noun} sells.`,
                          },
                        },
                        {
                          "@type": "Question",
                          "name": `How long does my ${site.noun} listing stay live?`,
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `Your ${site.noun} listing stays live until sold. You do not need to keep paying monthly fees to keep your ad active. Once your ${site.noun} is sold, you can remove the listing from the website.`,
                          },
                        },
                        {
                          "@type": "Question",
                          "name": `Can I edit my ${site.noun} listing after publishing?`,
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `Yes. After your listing is published, you can update your ${site.noun} details, change the asking price, add or replace photos and improve your description if needed.`,
                          },
                        },
                        {
                          "@type": "Question",
                          "name": "How do buyers contact me?",
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `Interested buyers can contact you directly through your ${site.noun} listing. This allows you to answer questions, arrange inspections, negotiate the price and manage the sale privately.`,
                          },
                        },
                        {
                          "@type": "Question",
                          "name": `Do I pay commission when my ${site.noun} sells?`,
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `No. ${site.brand} does not charge commission when your ${site.noun} sells. You pay the one-time listing fee and keep 100% of the agreed sale price.`,
                          },
                        },
                        {
                          "@type": "Question",
                          "name": `How should I price my ${site.noun}?`,
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `Check similar ${site.nounPlural} for sale before setting your price. Compare by make, model, year, kilometres, condition, features and location. A realistic asking price can help attract more genuine buyers.`,
                          },
                        },
                        {
                          "@type": "Question",
                          "name": `Is it safe to sell my ${site.noun} privately online?`,
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
                    { "@context": "https://schema.org", ...websiteLd() },
                    { "@context": "https://schema.org", ...organizationLd() },
                    {
                      "@context": "https://schema.org",
                      "@type": "WebPage",
                      "@id": `${site.url}/dealer-advertising/#webpage`,
                      "url": `${site.url}/dealer-advertising/`,
                      "name": `${site.singular} Dealer Advertising | Unlimited Listings $299/Month | ${site.brand}`,
                      "description": `Advertise your ${site.noun} dealership on ${site.brand}. Unlimited listings, zero lead fees, $299/month (inc. GST). Cancel anytime.`,
                      "isPartOf": { "@id": `${site.url}/#website` },
                      "breadcrumb": { "@id": `${site.url}/dealer-advertising/#breadcrumb` },
                    },
                    {
                      "@context": "https://schema.org",
                      "@type": "BreadcrumbList",
                      "@id": `${site.url}/dealer-advertising/#breadcrumb`,
                      "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${site.url}/` },
                        { "@type": "ListItem", "position": 2, "name": "Dealer Advertising", "item": `${site.url}/dealer-advertising/` },
                      ],
                    },
                    {
                      "@context": "https://schema.org",
                      "@type": "Service",
                      "name": `${site.singular} Dealer Advertising`,
                      "provider": { "@id": ORGANIZATION_ID },
                      "description": `Unlimited ${site.noun} listings on ${site.brand} for $299/month (inc. GST). Zero lead fees, no lock-in contracts, automatic inventory sync.`,
                      "url": `${site.url}/dealer-advertising/`,
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
                            "text": `The dealer subscription is $299 per month (including GST). This flat monthly fee allows your dealership to list unlimited ${site.nounPlural} on ${site.brand}. There are no per-listing charges, and we never charge per lead or take success commissions – no matter how many inquiries or sales you get, $299/month covers it all.`,
                          },
                        },
                        {
                          "@type": "Question",
                          "name": `How are my ${site.noun} listings added and kept up-to-date automatically?`,
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "We sync directly with your dealership's website. Your listings are pulled automatically and refreshed weekly to match your current inventory.",
                          },
                        },
                        {
                          "@type": "Question",
                          "name": `What kind of audience will my ${site.nounPlural} reach?`,
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `${site.brand} is ${site.article} ${site.noun}-only marketplace with a focused, nationwide audience of serious buyers.`,
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
                    websiteLd(),
                    organizationLd(),
                    {
                      "@type": "ContactPage",
                      "@id": `${site.url}/contact/#webpage`,
                      "url": `${site.url}/contact/`,
                      "name": `Contact Us | Get in Touch with ${site.title}`,
                      "isPartOf": { "@id": `${site.url}/#website` },
                      "about": { "@id": `${site.url}/#organization` },
                      "description": `Have a question about buying, selling, or dealer advertising solutions? Fill out our online contact form to get in touch with the ${site.title} customer support team.`,
                      "breadcrumb": { "@id": `${site.url}/contact/#breadcrumb` },
                    },
                    {
                      "@type": "BreadcrumbList",
                      "@id": `${site.url}/contact/#breadcrumb`,
                      "itemListElement": [
                        {
                          "@type": "ListItem",
                          "position": 1,
                          "name": "Home",
                          "item": `${site.url}/`,
                        },
                        {
                          "@type": "ListItem",
                          "position": 2,
                          "name": "Contact Us",
                          "item": `${site.url}/contact/`,
                        },
                      ],
                    },
                  ],
                }),
              }}
            />
          )}
          {/* Listings page JSON-LD — one @graph: WebSite, Organization, CollectionPage, BreadcrumbList, ItemList of cars, FAQPage */}
          {listingsJsonLd && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(listingsJsonLd) }}
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
  