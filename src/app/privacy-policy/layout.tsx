 import { Metadata } from "next";
import { site } from "@/config/sites";
import { ReactNode } from "react";



 export const metadata: Metadata = {
   title: {
     default: "Privacy Policy – Marketplace Network",
     template: "%s ",
   },
   description:
     "Read the Privacy Policy for websites operated by Marketplace Network Pty Ltd (ABN 70 694 987 052), including how we collect, use, and protect your personal information.",
   icons: { icon: site.favicon },
   robots: "index",
   verification: {
     google: "6tT6MT6AJgGromLaqvdnyyDQouJXq0VHS-7HC194xEo", // ✅ this auto generates <meta name="google-site-verification" />
   },
   alternates: {
    canonical: `${site.url}/privacy-policy/`,

   },
   
   openGraph: {
      url: `${site.url}/privacy-policy/`,
     title: `Privacy Policy - ${site.domain} - ${site.singular} Marketplace`,
       description:
     `Learn about ${site.singular} Marketplace's privacy policy on data collection, usage, security measures, and your rights regarding your information.`,
     
   },
 };
 
   export default function Layout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }
