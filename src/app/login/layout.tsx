  import { Metadata } from "next";
import { ReactNode } from "react";
import { site } from "@/config/sites";




 export const metadata: Metadata = {
   title: `Login | ${site.title} – Dealer & Private Seller Access`,
  description:
     `Access your ${site.brand} account. Private sellers and dealers can log in to manage listings, post ${site.nounPlural} for sale, and connect with thousands of buyers across Australia.`,
   icons: { icon: site.favicon },
   robots: "index, follow",
   verification: {
     google: site.googleVerification, // ✅ this auto generates <meta name="google-site-verification" />
   },
   alternates: {
    canonical: `${site.url}/login/`,
   },
   
 
 };
 
   export default function Layout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }
