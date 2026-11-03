 import "./contact.css";
import { Metadata } from "next";
import { site } from "@/config/sites";
import { ReactNode } from "react";
import { withSocial } from "@/lib/socialMeta";



 export const metadata: Metadata = withSocial({
   title: {
     default: `Contact ${site.title} | Australia’s ${site.singular} Marketplace`,
     template: "%s ",
   },
   description:
     `Have a question about ${site.nounPlural} in Australia? Contact ${site.title} for support, inquiries, or help finding your next ${site.noun} today.`,
   icons: { icon: site.favicon },
   robots: "index, follow",
   verification: {
     google: site.googleVerification, // ✅ this auto generates <meta name="google-site-verification" />
   },
   alternates: {
    canonical: `${site.url}/contact/`,
   },
   
 
 }, "/contact/");
 
   export default function Layout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }
