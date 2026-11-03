import { site } from "@/config/sites";
import { cache } from "react";
import { fetchProductDetail } from "@/utils/fetchProductDetail";

export interface ProductMeta {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
}

export const fetchProductMeta = cache(async (slug: string): Promise<ProductMeta> => {
  const empty: ProductMeta = { title: "", description: "", canonical: "", ogImage: "" };
  try {
    // Same React-cached call the product page makes — no extra network request.
    // (The old /product-detail-new/ endpoint now returns 500.)
    const data: any = await fetchProductDetail(slug);
    if (!data) return empty;
    const seo = data?.seo ?? data?.product?.seo ?? {};
    const pd = data?.data?.product_details ?? {};
    const title = seo.metatitle || seo.meta_title || pd.name || data?.name || "";
    const description = seo.metadescription || seo.meta_description || pd.short_description || "";
    const canonical = `${site.url}/product/${slug}/`;
    const imageUrlRaw = pd.image_url;
    const ogImage: string = Array.isArray(imageUrlRaw)
      ? imageUrlRaw.filter(Boolean)[0] ?? ""
      : typeof imageUrlRaw === "string"
      ? imageUrlRaw
      : "";
    return { title, description, canonical, ogImage };
  } catch {
    return empty;
  }
});
