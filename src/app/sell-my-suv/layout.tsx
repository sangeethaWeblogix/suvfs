import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sell My SUV Online Australia | List Until Sold for $49",
  description:
    "Sell your SUV online across Australia for just $49. List until sold, edit anytime, pay no commission and connect directly with genuine SUV buyers.",
  robots: "index, follow",
  alternates: {
    canonical: "https://www.caravansforsale.com.au/sell-my-suv/",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
