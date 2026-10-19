import { Metadata } from "next";
import { ReactNode } from "react";
import { site } from "@/config/sites";
 
export const metadata: Metadata = {
  title: `${site.title} – Australia’s Marketplace for New & Used ${site.plural}`,
  description: `Browse ${site.nounPlural} for sale across Australia. Compare prices on off-road, hybrid, pop top, touring, luxury models with size, weight & sleeping capacity`,
  robots: "noindex, nofollow",
  alternates: {
    canonical: `${site.url}/home-demo/`,
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
