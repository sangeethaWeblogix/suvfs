import { site } from "@/config/sites";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${site.plural} for Sale in Victoria | ${site.brand}`,
  description: `Browse new and used ${site.nounPlural} for sale in Victoria from dealers and private sellers.`,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
