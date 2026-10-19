
 import Autor from './author'
import { fetchBlogs } from '@/api/blog/api';
import { Metadata } from 'next';
import "./author.css";
import { site } from "@/config/sites";


 export const metadata: Metadata = {
title: "Latest News, Reviews & Advice",
  description:
    `Latest news, in-depth reviews, and expert advice on the latest in the ${site.noun} market. Stay informed and make smarter decisions.`,
  robots: "index, follow",
  openGraph: {
  title: "Latest News, Reviews & Advice",
  description:
    `Latest news, in-depth reviews, and expert advice on the latest in the ${site.noun} market. Stay informed and make smarter decisions.`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Latest News, Reviews & Advice",
    description:
      `Latest news, in-depth reviews, and expert advice on the latest in the ${site.noun} market. Stay informed and make smarter decisions.`,
  },
  alternates: {
    canonical: `${site.url}/author/tom/`,
  },

};

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await fetchBlogs(1); // ✅ Server-side fetch
  return <Autor  data={data} currentPage={1} />;
}
