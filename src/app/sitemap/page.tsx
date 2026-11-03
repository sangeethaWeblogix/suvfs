// /sitemap/ — HTML sitemap (footer "Sitemap"), laid out like onlycars.com.au/sitemap.
// Buying pages only (sell, info and policy pages are already in the footer).
// Small lists are shown in full; the large ones (every listing, make/model by
// location, year, price, features) link to paginated /sitemap/{section}/ pages.
import type { Metadata } from "next";
import { site } from "@/config/sites";
import { withSocial } from "@/lib/socialMeta";
import {
  BUY_BASICS,
  INLINE_SOURCES,
  SITEMAP_SECTIONS,
  getLinks,
  type SitemapLink,
} from "@/lib/sitemapSections";
import "./sitemap.css";

export const metadata: Metadata = withSocial(
  {
    title: `Sitemap | ${site.brand}`,
    description: `Sitemap for ${site.brand}: every ${site.noun} for sale, plus all makes, models, states, regions, years, price ranges and features in one place.`,
    robots: "index, follow",
    alternates: { canonical: `${site.url}/sitemap/` },
  },
  "/sitemap/",
);

function Block({ title, links }: { title: string; links: SitemapLink[] }) {
  if (links.length === 0) return null;
  return (
    <div className="sitemap-block">
      <h3>{title}</h3>
      <ul className="sitemap-links">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function SitemapPage() {
  // One API call per list; a failed list is left out rather than failing the page.
  const [states, regions, makes, models] = await Promise.all(
    [INLINE_SOURCES.states, INLINE_SOURCES.regions, INLINE_SOURCES.makes, INLINE_SOURCES.models].map((s) =>
      getLinks(s).catch(() => [] as SitemapLink[]),
    ),
  );
  const moreLinks = SITEMAP_SECTIONS.map((s) => ({ href: `/sitemap/${s.key}/`, label: s.title }));

  return (
    <main className="container sitemap-page">
      <h1>Sitemap</h1>

      <section className="sitemap-group">
        <h2>Buy</h2>
        <Block title={`${site.plural} for Sale`} links={BUY_BASICS} />
        <Block title={`${site.plural} for Sale by State`} links={states} />
        <Block title={`${site.plural} for Sale by Region`} links={regions} />
        <Block title="Popular Makes for Sale" links={makes} />
        <Block title={`${site.singular} Models for Sale`} links={models} />
        <Block title="More Ways to Browse" links={moreLinks} />
      </section>
    </main>
  );
}
