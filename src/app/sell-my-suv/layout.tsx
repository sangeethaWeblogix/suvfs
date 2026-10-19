import { Metadata } from "next";
import { ReactNode } from "react";
import { site, sitePaths } from "@/config/sites";

export const metadata: Metadata = {
  title: `Sell My ${site.singular} Online Australia | List Until Sold for $49`,
  description:
    `Sell your ${site.noun} online across Australia for just $49. List until sold, edit anytime, pay no commission and connect directly with genuine ${site.noun} buyers.`,
  robots: "index, follow",
  alternates: {
    canonical: `${site.url}${sitePaths.sell}`,
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
