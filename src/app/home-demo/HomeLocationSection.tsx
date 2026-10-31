"use client";

import Image from "next/image";
import { site } from "@/config/sites";
import type { SchemaItem } from "@/app/listings/SiteFilters";
import { budgetRow, buildSiteFilterRows, isLinkableListingPath, type SiteFacets } from "@/app/listings/siteBrowseFilters";
import type { HomeLinkCounts } from "@/app/listings/fetchBrowseSectionData";

const MAJOR_CITIES = [
  { name: "Adelaide",   href: "/listings/south-australia-state/adelaide-region/",    imgSrc: "/images/Adelaide.png"   },
  { name: "Brisbane",   href: "/listings/queensland-state/brisbane-region/",         imgSrc: "/images/Brisbane.png"   },
  { name: "Gold Coast", href: "/listings/queensland-state/gold-coast-region/",       imgSrc: "/images/Gold-Coast.png" },
  { name: "Melbourne",  href: "/listings/victoria-state/melbourne-region/",          imgSrc: "/images/Melbourne.png"  },
  { name: "Perth",      href: "/listings/western-australia-state/perth-region/",     imgSrc: "/images/Perth.png"      },
  { name: "Sydney",     href: "/listings/new-south-wales-state/sydney-region/",      imgSrc: "/images/Sydney.png"     },
];

const MINOR_CITIES = [
  { name: "Cairns",         href: "/listings/queensland-state/cairns-region/" },
  { name: "Canberra",       href: "/listings/australian-capital-territory-state/australian-capital-territory-region/" },
  { name: "Darwin",         href: "/listings/northern-territory-state/darwin-region/" },
  { name: "Geelong",        href: "/listings/victoria-state/geelong-region/" },
  { name: "Hobart",         href: "/listings/tasmania-state/hobart-region/" },
  { name: "Newcastle",      href: "/listings/new-south-wales-state/newcastle-region/" },
  { name: "Sunshine Coast", href: "/listings/queensland-state/sunshine-coast-region/" },
  { name: "Townsville",     href: "/listings/queensland-state/townsville-region/" },
  { name: "Wollongong",     href: "/listings/new-south-wales-state/illawarra-region/" },
  { name: "Ballarat",       href: "/listings/victoria-state/ballarat-region/" },
];

/** False when the city's page would be empty (empty listings pages are noindex):
 * no listings in its region, or — when region counts are unknown — in its state.
 * Counts are live, so a city comes back by itself once it has stock. */
function hasCityListings(href: string, facets?: SiteFacets | null, linkCounts?: HomeLinkCounts | null): boolean {
  const regionCounts = linkCounts?.regionCounts;
  if (regionCounts?.length) {
    return regionCounts.some((c) => c.count > 0 && href.endsWith(`/${c.slug}-region/`));
  }
  const states = facets?.states;
  if (!states || typeof states !== "object") return true;
  const state = href.match(/^\/listings\/([a-z-]+)-state\//)?.[1];
  return !state || Number(states[state] ?? 0) > 0;
}

export default function HomeLocationSection({ schema, facets, linkCounts }: {
  schema: SchemaItem[];
  facets?: SiteFacets | null;
  linkCounts?: HomeLinkCounts | null;
}) {
  // No year row here — the listings footer still links single years.
  // Every chip must lead to an indexed, non-empty page (never a 410).
  const filterRows = [{ ...budgetRow(facets, linkCounts?.priceCounts), label: "By Your Budget" }, ...buildSiteFilterRows(schema, facets)]
    .map((row) => ({ ...row, items: row.items.filter((item) => isLinkableListingPath(item.href)) }))
    .filter((row) => row.field !== "year" && row.items.length > 0);
  const showCity = (city: { href: string }) =>
    isLinkableListingPath(city.href) && hasCityListings(city.href, facets, linkCounts);
  const majorCities = MAJOR_CITIES.filter(showCity);
  const minorCities = MINOR_CITIES.filter(showCity);
  return (
    <section className="hloc-section">
      <div className="container">

        <div className="hloc-header">
          <h2 className="hloc-title">
            Find {site.plural} for Sale by <span className="hloc-title-accent">Popular Location</span>
          </h2>
          <p className="hloc-subtitle">Browse new and used {site.nounPlural} for sale near you across major Australian cities and regions.</p>
          
        </div>

        <div className="hloc-major-grid">
          {majorCities.map((city) => (
            <a key={city.name} href={city.href} className="hloc-city-card">
              <div className="hloc-city-img-wrap">
                <div className="hloc-city-circle" />
                <Image
                  src={city.imgSrc}
                  alt={city.name}
                  width={110}
                  height={80}
                  className="hloc-city-img"
                  unoptimized
                />
              </div>
              <h3 className="hloc-city-name">
                {city.name} <span className="hloc-city-arrow"></span>
              </h3>
            </a>
          ))}
        </div>

        <div className="hloc-minor-wrap">
          {minorCities.map((city, idx) => (
            <a
              key={city.name}
              href={city.href}
              className={`hloc-minor-pill${idx === 0 ? " hloc-minor-pill--active" : ""}`}
            >
              <h3>{city.name}</h3>
            </a>
          ))}
        </div>
<div className="hloc-header">
  <h2 className="hloc-title">
           Search {site.plural} for Sale <span className="hloc-title-accent">Your Way</span>
          </h2>
          <p className="hloc-subtitle">Browse new and used {site.nounPlural} for sale by price, make and the features that matter to you.</p>
        </div>
        <div className="hloc-filters">
          
          {filterRows.map((f) => {
            const Icon = f.icon;
            return (
            <div key={f.label} className="hloc-filter-row">
              <div className="hloc-filter-label">
                <span className="hloc-filter-icon-box"><Icon size={22} aria-hidden="true" /></span>
                <span className="hloc-filter-text">{f.label}</span>
              </div>
              <div className="hloc-filter-chips">
                <h3>
                {f.items.map((item,) => (

                  <a key={item.text} href={item.href} className="hloc-chip">
                   {item.text}</a>
                ))}
                </h3>
              </div>
            </div>
            );
          })}
        </div>
 
        

      </div>
    </section>
  );
}
