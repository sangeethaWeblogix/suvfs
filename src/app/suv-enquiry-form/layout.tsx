 import { Metadata } from "next";
import { ReactNode } from "react";
import { site, sitePaths } from "@/config/sites";



 export const metadata: Metadata = {
   title: {
     default: `${site.singular} Enquiry Form | Exclusive ${site.singular} Deals & Offers`,
     template: "%s ",
   },
   description:
     `Fill out our ${site.noun} enquiry form to receive exclusive offers from select quality ${site.noun} manufacturers. Get the best ${site.noun} deals sent directly to you.`,
   icons: { icon: site.favicon },
   robots: "index, follow",
   verification: {
     google: "6tT6MT6AJgGromLaqvdnyyDQouJXq0VHS-7HC194xEo", // ✅ this auto generates <meta name="google-site-verification" />
   },
   alternates: {
    canonical: `${site.url}${sitePaths.enquiry}`,
   },
   
 
 };
 
   export default function Layout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }
