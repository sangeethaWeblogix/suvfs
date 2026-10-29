import { Metadata } from "next";
import { ReactNode } from "react";
import { site } from "@/config/sites";
 
export const metadata: Metadata = {
  title: site.homeTitle,
  description: site.metaDescription,
  robots: "noindex, nofollow",
  alternates: {
    canonical: `${site.url}/home-demo/`,
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
