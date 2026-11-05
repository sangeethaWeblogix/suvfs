 import { Metadata } from "next";
import { ReactNode } from "react";
import { site, sitePaths } from "@/config/sites";



 export const metadata: Metadata = {
   title: {
     default: `${site.singular} Enquiry Form | Find the Right ${site.singular} for You`,
     template: "%s ",
   },
   description:
     `Tell us what ${site.noun} you're looking for, from size and features to budget, and we'll help connect you with relevant ${site.nounPlural} from participating sellers across Australia.`,
   icons: { icon: site.favicon },
   robots: "index, follow",
   verification: {
     google: site.googleVerification, // ✅ this auto generates <meta name="google-site-verification" />
   },
   alternates: {
    canonical: `${site.url}${sitePaths.enquiry}`,
   },
   
 
 };
 
   export default function Layout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }
