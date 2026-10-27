 import { Metadata } from "next";
import { site } from "@/config/sites";
import { ReactNode } from "react";



 export const metadata: Metadata = {
   title: {
     default: `${site.singular} Dealer Advertising | Unlimited Listings $299/Month | ${site.brand}`,
     template: "%s ",
   },
   description:
     `Advertise your ${site.noun} dealership on ${site.brand}. Unlimited listings, zero lead fees, and reach high-intent ${site.noun} buyers across Australia.`,
   icons: { icon: site.favicon },
   robots: "index, follow",
   verification: {
     google: site.googleVerification, // ✅ this auto generates <meta name="google-site-verification" />
   },
   alternates: {
    canonical: `${site.url}/dealer-advertising/`,
   },
   
 
 };
 
   export default function Layout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }
