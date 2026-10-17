import { Metadata } from "next";
import { ReactNode } from "react";
 
export const metadata: Metadata = {
  title: "SUVs For Sale – Australia’s Marketplace for New & Used SUVs",
  description:"Browse SUVs for sale across Australia. Compare prices on off-road, hybrid, pop top, touring, luxury models with size, weight & sleeping capacity",
  robots: "noindex, nofollow",
  alternates: {
    canonical: "https://www.caravansforsale.com.au/home-demo/",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
