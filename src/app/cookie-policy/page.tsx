import { Metadata } from "next";
import { site } from "@/config/sites";
import Statement from "./statement";
import "./statement.css?=123";
import { withSocial } from "@/lib/socialMeta";

export async function generateMetadata(): Promise<Metadata> {
  const metaTitle = "Cookie Policy - Marketplace Network";
  const metaDescription =
    "Read our Cookie Policy for websites operated by Marketplace Network Pty Ltd (ABN 70 694 987 052), including how we collect, use, and protect your personal information.";

  const robots = "index";

  return withSocial({
    title: metaTitle,
    description: metaDescription,
    robots: robots,

    alternates: {
      canonical: `${site.url}/cookie-policy/`,
    },

    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `${site.url}/cookie-policy/`,
      type: "article",
    },

    twitter: {
      title: metaTitle,
      description: metaDescription,
    },
  }, "/cookie-policy/");
}

export default function Home() {
  return <Statement />;
}