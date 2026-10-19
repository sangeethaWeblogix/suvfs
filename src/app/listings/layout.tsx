import { site } from "@/config/sites";
import type { Metadata } from "next";
import { fetchSiteSchema } from "@/lib/siteSchema";
import { SiteSchemaProvider } from "./SiteFilters";

export const metadata: Metadata = {
  title: `${site.plural} for Sale in Victoria | ${site.brand}`,
  description: `Browse new and used ${site.nounPlural} for sale in Victoria from dealers and private sellers.`,
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  // This site's filter panel (fuel, transmission, odometer, …) for StateFilterBar.
  const schema = await fetchSiteSchema();
  return <SiteSchemaProvider schema={schema}>{children}</SiteSchemaProvider>;
}
