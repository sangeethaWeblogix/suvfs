import Blogs from "./page/[page]/BlogListClient";
import "./blog.css?=3";
import { Metadata } from "next";
import { fetchBlogs } from "@/api/blog/api";
import { site } from "@/config/sites";

export const metadata: Metadata = {
  title: { default: "Latest News, Reviews & Advice", template: "%s " },
  description:
    `Latest news, in-depth reviews, and expert advice on the latest in the ${site.noun} market. Stay informed and make smarter decisions.`,
  icons: { icon: "/favicon.ico" },
  robots: "index, follow",
  alternates: {
    canonical: `${site.url}/blog/`,

   },
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const data = await fetchBlogs(1);

  return <Blogs data={data} currentPage={1} />;
}
