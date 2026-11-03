import type { Metadata } from "next";
import { site } from "@/config/sites";

/** Site-wide share image (same one the home page uses). */
export function siteOgImage() {
  return {
    url: `${site.url}${site.ogImage}`,
    width: 1200,
    height: 630,
    alt: `${site.plural} for Sale Australia`,
  };
}

function titleText(title: Metadata["title"]): string {
  if (!title) return "";
  if (typeof title === "string") return title;
  if ("absolute" in title && title.absolute) return title.absolute;
  if ("default" in title && title.default) return title.default;
  return "";
}

/**
 * Fills in complete Open Graph + Twitter card tags (title, description, url,
 * type, site name, image, card) from the page's own title/description.
 * Fields the page already sets win. Ahrefs flags pages whose og/twitter tags
 * are missing or lack og:type / og:image / twitter:card / twitter:image.
 */
export function withSocial(meta: Metadata, path: string): Metadata {
  const title = titleText(meta.title);
  const description = typeof meta.description === "string" ? meta.description : "";
  const image = siteOgImage();

  return {
    ...meta,
    openGraph: {
      title,
      description,
      url: `${site.url}${path}`,
      siteName: `${site.plural} for Sale`,
      images: [image],
      type: "website",
      ...(meta.openGraph ?? {}),
    } as Metadata["openGraph"],
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
      ...(meta.twitter ?? {}),
    } as Metadata["twitter"],
  };
}
