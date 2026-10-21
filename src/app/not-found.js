import Link from "next/link";
import "./not-found.css";
import Notfound from "./searchError";
import { site } from "@/config/sites";
import { BUDGET_ROW } from "@/app/listings/siteBrowseFilters";

export const metadata = {
  title: `404 - Page Not Found | ${site.title}`,
  description: `The page you're looking for doesn't exist or has been moved. Browse our range of ${site.nounPlural} for sale across Australia.`,
  robots: "noindex, nofollow",
};

export default function NotFoundPage() {
  const states = [
    {
      name: "Australian Capital Territory",
      slug: "australian-capital-territory-state",
    },
    { name: "New South Wales", slug: "new-south-wales-state" },
    { name: "Northern Territory", slug: "northern-territory-state" },
    { name: "Queensland", slug: "queensland-state" },
    { name: "South Australia", slug: "south-australia-state" },
    { name: "Victoria", slug: "victoria-state" },
    { name: "Western Australia", slug: "western-australia-state" },
    { name: "Tasmania", slug: "tasmania-state" },
  ];

  return (
    <div className="page-wrap">
      <div className="card" role="main" aria-labelledby="page-title">
        <h1 id="page-title" className="err-number">
          404
        </h1>
        <p className="err-sub">
          Oops! The {site.noun} or page you’re looking for isn’t available.
        </p>

        <div className="search-wrap">
          <form action="/search" method="get" role="search">
            <Notfound />
          </form>
        </div>

        <div className="actions">
          <Link className="btn btn-primary" href="/">
            Go to Homepage
          </Link>
          <a className="btn btn-outline" href="/listings/">
            Browse {site.plural}
          </a>
        </div>

        {/* ✅ Browse by Budget & State Side by Side */}
        <div className="browse-grid">
          {/* Left: Budget */}
          <div className="browse-column">
            <h4>Browse by Budget:</h4>
            <ul>
              {BUDGET_ROW.items.map((band) => (
                <li key={band.href}>
                  <a href={band.href}>{band.text}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: State */}
          <div className="browse-column">
            <h4>Browse by State:</h4>
            <ul>
              {states.map((state) => (
                <li key={state.slug}>
                  <a href={`/listings/${state.slug}/`}>
                    {state.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
