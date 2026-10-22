 "use client";
 import Image from "next/image";
 import ExploreOtherVehicles from "@/app/components/ExploreOtherVehicles";
 import { WP_ORIGIN } from "@/lib/apiBase";
 import { redirect } from "next/navigation";
 import FaqSection from "./FaqSection";
 import RelatedNews from "./RelatedNews";
 import BlogFeaturedListings from "./BlogFeaturedListings";
 import BlogContentProducts from "./BlogContentProducts";
 import { normalizePoolProduct } from "../listings/listingShared";
 import "./details.css";
 import { useEffect, useRef, useState } from "react";
 import { formatPostDate } from "@/utils/date";
 import { useBanners } from "@/components/BannerHandler";
 import { useBannerTracking } from "@/hooks/useBannerTracking";
 import { site, sitePaths } from "@/config/sites";
 
 // WP occasionally stores an image URL with a doubled protocol
 // (e.g. "https://https://...") from a bad admin copy-paste — that malformed
 // URL fails next/image's hostname check and crashes the whole page.
 const sanitizeImageUrl = (url: string): string =>
   url.replace(/^(https?:\/\/)+(?=https?:\/\/)/i, "");

 type BrowseLink = { text: string; href: string };
 type BrowseTab = {
   label: string;
   icon: string;
   viewAll: { text: string; href: string };
   links: BrowseLink[];
   states?: BrowseLink[];
   regions?: BrowseLink[];
 };
 
 const BROWSE_TABS: BrowseTab[] = [
   {
     label: "Location",
     icon: "bi-geo-alt",
     viewAll: { text: "View all locations", href: "/listings/" },
     links: [],
     states: [
       { text: `${site.plural} for Sale in Victoria`,          href: "/listings/victoria-state/" },
       { text: `${site.plural} for Sale in New South Wales`,   href: "/listings/new-south-wales-state/" },
       { text: `${site.plural} for Sale in Queensland`,        href: "/listings/queensland-state/" },
       { text: `${site.plural} for Sale in South Australia`,   href: "/listings/south-australia-state/" },
       { text: `${site.plural} for Sale in Western Australia`, href: "/listings/western-australia-state/" },
       { text: `${site.plural} for Sale in Tasmania`,          href: "/listings/tasmania-state/" },
       { text: `${site.plural} for Sale in ACT`,               href: "/listings/australian-capital-territory-state/" },
       { text: `${site.plural} for Sale in Northern Territory`,href: "/listings/northern-territory-state/" },
     ],
     regions: [
       { text: "Melbourne",     href: "/listings/victoria-state/melbourne-region/" },
       { text: "Sydney",        href: "/listings/new-south-wales-state/sydney-region/" },
       { text: "Brisbane",      href: "/listings/queensland-state/brisbane-region/" },
       { text: "Perth",         href: "/listings/western-australia-state/perth-region/" },
       { text: "Adelaide",      href: "/listings/south-australia-state/adelaide-region/" },
       { text: "Gold Coast",    href: "/listings/queensland-state/gold-coast-region/" },
       { text: "Cairns",        href: "/listings/queensland-state/cairns-region/" },
       { text: "Canberra",      href: "/listings/australian-capital-territory-state/australian-capital-territory-region/" },
       { text: "Darwin",        href: "/listings/northern-territory-state/darwin-region/" },
       { text: "Geelong",       href: "/listings/victoria-state/geelong-region/" },
       { text: "Hobart",        href: "/listings/tasmania-state/hobart-region/" },
       { text: "Newcastle",     href: "/listings/new-south-wales-state/newcastle-region/" },
       { text: "Sunshine Coast",href: "/listings/queensland-state/sunshine-coast-region/" },
       { text: "Townsville",    href: "/listings/queensland-state/townsville-region/" },
       { text: "Wollongong",    href: "/listings/new-south-wales-state/illawarra-region/" },
       { text: "Ballarat",      href: "/listings/victoria-state/ballarat-region/" },
     ],
   },
   {
     label: "Manufacturer",
     icon: "bi-buildings",
     viewAll: { text: "View all manufacturers", href: "/listings/" },
     links: [
       { text: `Jayco ${site.plural} for Sale`,       href: "/listings/jayco/" },
       { text: `Snowy River ${site.plural} for Sale`, href: "/listings/snowy-river/" },
       { text: `Evernew ${site.plural} for Sale`,     href: "/listings/evernew/" },
       { text: `Crusader ${site.plural} for Sale`,    href: "/listings/crusader/" },
       { text: `New Age ${site.plural} for Sale`,     href: "/listings/new-age/" },
       { text: `MDC ${site.plural} for Sale`,         href: "/listings/mdc/" },
       { text: `Essential ${site.plural} for Sale`,   href: "/listings/essential/" },
       { text: `Design RV ${site.plural} for Sale`,   href: "/listings/design-rv/" },
       { text: `JB ${site.plural} for Sale`,          href: "/listings/jb/" },
       { text: `Supreme ${site.plural} for Sale`,     href: "/listings/supreme/" },
       { text: `Avan ${site.plural} for Sale`,        href: "/listings/avan/" },
       { text: `Lotus ${site.plural} for Sale`,       href: "/listings/lotus/" },
       { text: `Royal Flair ${site.plural} for Sale`, href: "/listings/royal-flair/" },
       { text: `Windsor ${site.plural} for Sale`,     href: "/listings/windsor/" },
       { text: `Golf ${site.plural} for Sale`,        href: "/listings/golf/" },
       { text: `Nova ${site.plural} for Sale`,        href: "/listings/nova/" },
       { text: `Retreat ${site.plural} for Sale`,     href: "/listings/retreat/" },
       { text: `Adria ${site.plural} for Sale`,       href: "/listings/adria/" },
       { text: `Coromal ${site.plural} for Sale`,     href: "/listings/coromal/" },
     ],
   },
   {
     label: "Condition",
     icon: "bi-patch-check",
     viewAll: { text: `Browse all ${site.plural}`, href: "/listings/" },
     links: [
       { text: `New ${site.plural} for Sale`, href: "/listings/new-condition/" },
       { text: `Used ${site.plural} for Sale`, href: "/listings/used-condition/" },
     ],
   },
   {
     label: "Price",
     icon: "bi-currency-dollar",
     viewAll: { text: "View all price ranges", href: "/listings/" },
     links: [
       { text: "Under $30,000",       href: "/listings/under-30000/" },
       { text: "$30,000 – $40,000",   href: "/listings/between-30000-40000/" },
       { text: "$40,000 – $50,000",   href: "/listings/between-40000-50000/" },
       { text: "$50,000 – $70,000",   href: "/listings/between-50000-70000/" },
       { text: "$70,000 – $80,000",   href: "/listings/between-70000-80000/" },
       { text: "$80,000 – $100,000",  href: "/listings/between-80000-100000/" },
       { text: "Over $100,000",       href: "/listings/over-100000/" },
     ],
   },
 ];
 
 type CategoryFeaturedProduct = {
   id: number;
   name: string;
   slug: string;
   condition: string;
   location: string;
   state?: string;
   regular_price: string;
   sale_price: string;
   categories: string[];
   image_format: string[];
   seller_type?: string;
 };
 
 type ProductSection = {
   key: string;
   products: Record<string, unknown>[];
   link?: { text: string; url: string };
 };

 type BlogDetail = {
   id: number;
   slug: string;
   title: string;
   date: string;
   banner_image?: string;
   image?: string;
   toc?: string;
   content?: string;
   category_featured_products?: CategoryFeaturedProduct[];
   product_sections?: ProductSection[];
   faq?: { heading: string; content: string }[];
 };
 
 type FaqItem = {
   heading: string;
   content: string;
 };
 
 type RelatedBlog = {
   id: number;
   title: string;
   excerpt: string;
   link: string;
   image?: string;
   imageAlt?: string;
   slug?: string;
 };
 
 type BlogDetailResponse = {
   data?: {
     blog_detail?: BlogDetail;
     faq?: FaqItem[];
     related_blogs?: RelatedBlog[];
   };
   seo?: { metatitle?: string; metadescription?: string; index?: string };
 };
 export default function BlogDetailsPage({
   data,
 }: {
   data: BlogDetailResponse;
 }) {
   const [tocItems, setTocItems] = useState<Element[]>([]);
   const [showFullToc, setShowFullToc] = useState(false);
   const [browseTab, setBrowseTab] = useState(0);
   const [copyDone, setCopyDone] = useState(false);
 
   const handleShare = async () => {
     const url = window.location.href;
     if (navigator.share) {
       try {
         await navigator.share({ title: plainTitle, url });
       } catch {}
     } else {
       navigator.clipboard.writeText(url).then(() => {
         setCopyDone(true);
         setTimeout(() => setCopyDone(false), 2000);
       });
     }
   };
 
   // ✅ Run DOMParser only on client
   const post = data?.data?.blog_detail;
   // console.log("dataaa", post);

   // The blog content HTML embeds <div data-mpn-products="KEY"></div> markers
   // at specific positions — split the content string around them and render
   // a product grid (same ListingCard design as /listings/) in their place,
   // using the matching key's products from product_sections.
   const productSectionsByKey = new Map<string, Record<string, unknown>[]>(
     (post?.product_sections ?? []).map((section) => [section.key, section.products ?? []])
   );
   const productLinksByKey = new Map<string, { text: string; url: string }>(
     (post?.product_sections ?? [])
       .filter((section) => section.link?.url)
       .map((section) => [section.key, section.link as { text: string; url: string }])
   );
   const contentHtml = post?.content || "<p>No content available</p>";
   const contentParts: ({ type: "html"; html: string } | { type: "products"; key: string })[] = [];
   {
     const placeholderRe = /<div[^>]*data-mpn-products="([^"]+)"[^>]*>\s*<\/div>/g;
     let lastIndex = 0;
     let match: RegExpExecArray | null;
     while ((match = placeholderRe.exec(contentHtml)) !== null) {
       if (match.index > lastIndex) {
         contentParts.push({ type: "html", html: contentHtml.slice(lastIndex, match.index) });
       }
       contentParts.push({ type: "products", key: match[1] });
       lastIndex = placeholderRe.lastIndex;
     }
     if (lastIndex < contentHtml.length) {
       contentParts.push({ type: "html", html: contentHtml.slice(lastIndex) });
     }
   }
   useEffect(() => {
   if (post?.toc) {
     const parser = new DOMParser();
     const doc = parser.parseFromString(post.toc, "text/html");
 
     // ✅ Get the main ul element
     const mainUl = doc.querySelector("ul.ez-toc-list");
 
     if (mainUl) {
       // Get only direct children using childNodes filter
       const items = Array.from(mainUl.children).filter(
         (child) => child.tagName === "LI"
       );
       setTocItems(items as Element[]);
     }
   }
 }, [post?.toc]);
   // put this near the top of the file (outside the component)
   const decodeEntities = (s = "") =>
     s
       .replace(/&nbsp;/g, " ")
       .replace(/&amp;/g, "&")
       .replace(/&lt;/g, "<")
       .replace(/&gt;/g, ">")
       .replace(/&quot;/g, '"')
       .replace(/&#39;|&apos;/g, "'")
       .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
       .replace(/&#x([0-9a-fA-F]+);/g, (_, h) =>
         String.fromCharCode(parseInt(h, 16))
       );
 
   const stripHtml = (s?: string) =>
     (s ?? "")
       .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
       .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
       .replace(/<[^>]+>/g, "")
       .replace(/\s+/g, " ")
       .trim();
 
   const cleanTitle = (s?: string) => decodeEntities(stripHtml(s));
   const plainTitle = cleanTitle(data?.data?.blog_detail?.title);
 
   const blogContentRef = useRef<HTMLDivElement | null>(null);
 
   useEffect(() => {
     const container = blogContentRef.current;
     if (!container || !post?.content || !post?.id) return;
 
     const getSessionId = () => {
       let sid = sessionStorage.getItem("blr_session");
       if (!sid) {
         sid =
           "sess_" +
           Math.random().toString(36).slice(2) +
           Date.now().toString(36);
         sessionStorage.setItem("blr_session", sid);
       }
       return sid;
     };
 
     const getDeviceType = () => {
       const w = window.innerWidth;
       if (w < 768) return "mobile";
       if (w < 1024) return "tablet";
       return "desktop";
     };
 
      const trackBlogLink = async (
       linkId: string,
       eventType: "click" | "impression",
     ) => {
       return;
 
       try {
         await fetch(
           `${WP_ORIGIN}/wp-json/ads-manager/v1/blog-links/track`,
           {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
               link_id: parseInt(linkId),
               post_id: post?.id,
               event_type: eventType,
               session_id: getSessionId(),
               device_type: getDeviceType(),
               user_agent: navigator.userAgent,
             }),
           },
         );
       } catch (e) {}
     };
 
 
     // CLICK TRACKING
     const handleClick = (e: MouseEvent) => {
       const anchor = (e.target as HTMLElement).closest(
         ".blog-tracked-link",
       ) as HTMLAnchorElement | null;
       if (!anchor) return;
 
       const linkId = anchor.dataset.linkId;
       if (!linkId) return;
       trackBlogLink(linkId, "click");
     };
 
     container.addEventListener("click", handleClick);
 
     // VIEW TRACKING
     let observer: IntersectionObserver | null = null;
     let raf1: number;
     let raf2: number;
 
     raf1 = requestAnimationFrame(() => {
       raf2 = requestAnimationFrame(() => {
         const trackedLinks =
           container.querySelectorAll<HTMLAnchorElement>(".blog-tracked-link");
 
         if (!trackedLinks.length) return;
 
         observer = new IntersectionObserver(
           (entries) => {
             entries.forEach((entry) => {
               if (!entry.isIntersecting) return;
 
               const anchor = entry.target as HTMLAnchorElement;
               const linkId = anchor.dataset.linkId;
               if (!linkId) return;
 
               trackBlogLink(linkId, "impression");
               observer?.unobserve(anchor);
             });
           },
           { threshold: 0.5 },
         );
 
         trackedLinks.forEach((link) => observer!.observe(link));
       });
     });
 
     // CLEANUP
     return () => {
       container.removeEventListener("click", handleClick);
       cancelAnimationFrame(raf1);
       cancelAnimationFrame(raf2);
       observer?.disconnect();
     };
   }, [post?.content, post?.id]);
 
   const { matchedBanners, isMobile } = useBanners();
   const { bannerRefs, trackClick } = useBannerTracking(matchedBanners);
   const rightBanners = matchedBanners.filter((b) => b.position === "right");
 
   const readingTime = post?.content
     ? `${Math.max(1, Math.round(stripHtml(post.content).split(/\s+/).length / 200))} min read`
     : null;
 
   if (!post) {
     redirect("/404");
   }
 
   return (
     <div className="blog-page style-5 color-4">
       {/* ── Hero ── */}
       <section className="blog-hero">
         {/* Left: title + meta */}
         <div className="blog-hero__left">
           <div className="blog-hero__left-inner">
             <h1 className="blog-hero__title">{plainTitle}</h1>
             <div className="blog-hero__meta">
               <span><i className="bi bi-calendar3" />{formatPostDate(post.date)}</span>
               {readingTime && <span><i className="bi bi-clock" />{readingTime}</span>}
               <button onClick={handleShare} className="blog-share-btn">
                 <i className={`bi ${copyDone ? "bi-check-lg" : "bi-share"}`} />
                 {copyDone ? "Copied!" : "Share"}
               </button>
             </div>
           </div>
         </div>
         {/* Right: banner image */}
         <div className="blog-hero__right">
           {(post.banner_image || post.image) ? (
             <Image
               src={sanitizeImageUrl(post.banner_image || post.image!)}
               alt={plainTitle}
               width={0}
               height={0}
               sizes="100vw"
               unoptimized
               className="blog-hero__img"
               priority
             />
           ) : (
             <div className="blog-hero__no-image" />
           )}
         </div>
       </section>
 
       {/* ── Mobile TOC (shown only on mobile, hidden on desktop) ── */}
       {post?.toc && tocItems.length > 0 && (
         <div className="blog-mobile-toc">
           <div className="blog-browse-toc">
             <h3 className="blog-browse-toc__heading">Table of Contents</h3>
             <ul className="blog-browse-toc__list">
               {(showFullToc ? tocItems : tocItems.slice(0, 5)).map((item, index) => {
                 const anchor = item.querySelector("a");
                 if (!anchor) return null;
                 return (
                   <li key={index}>
                     <a href={anchor.getAttribute("href") ?? "#"}>
                       {anchor.textContent ?? ""}
                     </a>
                   </li>
                 );
               })}
             </ul>
             {tocItems.length > 5 && (
               <button
                 className="blog-browse-toc__more"
                 onClick={() => setShowFullToc((prev) => !prev)}
               >
                 {showFullToc ? <>Show Less <i className="bi bi-chevron-up" /></> : <>Show More <i className="bi bi-chevron-down" /></>}
               </button>
             )}
           </div>
         </div>
       )}
 
       {/* ── Quick Browse Widget (hidden) ── */}
       {false && <section className="blog-browse-section">
         <div className="container">
           <div className="blog-browse-layout">
 
 
             {/* Right: CTA + tabs + links */}
             <div className="blog-browse-main">
               <div className="blog-browse-cta">
                 <div className="blog-browse-cta__text">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src="/images/category.svg" alt="" width={32} height={32} className="blog-browse-cta__icon-img" />
                   <div>
                     <h3 className="blog-browse-cta__heading">
                       {`Ready to Browse ${site.plural}?`}
                     </h3>
                     <p className="blog-browse-cta__desc">
                       {`Explore thousands of ${site.nounPlural} for sale across Australia.`}
                     </p>
                   </div>
                 </div>
                 <a href="/listings/" className="blog-browse-cta__btn">
                   {`Browse ${site.plural}`} <i className="bi bi-arrow-right" />
                 </a>
               </div>
 
               <div className="blog-browse-tabs">
                 {BROWSE_TABS.map((tab, i) => (
                   <button
                     key={tab.label}
                     className={`blog-browse-tab${browseTab === i ? " active" : ""}`}
                     onClick={() => setBrowseTab(i)}
                   >
                     <i className={`bi ${tab.icon}`} />
                     {tab.label}
                   </button>
                 ))}
               </div>
 
               <div className="blog-browse-links">
                 {BROWSE_TABS[browseTab].states ? (
                   <>
                     <p className="blog-browse-sublabel">By State</p>
                     <div className="blog-browse-links__inner">
                       {BROWSE_TABS[browseTab].states!.map((link) => (
                         <a key={link.href} href={link.href} className="blog-browse-link">{link.text}</a>
                       ))}
                     </div>
                     <p className="blog-browse-sublabel">By Region</p>
                     <div className="blog-browse-links__pills">
                       {BROWSE_TABS[browseTab].regions!.map((link) => (
                         <a key={link.href} href={link.href} className="blog-browse-link blog-browse-link--pill">{link.text}</a>
                       ))}
                     </div>
                   </>
                 ) : (
                   BROWSE_TABS[browseTab].links.map((link) => (
                     <a key={link.href} href={link.href} className="blog-browse-link">{link.text}</a>
                   ))
                 )}
               </div>
 
 
             </div>
 
           </div>
         </div>
       </section>}
 
       {/* ── Article body ── */}
       <section className="blog-article-section">
         <div className="container">
           <div className="blog-article-layout">
             {/* Main content */}
             <div className="blog-article-main single_blog">
               <div
                 ref={blogContentRef}
                 className="all-news toc_hide_details"
               >
                 {contentParts.map((part, i) =>
                   part.type === "html"
                     ? <div key={i} dangerouslySetInnerHTML={{ __html: part.html }} />
                     : (
                       <BlogContentProducts
                         key={i}
                         products={(productSectionsByKey.get(part.key) ?? []).map(normalizePoolProduct)}
                         link={productLinksByKey.get(part.key)}
                       />
                     )
                 )}
               </div>
               <div className="blog-content-share">
                 <span className="blog-content-share__label">Share this article</span>
                 <button onClick={handleShare} className="blog-content-share__btn">
                   <i className={`bi ${copyDone ? "bi-check-lg" : "bi-share"}`} />
                   {copyDone ? "Copied!" : "Share"}
                 </button>
               </div>
             </div>
 
             {/* Sidebar: TOC + CTA cards */}
             <aside className="blog-article-sidebar">
               {post?.toc && tocItems.length > 0 && (
                 <div className="blog-browse-toc blog-sidebar-toc">
                   <h3 className="blog-browse-toc__heading">Table of Contents</h3>
                   <ul className="blog-browse-toc__list">
                     {(showFullToc ? tocItems : tocItems.slice(0, 5)).map((item, index) => {
                       const anchor = item.querySelector("a");
                       if (!anchor) return null;
                       return (
                         <li key={index}>
                           <a href={anchor.getAttribute("href") ?? "#"}>
                             {anchor.textContent ?? ""}
                           </a>
                         </li>
                       );
                     })}
                   </ul>
                   {tocItems.length > 5 && (
                     <button
                       className="blog-browse-toc__more"
                       onClick={() => setShowFullToc((prev) => !prev)}
                     >
                       {showFullToc ? <>Show Less <i className="bi bi-chevron-up" /></> : <>Show More <i className="bi bi-chevron-down" /></>}
                     </button>
                   )}
                 </div>
               )}
               <div className="blog-sidebar-sticky">
                 <div className="blog-sidebar-cta">
                   <h3 className="blog-sidebar-cta__heading">Ready to Find Your Next {site.singular}?</h3>
                   <p className="blog-sidebar-cta__desc">Browse thousands of new and used {site.nounPlural} from trusted dealers and private sellers across Australia.</p>
                   <a href="/listings/" className="blog-sidebar-cta__btn">
                     Search {site.plural} Now <i className="bi bi-arrow-right" />
                   </a>
                 </div>
                 <div className="blog-sidebar-cta blog-sidebar-cta--sell">
                   <h3 className="blog-sidebar-cta__heading">Sell Your {site.singular} Faster with Australia's Growing {site.singular} Marketplace</h3>
                   <a href={sitePaths.sell} className="blog-sidebar-cta__btn">
                     List Your {site.singular} Now <i className="bi bi-arrow-right" />
                   </a>
                 </div>
               </div>
             </aside>
           </div>
         </div>
       </section>
 
       <FaqSection data={data?.data?.blog_detail?.faq ?? []} />
 
       <BlogFeaturedListings products={(data?.data?.blog_detail?.category_featured_products ?? []).map(normalizePoolProduct)} />
       <RelatedNews blogs={data?.data?.related_blogs ?? []} />

       {/* ── Buy or Sell CTA ── */}
       <section className="bds-cta-section">
         <div className="bds-cta-card">
           <h2 className="bds-cta-title">Ready to Buy or Sell {site.article} {site.singular}?</h2>
           <p className="bds-cta-body">
             <strong>Looking to buy?</strong> Browse{" "}
             <a href="/" className="bds-cta-link">{site.nounPlural} for sale</a>{" "}
             from dealers and private sellers across Australia, with listings available by make, model, price, location and {site.noun} type.
           </p>
           <p className="bds-cta-body">
             <strong>Looking to sell?</strong> If you&apos;re upgrading to a newer {site.noun} or no longer need your current one,{" "}
             <a href={sitePaths.sell} className="bds-cta-link">sell your {site.noun}</a>{" "}
             by creating a listing on {site.brand}. Your advertisement stays online until it&apos;s sold for a one-time fee of $49.
           </p>
         </div>
       </section>

       {/* ── Explore Other Vehicle Options (related car sites) ── */}
       <section className="bds-explore-section">
         <div className="container">
           <div className="bds-explore-card">
             <ExploreOtherVehicles classes={{ title: "bds-explore-title", body: "bds-explore-body", link: "bds-explore-link" }} />
           </div>
         </div>
       </section>
     </div>
   );
 }