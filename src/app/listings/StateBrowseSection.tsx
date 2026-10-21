"use client";

import { site } from "@/config/sites";
import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { useSiteFacets, useSiteFilterSchema } from "./SiteFilters";
import {
  budgetRow,
  buildSiteFilterRows,
  scopeBrowseHref,
} from "./siteBrowseFilters";
import {
  toStateSlug,
  stateLabel,
  STATES,
  buildAllRegionsForState,
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

interface Props {
  state?: string;
  region?: string;
  /** Server-fetched counts (SSR/ISR) for the current filters — when present,
   * seeds the pills/links straight into the first render (so they land in
   * page source for crawlers) and skips the redundant client-side refetch. */
  initialData?: BrowseSectionData;
}

/** "Browse by …" section under the listings. Rows come from this site's filter
 * schema (budget, year and the site's key filters), trimmed to options that
 * have listings; the top row shows regions/states and popular makes. */
export default function StateBrowseSection({ state, region, initialData }: Props) {
  const siteFilterSchema = useSiteFilterSchema();
  // Counts for this state (or the whole site) — drops chips with no listings.
  const siteFacets = useSiteFacets(state ? { state: toStateSlug(state) } : {});
  const schemaRows = buildSiteFilterRows(siteFilterSchema, siteFacets);
  const budget = budgetRow(siteFacets);
  const typeRow = schemaRows.find((row) => row.field !== "year");
  const stateRegionMode = !!state && !!region;

  // Seeded from server-fetched initialData when available (SSR), so the
  // first render already has real data instead of null/skeleton.
  const [makeCounts, setMakeCounts] = useState<CountItem[] | null>(initialData?.makeCounts ?? null);

  // initialData only covers the filters the server rendered this page with —
  // filter changes happen via client-side pushState (see home.tsx), not a
  // fresh server request, so once state/region drift from this captured
  // snapshot the effect below must fall back to fetching live.
  const initialFiltersRef = useRef({ state, region });
  const isInitialFilters =
    state === initialFiltersRef.current.state &&
    region === initialFiltersRef.current.region;

  useEffect(() => {
    if (initialData?.makeCounts !== undefined && isInitialFilters) return;
    let cancelled = false;
    setMakeCounts(null);
    const scope: Record<string, string> = {};
    if (state) scope.state = state;
    if (stateRegionMode) scope.region = region!;
    fetchGroupCounts("make", scope).then((data) => { if (!cancelled) setMakeCounts(data); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, region]);

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

  const renderFilterCols = (panels: { icon: LucideIcon; title: string; links: { text: string; href: string }[] }[], rowClass: string) => (
    <div className={`lsd-browse__row2 ${rowClass}`}>
      {panels.filter((p) => p.links.length > 0).map((p) => {
        const Icon = p.icon;
        return (
          <div key={p.title} className="lsd-browse__filter-col">
            <div className="lsd-browse__filter-head">
              <Icon size={20} aria-hidden="true" />
              <span className="lsd-browse__filter-title">{p.title}</span>
            </div>
            <div className="lsd-browse__filter-links">
              {p.links.map((l) => (
                <a key={l.text} href={l.href} className="lsd-browse__filter-link">{l.text}</a>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  if (stateRegionMode) {
    const regionName = stateLabel(region!);
    const stateSlug   = toStateSlug(state!);
    const regionSlug  = toStateSlug(region!);
    const basePath    = `/listings/${stateSlug}-state/${regionSlug}-region`;
    const inRegion = (href: string) => `${basePath}${href.replace("/listings", "")}`;

    const makePanel = (makeCounts ?? [])
      .filter((m) => m.count > 0)
      .map((m) => ({ text: m.name, href: `/listings/${m.slug}/${stateSlug}-state/${regionSlug}-region/` }));

    const typePanel = (typeRow?.items ?? []).map((item) => ({ text: item.text, href: inRegion(item.href) }));

    const panels = [budget, ...schemaRows].map((row) => ({
      icon: row.icon,
      title: `Browse ${site.plural} ${row.label.toLowerCase()} in ${regionName}`,
      links: row.items.map((item) => ({ text: item.text, href: inRegion(item.href) })),
    }));

    const showMakePanel = makeCounts === null || makePanel.length > 0;
    const showTypePanel = typePanel.length > 0;

    return (
      <section className="lsd-browse">
        <div className="container">

          {(showMakePanel || showTypePanel) && (
            <div className="lsd-browse__row1">
              {showMakePanel && (
                <div className="lsd-browse__panel">
                  <h3 className="lsd-browse__panel-title">{`Browse ${site.plural} by Popular Manufacturers in ${regionName}`}</h3>
                  <div className="lsd-browse__pills">
                    {makeCounts === null ? pillSkeleton() : makePanel.map((m) => (
                      <a key={m.text} href={m.href} className="lsd-browse__pill">{m.text}</a>
                    ))}
                  </div>
                </div>
              )}

              {showMakePanel && showTypePanel && <div className="lsd-browse__divider-v" />}

              {showTypePanel && (
                <div className="lsd-browse__panel">
                  <h3 className="lsd-browse__panel-title">{`Browse ${site.plural} ${typeRow!.label.toLowerCase()} in ${regionName}`}</h3>
                  <div className="lsd-browse__pills">
                    {typePanel.map((c) => (
                      <a key={c.text} href={c.href} className="lsd-browse__pill">{c.text}</a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {renderFilterCols(panels, "lsd-browse__row2--three")}

        </div>
      </section>
    );
  }

  const regions = state ? buildAllRegionsForState(state) : STATES;
  const manufacturerLinks = (makeCounts ?? [])
    .filter((make) => make.count > 0)
    .slice(0, 12)
    .map((make) => ({
      label: make.name,
      href: state
        ? `/listings/${make.slug}/${toStateSlug(state)}-state/`
        : `/listings/${make.slug}/`,
    }));
  // Year is left out here — it's in the filter bar and the row would crowd the panel.
  const filterRows = [budget, ...schemaRows.filter((row) => row.field !== "year")]
    .map((row) => ({
      ...row,
      items: row.items.map((item) => ({ ...item, href: scopeBrowseHref(item.href, state) })),
    }))
    .filter((row) => row.items.length > 0);

  const leftTitle  = state ? `Browse ${site.plural} by Region in ${stateLabel(state)}` : `Browse ${site.plural} by State`;
  const rightTitle = state
    ? `Browse ${site.plural} by Popular Makes in ${stateLabel(state)}`
    : `Browse ${site.plural} by Popular Makes`;

  return (
    <section className="lsd-browse">
      <div className="container">

        {/* Row 1 — Region/State + popular makes */}
        <div className="lsd-browse__row1">
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

        {/* Row 2 — budget and the filters recommended for this car site. */}
        <div className="lsd-browse__row2">
          {filterRows.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.field} className="lsd-browse__filter-col">
                <div className="lsd-browse__filter-head">
                  <Icon size={20} aria-hidden="true" />
                  <span className="lsd-browse__filter-title">{f.label}</span>
                </div>
                <div className="lsd-browse__filter-links">
                  {f.items.map((item) => (
                    <a key={item.text} href={item.href} className="lsd-browse__filter-link">{item.text}</a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
