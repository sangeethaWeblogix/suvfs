  // app/410/page.tsx
import "./page.css";
import { headers } from "next/headers";
import { isIndexableListingPath } from "@/utils/seo/indexRules";
import StateHome from "@/app/listings/home";
import { parseDemoFilters, buildListingsSlug } from "@/app/listings/urlUtils";
import { fetchBrowseSectionData } from "@/app/listings/fetchBrowseSectionData";
import { fetchInitialPool } from "@/app/listings/fetchInitialPool";
import { site } from "@/config/sites";

export const metadata = {
  title: `410 - Page Permanently Removed | ${site.title}`,
  description:
    "This page has been permanently removed and is no longer available.",
  robots: { index: false, follow: false },
};

const isPathIndexed = isIndexableListingPath;

export default async function GonePage() {
  // The middleware rewrites to /410/ but the original URL is still in x-pathname
  const headersList = await headers();
  const originalPathname = headersList.get("x-pathname") || "";

  // Defensive fallback only — in normal operation, /listings/... URLs with
  // exclusive-only products are rewritten to /api/listings-410/ (which
  // renders the real /listings/ page directly), never to /410/. If some
  // other path ever lands here with real listing content, render it instead
  // of the plain 410 UI.
  if (originalPathname.startsWith("/listings")) {
    try {
      const slugParts = originalPathname
        .replace("/listings", "")
        .split("/")
        .filter(Boolean);

      const initialFilters = parseDemoFilters(slugParts, {});
      const canonicalPath = buildListingsSlug(initialFilters);
      const isIndexed = isPathIndexed(canonicalPath);

      const [browseData, initialPool] = await Promise.all([
        fetchBrowseSectionData(initialFilters, isIndexed),
        fetchInitialPool(initialFilters, isIndexed, 0),
      ]);

      const hasListings =
        !!initialPool &&
        (initialPool.featured.length > 0 ||
          initialPool.new.length > 0 ||
          initialPool.used.length > 0);

      if (hasListings) {
        return (
          <StateHome
            initialFilters={initialFilters}
            browseData={browseData}
            initialPool={initialPool}
            serverIsIndexed={isIndexed}
          />
        );
      }
    } catch {
      // Fall through to 410 UI
    }
  }

  return (
    <div className="page-wrap-410">
      <div className="card-410">
        <p className="err-number-410" aria-hidden="true">410</p>
        <h1 className="err-title-410">Page Permanently Removed</h1>
        <p className="err-desc-410">
          The page you requested has been permanently removed and is no longer available.
        </p>
      </div>
    </div>
  );
}
