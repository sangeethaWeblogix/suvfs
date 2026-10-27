 import { Metadata } from "next";
import { site } from "@/config/sites";
import { ReactNode } from "react";



 export const metadata: Metadata = {
   title: {
     default: `About ${site.singular} Marketplace - Your Trusted ${site.singular} Resource`,
     template: "%s ",
   },
   description:
     `${site.singular} Marketplace is your go-to platform for finding the perfect ${site.noun} from the right manufacturer or dealer @ the right price.`,
   icons: { icon: site.favicon },
   robots: "index, follow",
   verification: {
     google: site.googleVerification, // ✅ this auto generates <meta name="google-site-verification" />
   },
   alternates: {
    canonical: `${site.url}/about-us/`,
   },
   
 
 };
 
   export default function Layout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }
