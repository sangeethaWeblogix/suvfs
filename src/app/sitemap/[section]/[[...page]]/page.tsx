// /sitemap/{section}/ and /sitemap/{section}/{n}/ — plain-link lists for the
// large sitemap sections, SITEMAP_PAGE_SIZE per page. Page 1 lives at
// /sitemap/{section}/ only (no /1/ duplicate). Numbered paths are used because
// middleware 410s any /page/N or ?page= URL.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/config/sites";
import { withSocial } from "@/lib/socialMeta";
import { SITEMAP_PAGE_SIZE, SITEMAP_SECTIONS, getLinks } from "@/lib/sitemapSections";
import "../../sitemap.css";

// A cold list (e.g. models by location) takes several API calls to build.
export const maxDuration = 60;

type Params = Promise<{ section: string; page?: string[] }>;

async function resolve(params: Params) {
  const { section: key, page } = await params;
  const section = SITEMAP_SECTIONS.find((s) => s.key === key);
  if (!section) notFound();
  if (page && (page.length !== 1 || !/^\d+$/.test(page[0]) || Number(page[0]) < 2)) notFound();
  const n = page ? Number(page[0]) : 1;
  return { section, n, path: `/sitemap/${section.key}/${n > 1 ? `${n}/` : ""}` };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { section, n, path } = await resolve(params);
  const pageText = n > 1 ? ` – Page ${n}` : "";
  return withSocial(
    {
      title: `${section.title}${pageText} | ${site.brand}`,
      description: `${section.description} Browse the complete, up-to-date list on ${site.brand}${n > 1 ? ` (page ${n})` : ""} and open any link to see the ${site.nounPlural} for sale.`,
      robots: "index, follow",
      alternates: { canonical: `${site.url}${path}` },
    },
    path,
  );
}

export default async function SitemapSectionPage({ params }: { params: Params }) {
  const { section, n } = await resolve(params);
  const links = await getLinks(section);
  const pages = Math.max(1, Math.ceil(links.length / SITEMAP_PAGE_SIZE));
  if (n > pages) notFound();
  const shown = links.slice((n - 1) * SITEMAP_PAGE_SIZE, n * SITEMAP_PAGE_SIZE);
  const pageHref = (p: number) => `/sitemap/${section.key}/${p > 1 ? `${p}/` : ""}`;

  return (
    <main className="container sitemap-page">
      <nav className="sitemap-crumbs" aria-label="Breadcrumb">
        <Link href="/sitemap/" prefetch={false}>Sitemap</Link> › {section.title}
      </nav>
      <h1>
        {section.title}
        {n > 1 ? ` – Page ${n}` : ""}
      </h1>
      <p className="sitemap-intro">
        {links.length.toLocaleString("en-AU")} pages{pages > 1 ? ` · page ${n} of ${pages}` : ""}
      </p>

      <ul className="sitemap-links">
        {shown.map((l) => (
          <li key={l.href}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>

      {pages > 1 && (
        <nav className="sitemap-pager" aria-label="Pages">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) =>
            p === n ? (
              <span key={p} aria-current="page">{p}</span>
            ) : (
              <a key={p} href={pageHref(p)}>{p}</a>
            ),
          )}
        </nav>
      )}
    </main>
  );
}
