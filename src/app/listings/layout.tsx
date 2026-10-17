import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SUVs for Sale in Victoria | SuvForSale.com.au",
  description: "Browse new and used SUVs for sale in Victoria from dealers and private sellers.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
