  "use client";
 import "@fortawesome/fontawesome-free/css/fontawesome.min.css";
 import { siteRange } from "@/config/siteRange";
 import "@fortawesome/fontawesome-free/css/solid.min.css";
 import "@fortawesome/fontawesome-free/css/regular.min.css";
 import React, { useState } from "react";
 import { getRegionBySlug } from "../sell-my-caravan-region/regions-data";
import { site, sitePaths } from "@/config/sites";

 const STATE_LINKS = [
   { label: "Victoria",              img: "/images/vic_map.svg", href: `${sitePaths.sell}victoria/` },
   { label: "New South Wales",       img: "/images/nsw_map.svg", href: `${sitePaths.sell}new-south-wales/` },
   { label: "Queensland",            img: "/images/qld_map.svg", href: `${sitePaths.sell}queensland/` },
   { label: "Western Australia",     img: "/images/wa_map.svg",  href: `${sitePaths.sell}western-australia/` },
   { label: "South Australia",       img: "/images/sa_map.svg",  href: `${sitePaths.sell}south-australia/` },
   { label: "Tasmania",              img: "/images/tas_map.svg", href: `${sitePaths.sell}tasmania/` },
 ];

 const CITY_SLUGS = [
   { label: " Melbourne", regionSlug: "melbourne-region" },
   { label: " Sydney", regionSlug: "sydney-region" },
   { label: " Brisbane", regionSlug: "brisbane-region" },
   { label: " Perth", regionSlug: "perth-region" },
   { label: " Adelaide", regionSlug: "adelaide-region" },
   { label: " Gold Coast", regionSlug: "gold-coast-region" },
   { label: " Sunshine Coast", regionSlug: "sunshine-coast-region" },
   { label: " Newcastle", regionSlug: "newcastle-region" },
   { label: " Canberra", regionSlug: "canberra-region" },
   { label: " Hobart", regionSlug: "hobart-region" },
 ];

 const CITY_LINKS = CITY_SLUGS.map(({ label, regionSlug }) => {
   const region = getRegionBySlug(regionSlug);
   return {
     label,
     href: region ? `${sitePaths.sell}${region.state.slug}/${region.pageSlug}/` : sitePaths.sell,
   };
 });
 
 
 const HOW_TO_STEPS = [
   { num: 1, iconSet: "fa-regular", icon: "fa-file-lines",    title: "Create Your Listing",    desc: `Add your ${site.noun} details, specifications, price and contact information.` },
   { num: 2, iconSet: "fa-regular", icon: "fa-image",         title: "Upload Photos",          desc: `Add clear photos of the inside, outside and key features of your ${site.noun}.` },
   { num: 3, iconSet: "fa-regular", icon: "fa-comment-dots",  title: "Receive Buyer Enquiries", desc: "Interested buyers contact you directly through your listing." },
   { num: 4, iconSet: "fa-regular", icon: "fa-handshake",     title: "Negotiate Directly",     desc: "Arrange inspections, answer questions and negotiate with buyers." },
   { num: 5, iconSet: "fa-regular", icon: "fa-circle-check",  title: "Complete The Sale",      desc: "Once sold, mark your listing as sold or remove it from the site." },
 ];
 
 
 const MAIN_FAQS = [
   {
     q: `How do I sell my ${site.noun} online in Australia?`,
     a: <p>You can sell your {site.noun} online by creating a private seller listing on {site.brand}. Add your {site.noun} details, upload clear photos, set your asking price and publish your ad so buyers across Australia can contact you directly.</p>,
   },
   {
     q: `How much does it cost to list my ${site.noun}?`,
     a: <p>It costs $49 inc. GST to list your {site.noun} on {site.brand}. This is a one-time listing fee with no monthly subscription, no hidden charges and no commission when your {site.noun} sells.</p>,
   },
   {
     q: `How long does my ${site.noun} listing stay live?`,
     a: <p>Your {site.noun} listing stays live until sold. You do not need to keep paying monthly fees to keep your ad active. Once your {site.noun} is sold, you can remove the listing from the website.</p>,
   },
   {
     q: `Can I edit my ${site.noun} listing after publishing?`,
     a: <p>Yes. After your listing is published, you can update your {site.noun} details, change the asking price, add or replace photos and improve your description if needed.</p>,
   },
   {
     q: "How do buyers contact me?",
     a: <p>Interested buyers can contact you directly through your {site.noun} listing. This allows you to answer questions, arrange inspections, negotiate the price and manage the sale privately.</p>,
   },
   {
     q: `What photos should I upload when selling my ${site.noun}?`,
     a: <p>Upload clear photos of the outside, inside, seats, dashboard, odometer, boot, tyres and any included accessories. Good photos help buyers understand the condition of your {site.noun} and can increase enquiries.</p>,
   },
   {
     q: `How should I price my ${site.noun}?`,
     a: <p>Check similar {site.nounPlural} for sale before setting your price. Compare by make, model, year, kilometres, condition, features and location. A realistic asking price can help attract more genuine buyers.</p>,
   },
   {
     q: `Is it safe to sell my ${site.noun} privately online?`,
     a: <p>Yes, but you should take normal precautions. Speak with buyers directly, meet in a safe location, confirm payment has cleared before handover and complete any required transfer paperwork for your state or territory.</p>,
   },
   {
     q: `Do I pay commission when my ${site.noun} sells?`,
     a: <p>No. {site.brand} does not charge commission when your {site.noun} sells. You pay the one-time listing fee and keep 100% of the agreed sale price.</p>,
   },
   {
     q: `Can I remove my listing after my ${site.noun} is sold?`,
     a: <p>Yes. Once your {site.noun} has sold, you can remove your listing so buyers know it is no longer available.</p>,
   },
 ];
 
 export default function SellerDemo() {
   const [activeFaq, setActiveFaq] = useState<number | null>(null);
 
   return (
     <div className="page_wrapper demo-page">
 
       {/* ── Hero ── */}
       <section className="demo-hero">
         <div className="container">
           <h1 className="demo-hero__title">
             Sell My {site.singular} Online in Australia
           </h1>
           <p className="demo-hero__subtitle">
             List your {site.noun} for $49 until sold — no commissions, no subscriptions and direct buyer contact.
           </p>
           
 
           {/* Pricing card + CTA wrapper — one seamless unit */}
           <div className="demo-price-wrapper">
           <div className="demo-price-card">
             
             {/* Left: Australia info */}
             <div className="demo-price-card__left">
               <div className="demo-price-card__aus-circle">
                 <img src="/images/australia.png" alt="Australia" />
               </div>
               <div className="demo-price-card__header">
               <h3>Looking to sell your {site.noun}?</h3>
             </div>
               <p className="demo-price-card__desc">
                 {site.brand} helps private sellers advertise directly to genuine {site.noun} buyers for a one-time $49 listing fee, with no commissions, no subscriptions and your ad live until sold.
               </p>
               
             </div>
 
             {/* Center: Price highlight */}
             <div className="demo-price-card__center">
               <div className="demo-price-card__badge">BEST VALUE</div>
               <div className="demo-price-card__price-box">
                 <div className="demo-price-card__only">ONLY</div>
                 <div className="demo-price-card__amount"><sup>$</sup>49</div>
                 <hr className="demo-price-card__hr" />
                 <div className="demo-price-card__fee">One-Time Listing Fee (Inc. GST)</div>
               </div>
             </div>
 
             {/* Right: Features */}
             <div className="demo-price-card__right">
               {[
                 { icon: "fa-calendar-days", label: "No Subscriptions" },
                 { icon: "fa-percent", label: "No Commissions" },
                 { icon: "fa-circle-dollar-to-slot", label: "No Ongoing Fees" },
                 { icon: "fa-bullhorn", label: "Ad Live Until Sold" },
               ].map((item, i) => (
                 <div key={item.label} className={`demo-price-card__feature${i < 3 ? " demo-price-card__feature--border" : ""}`}>
                   <span className="demo-price-card__feature-icon">
                     <i className={`fa-solid ${item.icon}`} />
                   </span>
                   <span className="demo-price-card__feature-label">{item.label}</span>
                 </div>
               ))}
             </div>
           </div>
 
           {/* CTA — inside wrapper so it attaches seamlessly to card bottom */}
           <a href="https://seller.marketplacenetwork.com.au/caravan-seller-subscription/" className="demo-hero__cta">
             List Your {site.singular} Now <i className="fa-solid fa-arrow-right" />
           </a>
           </div>{/* end demo-price-wrapper */}
 
           
         </div>
       </section>
 
       {/* ── Feature cards ── */}
       <section className="demo-features-section">
         <div className="container">
           <div className="demo-features-grid">
             {[
               { img: "/images/chat2.png", title: "Direct Buyer Contact", desc: "Connect directly with genuine buyers. No middleman." },
               { img: "/images/calendar.png", title: "Live Until Sold", desc: `Your listing stays online and visible until your ${site.noun} is sold.` },
               { img: site.vehicleIcon, title: `${site.singular}-Only Marketplace`, desc: `Reach a targeted audience actively looking to buy ${site.nounPlural}.` },
               { img: "/images/dollar.png", title: "Keep 100% of Your Sale", desc: "Pay only $49 Inc GST per listing. No commissions or hidden costs." },
             ].map((item, i) => (
               <div className="demo-feature-card" key={i}>
                 <div className="demo-feature-card__icon">
                   <img src={item.img} alt={item.title} />
                 </div>
                 <h4 className="demo-feature-card__title">{item.title}</h4>
                 <p className="demo-feature-card__desc">{item.desc}</p>
               </div>
             ))}
           </div>
         </div>
       </section>
 
       {/* ── Reach section ── */}
       <section className="demo-reach-section">
         <div className="container">
 
           {/* Heading */}
           <div className="demo-reach-heading">
             <h3>Reach {site.singular} Buyers Across Australia, Including: </h3>
             {/* <p>Your listing is seen by thousands of active buyers Australia-wide.</p> */}
           </div>
 
   {/* ── City links ── */}
       <section className="demo-city-section">
         <div className="container">
          
 
           {/* State cards */}
           <div className="demo-state-grid">
             {STATE_LINKS.map((s) => (
               <a
                 key={s.label}
                 href={s.href}
                 title={`Sell my ${site.noun} in ${s.label}`}
                 className="demo-state-item"
               >
                 <div className="demo-state-item__img">
                   <img src={s.img} alt={s.label} />
                 </div>
                 <h3 className="demo-state-item__label">{s.label}</h3>
               </a>
             ))}
           </div>
 
           {/* City cards */}
           <div className="demo-city-grid">
             {CITY_LINKS.map((c) => (
               <div key={c.label} className="demo-city-item">
                 <span className="demo-city-icon">
                   <img src={site.vehicleIcon} alt="" />
                 </span>
                       <h3 className="demo-city-label">

                 <a
                   href={c.href}
                   title={`Sell my ${site.noun} in ${c.label.trim()}`}
                   className="demo-city-label"
                 >
                   {c.label}
                 </a>
                 </h3>
                 <i className="fa-solid fa-chevron-right demo-city-arrow" />
               </div>
             ))}
           </div>
         </div>
       </section>
 
           <div className="demo-reach-row">
           {/* Device image */}
           <div className="demo-reach-device">
             <img src="/images/sell-mockup-desktop.jpg" className="img-fluid d-none d-lg-block" alt={`${site.singular} For Sale Desktop`} />
             <img src="/images/sell-mockup-mobile.jpg" className="img-fluid d-block d-lg-none" alt={`${site.singular} For Sale Mobile`} />
           </div>
 
           {/* Pricing + FAQ card */}
           <div className="demo-reach-card">
             {/* Left: Pricing */}
             <div className="demo-reach-card__left">
               <span className="demo-reach-card__badge">BEST VALUE</span>
               <div className="demo-reach-card__price">
                 <span className="demo-reach-card__dollar">$</span>
                 <span className="demo-reach-card__amount">49</span>
                 <span className="demo-reach-card__gst">(Inc. GST)</span>
               </div>
               <p className="demo-reach-card__fee-label">One-Time Listing Fee</p>
               <ul className="demo-reach-card__list">
                 {[
                   `1 ${site.noun} listed until sold`,
                   "Edit your listing anytime",
                   "No expiration or monthly fees",
                 ].map((item) => (
                   <li key={item}>
                     <i className="fa-solid fa-circle-check" />
                     {item}
                   </li>
                 ))}
               </ul>
               <a href="https://seller.marketplacenetwork.com.au/caravan-seller-subscription/" className="demo-reach-card__cta">
                 List My {site.singular} Now <i className="fa-solid fa-arrow-right" />
               </a>
             </div>
 
             {/* Divider */}
             <div className="demo-reach-card__divider" />
 
             {/* Right: FAQ items */}
             <div className="demo-reach-card__right">
               <div className="demo-reach-faq">
                 
                 <div className="demo-reach-faq__body">
                   <h4>How long does the listing stay up?</h4>
                   <ul>
                     <li><i className="fa-solid fa-circle-check" />Your ad stays live until it sells.</li>
                     <li><i className="fa-solid fa-circle-check" />You can update details, photos, and price anytime.</li>
                     <li><i className="fa-solid fa-circle-check" />Mark as sold or remove anytime.</li>
                   </ul>
                 </div>
               </div>
               <div className="demo-reach-faq demo-reach-faq--border">
                 
                 <div className="demo-reach-faq__body">
                   <h4>Can I edit my listing after posting?</h4>
                   <ul>
                     <li><i className="fa-solid fa-circle-check" />Yes, updates are allowed anytime.</li>
                     
                   </ul>
                 </div>
               </div>
             </div>
           </div>
           </div>{/* end demo-reach-row */}
 
         </div>
       </section>
 
       {/* ── Compact Seller Guide ── */}
       <section className="demo-guide-section">
         <div className="container">
           <h2 className="demo-guide-title">Compact Seller Guide</h2>
           <div className="demo-guide-underline" />
           <div className="demo-guide-grid">
 
             <div className="demo-guide-card">
               <div className="demo-guide-card__header">
                 <span className="demo-guide-card__num">1</span>
                 <h3>Why sell on {site.brand}?</h3>
               </div>
               <ul className="demo-guide-card__list">
                 <li>{site.singular}-only marketplace, not a general classifieds page.</li>
                 <li>Buyers search by make, model, price, year and location.</li>
                 <li>Your {site.noun} is shown to people already looking to buy.</li>
                 <li>Direct enquiries, no commission on the final sale.</li>
               </ul>
             </div>
 
             <div className="demo-guide-card">
               <div className="demo-guide-card__header">
                 <span className="demo-guide-card__num">2</span>
                 <h3>What you need before listing</h3>
               </div>
               <ul className="demo-guide-card__list">
                 <li>Photos: exterior, interior, dashboard, odometer, tyres and boot.</li>
                 <li>Details: make, model, year, variant, kilometres, transmission and fuel type.</li>
                 <li>Condition, rego, service history, upgrades and asking price.</li>
               </ul>
             </div>
 
             <div className="demo-guide-card">
               <div className="demo-guide-card__header">
                 <span className="demo-guide-card__num">3</span>
                 <h3>How to price your {site.noun}</h3>
               </div>
               <ul className="demo-guide-card__list">
                 <li>Check similar {site.nounPlural} before setting your asking price.</li>
                 <li>Compare make, model, year, kilometres, condition and location.</li>
                 <li>Leave room for negotiation while staying competitive.</li>
               </ul>
             </div>
 
             <div className="demo-guide-card">
               <div className="demo-guide-card__header">
                 <span className="demo-guide-card__num">4</span>
                 <h3>Private sale vs other options</h3>
               </div>
               <ul className="demo-guide-card__list">
                 <li>Private sale: more control and keep the sale price.</li>
                 <li>Trade-in: faster and easier, but often lower value.</li>
                 <li>Consignment: dealer handles the sale, fees may apply.</li>
               </ul>
             </div>
 
           </div>
         </div>
       </section>
 
       {/* ── Main FAQ accordion ── */}
       <section className="demo-faq-section">
         <div className="container">
           <div className="demo-faq-head">
             <span className="demo-faq-head__tag">FAQ</span>
             <h2>Frequently Asked Questions</h2>
             <p>Everything you need to know about selling your {site.noun} on {site.brand}</p>
           </div>
           <div className="demo-faq-list">
             {MAIN_FAQS.map((faq, i) => (
               <div
                 key={i}
                 className={`demo-faq-item${activeFaq === i ? " demo-faq-item--open" : ""}`}
               >
                 <button
                   className="demo-faq-item__q"
                   onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                 >
        <h3 className="demo-faq-item__q-text">{faq.q}</h3>
                   <span className="demo-faq-item__icon">
                     <i className={`fa-solid ${activeFaq === i ? "fa-minus" : "fa-plus"}`} />
                   </span>
                 </button>
                 {activeFaq === i && (
                   <div className="demo-faq-item__a">{faq.a}</div>
                 )}
               </div>
             ))}
           </div>
         </div>
       </section>
 
     
 
 
       {/* ── Why buyers section ── */}
       <section className="demo-why-section">
         <div className="container">
           <div className="row align-items-center g-4">
             <div className="col-md-6">
               <img src="/images/sell-mockup-desktop.jpg" className="img-fluid demo-why-img" alt={`${site.singular} buyers`} />
             </div>
             <div className="col-md-6">
               <h2>Why Thousands of {site.singular} Buyers Visit our website Every Month</h2>
               <p>
                 {site.brand} is Australia's dedicated {site.noun} marketplace, built exclusively
                 for {site.noun} buyers and sellers. We attract thousands of genuine buyers every day who
                 are actively searching for {siteRange}.
               </p>
               <div className="demo-check-grid demo-check-grid--2col mt-3">
                 {[
                   "Australia-wide exposure", "Live until sold for one low price",
                   `${site.singular}-only marketplace`, "Update listing anytime",
                   "Direct buyer enquiries", "No dealer involvement",
                   "No commissions or hidden fees", "Simple, fast and effective",
                 ].map((t) => (
                   <span key={t} className="demo-check-item">
                     <i className="fa-solid fa-circle-check"></i> {t}
                   </span>
                 ))}
               </div>
             </div>
           </div>
         </div>
       </section>
 
       {/* ── How to sell ── */}
       <section className="demo-steps-section">
         <div className="container">
           
           <h2 className="demo-steps-title">How To Sell Your {site.singular} Online</h2>
           <p className="demo-steps-subtitle">List your {site.noun} in minutes and connect with serious buyers Australia-wide.</p>
 
           {/* Steps: each column has number circle + icon + content; connectors between columns */}
           <div className="demo-steps-wrapper">
             {HOW_TO_STEPS.map((s, i) => (
               <React.Fragment key={s.num}>
                 <div className="demo-steps-item">
                   <div className="demo-step-num">{s.num}</div>
                   <div className="demo-step-icon-circle">
                     <i className={`${s.iconSet} ${s.icon}`} />
                   </div>
                   <h4 className="demo-step-title">{s.title}</h4>
                   <p className="demo-step-desc">{s.desc}</p>
                 </div>
                 {i < HOW_TO_STEPS.length - 1 && (
                   <div className="demo-steps-connector" />
                 )}
               </React.Fragment>
             ))}
           </div>
 
           
         </div>
       </section>
 
       
 
       {/* ── Bottom CTA strip ── */}
       <section className="demo-cta-strip">
         <div className="container text-center">
           <p>
             Start selling your {site.noun} today for just{" "}
             <strong>$49 (Inc. GST)</strong> — Live until sold!
           </p>
           <a href="https://seller.marketplacenetwork.com.au/caravan-seller-subscription/" className="btn white_btn">
             List Your {site.singular} Now
           </a>
         </div>
       </section>

     </div>
   );
 }
 