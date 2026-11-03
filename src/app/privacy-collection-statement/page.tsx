import { Metadata } from "next";
import { site } from "@/config/sites";
import Statement from "./statement";
import "./statement.css?=123";
import { withSocial } from "@/lib/socialMeta";

export async function generateMetadata(): Promise<Metadata> {
  const metaTitle = "Privacy Collection Statement - Marketplace Network";
  const metaDescription =
    "Learn how Marketplace Network Pty Ltd collects and uses personal information when you submit enquiries or interact with our marketplace websites.";

  const robots = "index";

  return withSocial({
    title: metaTitle,
    description: metaDescription,
    robots: robots,

    alternates: {
      canonical: `${site.url}/privacy-collection-statement/`,
    },

    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `${site.url}/privacy-collection-statement/`,
      type: "article",
    },

    twitter: {
      title: metaTitle,
      description: metaDescription,
    },
  }, "/privacy-collection-statement/");
}
export default function Home() {
  return <Statement />;
}
