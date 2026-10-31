import Home from "./home-demo/home";
import "./globals.css?=1";
import { Metadata } from "next";
import { headers } from "next/headers";
import { site } from "@/config/sites";

import { fetchStateBasedCaravans } from "@/api/homeApi/state/api";
import { fetchRequirements } from "@/api/postRquirements/api";
import { fetchHomePage } from "@/api/home/api";
import { fetchHomeFeatured } from "@/api/homeApi/featured/api";
import { fetchBlogs } from "@/api/blog/api";
import { fetchSiteFacets, fetchSiteSchema } from "@/lib/siteSchema";
import { fetchHomeLinkCounts } from "@/app/listings/fetchBrowseSectionData";

const FEATURED_SEED_MAX = 15;

export const dynamic = "force-dynamic";

const HOME_TITLE = site.homeTitle;
const HOME_DESCRIPTION = site.metaDescription;

export const metadata: Metadata = {
  title: {
    default: HOME_TITLE,
    template: "%s ",
  },
  description: HOME_DESCRIPTION,
  icons: { icon: site.favicon },
  robots: "index, follow",
  verification: {
    google: site.googleVerification,
  },
  alternates: {
    canonical: site.url,
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: site.url,
    siteName: `${site.plural} for Sale`,
    images: [
      {
        url: `${site.url}${site.ogImage}`,
        width: 1200,
        height: 630,
        alt: `${site.plural} for Sale Australia`,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
};

export default async function Page() {
  const h = await headers();
  const visitorIp =
    h.get("cf-connecting-ip") ||
    h.get("x-forwarded-for")?.split(",")[0].trim() ||
    h.get("x-real-ip") ||
    "";
  const featuredSeed = Math.floor(Math.random() * FEATURED_SEED_MAX) + 1;

  const [
    stateBands,
    requirements,
    homeblog,
    featuredAll,
    featuredNew,
    featuredUsed,
    blogPosts,
    siteFilterSchema,
    siteFacets,
    linkCounts,
  ] = await Promise.all([
    fetchStateBasedCaravans(),
    fetchRequirements(),
    fetchHomePage(),
    fetchHomeFeatured({ type: "all", seed: featuredSeed, visitorIp }),
    fetchHomeFeatured({ type: "new", seed: featuredSeed, visitorIp }),
    fetchHomeFeatured({ type: "used", seed: featuredSeed, visitorIp }),
    fetchBlogs(1),
    fetchSiteSchema(),
    fetchSiteFacets(),
    fetchHomeLinkCounts(),
  ]);

  return (
    <Home
      stateBands={stateBands}
      requirements={requirements}
      homeblog={homeblog?.latest_posts ?? []}
      featuredAll={featuredAll}
      featuredNew={featuredNew}
      featuredUsed={featuredUsed}
      blogPosts={blogPosts.items.slice(0, 6)}
      visitorIp={visitorIp}
      siteFilterSchema={siteFilterSchema}
      siteFacets={siteFacets}
      linkCounts={linkCounts}
    />
  );
}
