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

const FEATURED_SEED_MAX = 15;

export const dynamic = "force-dynamic";

const HOME_TITLE = `${site.title} – New & Used ${site.singular} Marketplace in Australia`;
const HOME_DESCRIPTION = `Browse ${site.nounPlural} for sale across Australia. Compare prices on off-road, hybrid, pop top, touring, luxury models with size, weight & sleeping capacity.`;

export const metadata: Metadata = {
  title: {
    default: HOME_TITLE,
    template: "%s ",
  },
  description: HOME_DESCRIPTION,
  icons: { icon: "/favicon.ico" },
  robots: "index, follow",
  verification: {
    google: "6tT6MT6AJgGromLaqvdnyyDQouJXq0VHS-7HC194xEo",
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
        url: `${site.url}/images/cfs-logo.png`,
        width: 800,
        height: 600,
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
  ] = await Promise.all([
    fetchStateBasedCaravans(),
    fetchRequirements(),
    fetchHomePage(),
    fetchHomeFeatured({ type: "all", seed: featuredSeed, visitorIp }),
    fetchHomeFeatured({ type: "new", seed: featuredSeed, visitorIp }),
    fetchHomeFeatured({ type: "used", seed: featuredSeed, visitorIp }),
    fetchBlogs(1),
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
    />
  );
}
