// src/app/sitemap.xml/route.ts
import { NextResponse } from "next/server";
import { site } from "@/config/sites";

export async function GET() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || site.url;

  // One entry per sitemap type the cars API supports
  // (/car-sites/{site}/sitemap: listings, blog, states, regions, makes,
  // models, state-make, region-make, price) plus the static pages.
  const sitemaps = [
    "general-sitemap.xml",
    "listings-sitemap.xml",
    "states-sitemap.xml",
    "regions-sitemap.xml",
    "makes-sitemap.xml",
    "blogs-sitemap.xml",
    "models-sitemap.xml",
    "prices-sitemap.xml",
    "state-make-sitemap.xml",
    "region-make-sitemap.xml",
  ];

  const lastModified = new Date().toISOString().split("T")[0];

  // 🚀 Build XML — no trim, no space before XML declaration
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemaps.map(
      (file) => `  <sitemap>
    <loc>${siteUrl}/${file}</loc>
    <lastmod>${lastModified}</lastmod>
  </sitemap>`,
    ),
    "</sitemapindex>",
  ].join("\n");

  // ✅ Send as raw UTF-8 bytes (so header stays visible)
  return new NextResponse(Buffer.from(xml, "utf-8"), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
