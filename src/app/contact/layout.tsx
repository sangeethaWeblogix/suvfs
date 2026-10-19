 import "./contact.css";
import { Metadata } from "next";
import { site } from "@/config/sites";
import { ReactNode } from "react";



 export const metadata: Metadata = {
   title: {
     default: `Contact ${site.title} | Australia’s ${site.singular} Marketplace`,
     template: "%s ",
   },
   description:
     `Have a question about ${site.nounPlural} in Australia? Contact ${site.title} for support, inquiries, or help finding your next ${site.noun} today.`,
   icons: { icon: "/favicon.ico" },
   robots: "index, follow",
   verification: {
     google: "6tT6MT6AJgGromLaqvdnyyDQouJXq0VHS-7HC194xEo", // ✅ this auto generates <meta name="google-site-verification" />
   },
   alternates: {
    canonical: `${site.url}/contact/`,
   },
   
 
 };
 
   export default function Layout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }
