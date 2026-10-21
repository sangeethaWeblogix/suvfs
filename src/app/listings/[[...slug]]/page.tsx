import type { Metadata } from "next";
import StateHome from "../home";
import { parseDemoFilters, buildListingsSlug } from "../urlUtils";
import { metaFromSlug } from "@/utils/seo/meta";
import { isIndexableListingPath } from "@/utils/seo/indexRules";
import { fetchBrowseSectionData, fetchGroupCountsServer } from "../fetchBrowseSectionData";
import { fetchInitialPool } from "../fetchInitialPool";
import { fetchProductList } from "@/api/productList/api";
import { buildMakeCountScope } from "../paramsCountScope";
import "../../globals.css";

export const revalidate = 86400;

const isPathIndexed = isIndexableListingPath;

type Params = Promise<{ slug?: string[] }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}): Promise<Metadata> {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const slugArr = slug ?? [];
  const meta = await metaFromSlug(slugArr, query);
  // Only title is returned here — description/canonical/robots/og/twitter are
  // injected directly into <head> JSX by the root layout (see src/app/layout.tsx)
  // to avoid the Next.js 15 async-metadata + streaming = metadata-in-body issue.
  return { title: meta.title };
}

export default async function LocationStateDemoPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const initialFilters = parseDemoFilters(slug ?? [], query);
  console.log("[listings/[[...slug]]/page.tsx] slug:", slug, "query:", query, "initialFilters:", initialFilters);

  // Determine isIndexed server-side so fetchInitialPool buckets products
  // correctly (featured/new/used split vs combined grid) from the first byte.
  // Without this, SSR always uses isIndexed=true and the client-side
  // /api/indexed-url/ check then triggers a second pool fetch to fix the layout.
  const canonicalPath = buildListingsSlug(initialFilters);
  const isIndexed = isPathIndexed(canonicalPath);

  // Make counts, scoped to initialFilters via the exact same buildMakeCountScope
  // StateFilterBar uses client-side — so the server fetches the identical query
  // the client would have fetched on mount, and StateFilterBar skips that refetch.
  const makeCountScope = Object.fromEntries(buildMakeCountScope(initialFilters));

  const [browseData, initialPool, productList, makeCounts] = await Promise.all([
    fetchBrowseSectionData(initialFilters),
    fetchInitialPool(initialFilters, isIndexed),
    fetchProductList(),
    fetchGroupCountsServer("make", makeCountScope),
  ]);

  return (
    <StateHome
      initialFilters={initialFilters}
      browseData={browseData}
      initialPool={initialPool}
      serverIsIndexed={isIndexed}
      initialStates={productList?.data?.states ?? []}
      initialMakeCounts={makeCounts}
    />
  );
}
