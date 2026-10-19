import { Metadata } from "next";
import { site } from "@/config/sites";
import Statement from "./statement";
import "./statement.css?=123";

export async function generateMetadata(): Promise<Metadata> {
  const metaTitle = `Buyer Safety Guide - ${site.brand}`;
  const metaDescription =
    `Learn how to buy ${site.article} ${site.noun} safely on ${site.brand}. Follow our buyer safety checklist including VIN checks, PPSR searches, secure payments, and scam prevention tips.`;

  const robots = "index";

  return {
    title: metaTitle,
    description: metaDescription,
    robots: robots,

    alternates: {
      canonical: `${site.url}/buyer-safety-guide/`,
    },

    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `${site.url}/buyer-safety-guide/`,
      type: "article",
    },

    twitter: {
      title: metaTitle,
      description: metaDescription,
    },
  };
}

export default function Home() {
  return <Statement />;
}