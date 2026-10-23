"use client";

import { site } from "@/config/sites";
import { Fragment, useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { isIndexableListingPath } from "@/utils/seo/indexRules";
import { useSiteFacets, useSiteFilterSchema } from "./SiteFilters";
import {
  budgetRow,
  buildIndexableBrowseRows,
  scopeBrowseHref,
  type BrowseFilterRow,
  type SiteFacets,
} from "./siteBrowseFilters";
import {
  toStateSlug,
  stateLabel,
  STATES,
  buildAllRegionsForState,
  loadBrowseCounts,
  subjectFieldsFor,
  findRegionBySlug,
  type CountItem,
  type BrowseSectionData,
} from "./browseSectionShared";

async function fetchGroupCounts(groupBy: string, scope: Record<string, string>): Promise<CountItem[]> {
  try {
    const qs = new URLSearchParams({ group_by: groupBy, ...scope });
    const res = await fetch(`/api/params-count/?${qs.toString()}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data ?? [];
  } catch {
    return [];
  }
}

async function fetchTotal(scope: Record<string, string>): Promise<number | null> {
  try {
    const qs = new URLSearchParams({ group_by: "make", ...scope });
    const res = await fetch(`/api/params-count/?${qs.toString()}`);
    if (!res.ok) return null;
    const total = (await res.json())?.total_products;
    return typeof total === "number" ? total : null;
  } catch {
    return null;
  }
}

/** Overrides the state-wide facets with this location's own counts for the
 * indexable filters, so region pages don't link to values with no listings. */
function withSubjectCounts(facets: SiteFacets, subjectCounts?: Record<string, CountItem[]> | null): SiteFacets {
  const merged = { ...facets };
  for (const [field, items] of Object.entries(subjectCounts ?? {})) {
    if (items?.length) merged[field] = Object.fromEntries(items.map((item) => [item.slug, item.count]));
  }
  return merged;
}

interface Props {
  state?: string;
  region?: string;
  /** Make slug — on a make page (no location) adds the make's state/region/model links. */
  make?: string;
  /** This page's own /listings/ path — never linked from its own browse section. */
  currentPath?: string;
  /** Server-fetched counts (SSR/ISR) for the current filters — when present,
   * seeds the pills/links straight into the first render (so they land in
   * page source for crawlers) and skips the redundant client-side refetch. */
  initialData?: BrowseSectionData;
}

/** "Browse by …" section under the listings — internal links that pass weight
 * to indexed pages, following the caravans site's pattern:
 *   Australia — states + popular makes; budget and key filters Australia-wide
 *   state     — regions + makes in the state; budget and key filters in the state
 *   region    — makes + first key filter in the region; budget, the rest and year
 * Every link is checked against the index rules (utils/seo/indexRules.ts), so
 * only indexed pages are linked, never the current one. Noindex pages (suburb, other
 * filters) get their state/region's section, so crawlers still flow into
 * indexed pages from them. */
export default function StateBrowseSection({ state, region, make, currentPath, initialData }: Props) {
  const schema = useSiteFilterSchema();
  // State-wide facets — trims year bands (and the rest until counts arrive).
  const siteFacets = useSiteFacets(state ? { state: toStateSlug(state) } : {});
  const regionMode = !!state && !!region;
  const currentMake = make?.toLowerCase();
  const normPath = (p: string) => p.split("?")[0].replace(/\/$/, "").toLowerCase();
  // A link worth showing: indexable, and not the page being viewed.
  const linkable = (href: string) =>
    isIndexableListingPath(href) && (!currentPath || normPath(href) !== normPath(currentPath));

  // Seeded from server-fetched initialData when available (SSR), so the
  // first render already has real data instead of null/skeleton.
  const [counts, setCounts] = useState<BrowseSectionData | null>(initialData ?? null);

  // initialData only covers the filters the server rendered this page with —
  // filter changes happen via client-side pushState (see home.tsx), not a
  // fresh server request, so once state/region drift from this captured
  // snapshot the effect below must fall back to fetching live.
  const initialFiltersRef = useRef({ state, region, make });
  const isInitialFilters =
    state === initialFiltersRef.current.state &&
    region === initialFiltersRef.current.region &&
    make === initialFiltersRef.current.make;

  useEffect(() => {
    if (initialData?.makeCounts !== undefined && isInitialFilters) return;
    let cancelled = false;
    setCounts(null);
    loadBrowseCounts(fetchGroupCounts, fetchTotal, { state, region, make }, subjectFieldsFor(schema.map((s) => s.field)))
      .then((data) => { if (!cancelled) setCounts(data); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, region, make]);

  const makeCounts = counts?.makeCounts ?? null;
  const facets = withSubjectCounts(siteFacets, counts?.subjectCounts);
  const subjectRows = buildIndexableBrowseRows(schema, facets);

  // Scope a row's links to this page's location and drop any that would lead
  // to a noindex page. A one-link column ("By Wheelbase: Long") reads as
  // broken, so it gives its place to the next filter.
  const scopeRows = (rows: BrowseFilterRow[]) =>
    rows
      .map((row) => ({
        ...row,
        items: row.items
          .map((item) => ({ ...item, href: scopeBrowseHref(item.href, state, regionMode ? region : undefined) }))
          .filter((item) => linkable(item.href)),
      }))
      .filter((row) => row.items.length >= 2);

  // While the make counts are in flight (null), render shimmer pills instead
  // of nothing so a slow response doesn't look empty.
  const pillSkeleton = (count = 8) => (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="lsd-skeleton lsd-browse__pill-skeleton"
          style={{ width: 56 + (i % 5) * 16 }}
        />
      ))}
    </>
  );

  // A list much longer than its neighbours (budget's 9 bands next to 4–5
  // drive types/seats) splits into two sub-columns so the cards end level.
  const renderFilterCols = (panels: { icon: LucideIcon; title: string; links: { text: string; href: string }[] }[], rowClass: string) => {
    const others = panels.slice(1).map((p) => p.links.length);
    const splitFirst = panels.length === 4 && panels[0].links.length > Math.max(6, ...others) + 2;
    return (
      <div className={`lsd-browse__row2 ${rowClass}${splitFirst ? " lsd-browse__row2--lead" : ""}`}>
        {panels.map((p, i) => {
          const Icon = p.icon;
          const split = splitFirst && i === 0;
          const rows = Math.ceil(p.links.length / 2);
          return (
            <div key={p.title} className="lsd-browse__filter-col">
              <div className="lsd-browse__filter-head">
                <Icon size={20} aria-hidden="true" />
                <span className="lsd-browse__filter-title">{p.title}</span>
              </div>
              <div
                className={`lsd-browse__filter-links${split ? " lsd-browse__filter-links--split" : ""}`}
                style={split ? { gridTemplateRows: `repeat(${rows}, auto)` } : undefined}
              >
                {p.links.map((l, j) => (
                  <a
                    key={l.text}
                    href={l.href}
                    className={`lsd-browse__filter-link${split && j === rows - 1 ? " lsd-browse__filter-link--col-end" : ""}`}
                  >
                    {l.text}
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (regionMode) {
    const regionName = stateLabel(region!);
    const stateSlug  = toStateSlug(state!);
    const regionSlug = toStateSlug(region!);
    const browseTitle = (row: BrowseFilterRow) => `Browse ${site.plural} ${row.label.replace(/^By /, "by ")} in ${regionName}`;

    const makePanel = (makeCounts ?? [])
      .filter((m) => m.count > 0 && m.slug !== currentMake)
      .map((m) => ({ text: m.name, href: `/listings/${m.slug}/${stateSlug}-state/${regionSlug}-region/` }))
      .filter((m) => linkable(m.href));

    // First key filter sits beside the makes as pills; budget, the rest and
    // year become the columns below — no row is shown twice.
    const [pillRow, ...columnRows] = scopeRows(subjectRows);
    const panels = [...scopeRows([budgetRow(facets, counts?.priceCounts)]), ...columnRows].slice(0, 4).map((row) => ({
      icon: row.icon,
      title: browseTitle(row),
      links: row.items,
    }));

    const showMakePanel = makeCounts === null || makePanel.length > 0;

    return (
      <section className="lsd-browse">
        <div className="container">

          {(showMakePanel || pillRow) && (
            <div className="lsd-browse__row1">
              {showMakePanel && (
                <div className="lsd-browse__panel">
                  <h3 className="lsd-browse__panel-title">{`Browse ${site.plural} by Popular Manufacturers in ${regionName}`}</h3>
                  <div className={`lsd-browse__pills${makePanel.length > 12 ? " lsd-browse__pills--scroll" : ""}`}>
                    {makeCounts === null ? pillSkeleton() : makePanel.map((m) => (
                      <a key={m.text} href={m.href} className="lsd-browse__pill">{m.text}</a>
                    ))}
                  </div>
                </div>
              )}

              {showMakePanel && pillRow && <div className="lsd-browse__divider-v" />}

              {pillRow && (
                <div className="lsd-browse__panel">
                  <h3 className="lsd-browse__panel-title">{browseTitle(pillRow)}</h3>
                  <div className="lsd-browse__pills">
                    {pillRow.items.map((c) => (
                      <a key={c.text} href={c.href} className="lsd-browse__pill">{c.text}</a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {renderFilterCols(panels, panels.length === 4 ? "" : "lsd-browse__row2--three")}

        </div>
      </section>
    );
  }

  // State pages list only regions that have listings (all while counts load),
  // and the Australia-wide page only states that do — empty pages are noindex.
  const regionCounts = counts?.regionCounts;
  const stateCounts = siteFacets?.states as Record<string, number> | undefined;
  const regions = (state
    ? buildAllRegionsForState(state).filter((r) =>
        !regionCounts?.length || regionCounts.some((c) => c.count > 0 && r.href.endsWith(`/${c.slug}-region/`)))
    : STATES.filter((s) => !stateCounts || Number(stateCounts[s.href.match(/listings\/([a-z-]+)-state\//)?.[1] ?? ""] ?? 0) > 0)
  ).filter((r) => linkable(r.href));
  // Other makes only — the current make's page is the one being viewed.
  const manufacturerLinks = (makeCounts ?? [])
    .filter((m) => m.count > 0 && m.slug !== currentMake)
    .map((make) => ({
      label: make.name,
      href: state
        ? `/listings/${make.slug}/${toStateSlug(state)}-state/`
        : `/listings/${make.slug}/`,
    }))
    .filter((m) => linkable(m.href))
    .slice(0, 12);
  // Budget + key filters (year fills in when a site has fewer key filters).
  // Price bands are indexed with a location too, so states get budget as well.
  const filterRows = scopeRows([budgetRow(facets, counts?.priceCounts), ...subjectRows]).slice(0, 4);

  // Make page (no location) — this make by state, by region and its models,
  // each only where the make has listings.
  const makeSlug = make && !state ? make.toLowerCase() : null;
  const makeName = makeSlug
    ? makeCounts?.find((m) => m.slug === makeSlug)?.name ?? stateLabel(makeSlug.replace(/-/g, " "))
    : "";
  const makePanels = makeSlug
    ? [
        {
          key: "state",
          title: `Find ${makeName} ${site.plural} by State`,
          counts: counts?.makeStateCounts,
          links: (counts?.makeStateCounts ?? [])
            .filter((c) => c.count > 0)
            .map((c) => ({ text: c.name, href: `/listings/${makeSlug}/${c.slug}-state/` })),
        },
        {
          key: "region",
          title: `Find ${makeName} ${site.plural} by Region`,
          counts: counts?.makeRegionCounts,
          links: (counts?.makeRegionCounts ?? [])
            .filter((c) => c.count > 0)
            .map((c) => ({ text: c.name, region: findRegionBySlug(c.slug) }))
            .filter((c) => c.region)
            .map(({ text, region: r }) => ({ text, href: `/listings/${makeSlug}/${r!.state.slug}-state/${r!.pageSlug}-region/` })),
        },
        {
          key: "model",
          title: `Popular ${makeName} Models`,
          counts: counts?.modelCounts,
          // Most-listed first (API order); capped so a big range stays a few rows.
          links: (counts?.modelCounts ?? [])
            .filter((c) => c.count > 0)
            .slice(0, 24)
            .map((c) => ({ text: c.name, href: `/listings/${makeSlug}/${c.slug}/` })),
        },
      ]
        .map((p) => ({ ...p, links: p.links.filter((l) => linkable(l.href)) }))
        // While counts load (null) keep the panel with a skeleton; once loaded, hide empty ones.
        .filter((p) => p.counts == null || p.links.length > 0)
    : [];
  const makeTop = makePanels.filter((p) => p.key !== "model");
  const makeModels = makePanels.find((p) => p.key === "model");
  const renderMakePanel = (p: (typeof makePanels)[number]) => (
    <div className="lsd-browse__panel">
      <h3 className="lsd-browse__panel-title">{p.title}</h3>
      <div className="lsd-browse__pills">
        {p.counts == null ? pillSkeleton(6) : p.links.map((l) => (
          <a key={l.href} href={l.href} className="lsd-browse__pill">{l.text}</a>
        ))}
      </div>
    </div>
  );

  const leftTitle  = state ? `Browse ${site.plural} by Region in ${stateLabel(state)}` : `Browse ${site.plural} by State`;
  const rightTitle = state
    ? `Browse ${site.plural} by Popular Makes in ${stateLabel(state)}`
    : `Browse ${site.plural} by Popular Makes`;

  return (
    <section className="lsd-browse">
      <div className="container">

        {/* Make page — states beside regions (regions get the wider column),
            models full width underneath; nothing scrolls. */}
        {makePanels.length > 0 && (
          <div className="lsd-browse__make-card">
            {makeTop.length > 0 && (
              <div className={`lsd-browse__make-top${makeTop.length === 1 ? " lsd-browse__make-top--single" : ""}`}>
                {makeTop.map((p, i) => (
                  <Fragment key={p.key}>
                    {i > 0 && <div className="lsd-browse__divider-v" />}
                    {renderMakePanel(p)}
                  </Fragment>
                ))}
              </div>
            )}
            {makeModels && (
              <div className={makeTop.length > 0 ? "lsd-browse__make-models" : undefined}>
                {renderMakePanel(makeModels)}
              </div>
            )}
          </div>
        )}

        {/* Row 1 — Region/State + popular makes */}
        <div className="lsd-browse__row1 lsd-browse__row1--makes">
          <div className="lsd-browse__panel">
            <h3 className="lsd-browse__panel-title">{leftTitle}</h3>
            <div className="lsd-browse__pills">
              {regions.map((r) => (
                <a key={r.name} href={r.href} className="lsd-browse__pill">{r.name}</a>
              ))}
            </div>
          </div>

          <div className="lsd-browse__divider-v" />

          <div className="lsd-browse__panel">
            <h3 className="lsd-browse__panel-title">{rightTitle}</h3>
            <div className="lsd-browse__type-grid">
              {makeCounts === null
                ? pillSkeleton(6)
                : manufacturerLinks.map((make) => (
                    <a key={make.label} href={make.href} className="lsd-browse__type-card">{make.label}</a>
                  ))}
            </div>
          </div>
        </div>

        {/* Row 2 — budget and this site's indexable filters. */}
        {renderFilterCols(
          filterRows.map((row) => ({ icon: row.icon, title: row.label, links: row.items })),
          "",
        )}

      </div>
    </section>
  );
}
