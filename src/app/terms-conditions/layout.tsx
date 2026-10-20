 import { Metadata } from "next";
import { site } from "@/config/sites";
import { ReactNode } from "react";



 export const metadata: Metadata = {
   title: {
     default: `Terms of Use – ${site.brand} | Marketplace Network`,
     template: "%s ",
   },
   description:
     `Read the Terms of Use for ${site.brand}, a marketplace platform operated by Marketplace Network Pty Ltd (ABN 70 694 987 052). Learn about listings, user responsibilities, and platform policies.`,
   icons: { icon: site.favicon },
   robots: "index, follow",
   verification: {
     google: "6tT6MT6AJgGromLaqvdnyyDQouJXq0VHS-7HC194xEo", // ✅ this auto generates <meta name="google-site-verification" />
   },
   alternates: {
    canonical: `${site.url}/terms-conditions/`,

   },
   
   openGraph: {
      url: `${site.url}/terms-conditions/`,
     title: `Terms of Use – ${site.brand} | Marketplace Network`,
       description:
     `Read the Terms of Use for ${site.brand}, a marketplace platform operated by Marketplace Network Pty Ltd (ABN 70 694 987 052). Learn about listings, user responsibilities, and platform policies.`,
     
   },
 };
 
   export default function Layout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }
