"use client";
import "@fortawesome/fontawesome-free/css/fontawesome.min.css";
import "@fortawesome/fontawesome-free/css/solid.min.css";
import "@fortawesome/fontawesome-free/css/regular.min.css";
import React, { useState } from "react";
import { StateData } from "../sell-my-caravan-region/states-data";
import { getRegionsByState } from "../sell-my-caravan-region/regions-data";

const CARAVAN_TYPES = [
  { label: "Off Road SUVs", img: "/images/off-road.webp", href: "/listings/off-road-category/" },
  { label: "Family SUVs", img: "/images/family.webp", href: "/listings/family-caravans-category/" },
  { label: "Pop Top SUVs", img: "/images/pop-top.webp", href: "/listings/pop-top-category/" },
  { label: "Hybrid SUVs", img: "/images/hybrid.webp", href: "/listings/hybrid-caravans-category/" },
  { label: "Luxury SUVs", img: "/images/luxury.webp", href: "/listings/luxury-caravans-category/" },
  { label: "Couples SUVs", img: "/images/touring.webp", href: "/listings/couples-caravans-category/" },
  { label: "Touring SUVs", img: "/images/touring.webp", href: "/listings/touring-caravans-category/" },
  { label: "Bunk SUVs", img: "/images/family.webp", href: "/listings/bunk-caravans-category/" },
  { label: "Small SUVs", img: "/images/pop-top.webp", href: "/listings/small-caravans-category/" },
  { label: "Used SUVs", img: "/images/off-road.webp", href: "/listings/used-condition/" },
];

interface StateSellerProps {
  state: StateData;
}

const DEMONYMS: Record<string, string> = {
  victoria: "Victorian",
  "new-south-wales": "New South Wales",
  queensland: "Queensland",
  "south-australia": "South Australian",
  tasmania: "Tasmanian",
  "western-australia": "Western Australian",
};

export default function StateSeller({ state }: StateSellerProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stateLabel = state.label;
  const capital = state.capital;
  const abbr = state.abbr;
  const demonym = DEMONYMS[state.slug] ?? stateLabel;

  const CITY_LINKS = getRegionsByState(state.slug);

  const HOW_TO_STEPS = [
    { num: 1, iconSet: "fa-regular", icon: "fa-file-lines", title: "Create Your Listing", desc: "Add your SUV details, description, price and location in minutes." },
    { num: 2, iconSet: "fa-regular", icon: "fa-image", title: "Upload Photos", desc: "Add clear photos of the inside, outside and features of your SUV." },
    { num: 3, iconSet: "fa-regular", icon: "fa-comment-dots", title: "Reach Buyers", desc: `Your listing is live across ${stateLabel}. Buyers contact you directly.` },
    { num: 4, iconSet: "fa-regular", icon: "fa-handshake", title: "Negotiate Directly", desc: "Arrange inspections and negotiate price with buyers." },
    { num: 5, iconSet: "fa-regular", icon: "fa-circle-check", title: "Complete The Sale", desc: "Once sold, remove your listing or mark as sold. It's that simple." },
  ];

  const MAIN_FAQS = [
    {
      q: `How do I sell my SUV in ${stateLabel}?`,
      a: <p>You can sell your SUV online by creating a private seller listing on SuvForSale.com.au. Simply add your SUV details, upload clear photos, set your asking price, and publish your ad so active buyers across {stateLabel} and all of Australia can contact you directly.</p>,
    },
    {
      q: `How much does it cost to sell my SUV in ${stateLabel}?`,
      a: <p>We charge a simple, flat one-time fee of just $49 (inc. GST). There are absolutely no commissions, no hidden upfront fees, and no recurring monthly subscriptions. You keep 100% of your sale price.</p>,
    },
    {
      q: "How long does my SUV listing stay live?",
      a: <p>Your SUV listing stays live until sold. You do not need to keep paying monthly fees to keep your ad active. Once your SUV is sold, you can remove the listing from the website.</p>,
    },
    {
      q: "Can I edit my SUV listing after publishing?",
      a: <p>Yes. After your listing is published, you can update your SUV details, change the asking price, add or replace photos and improve your description if needed.</p>,
    },
    {
      q: "How do buyers contact me?",
      a: <p>Interested buyers can contact you directly through your SUV listing. This allows you to answer questions, arrange inspections, negotiate the price and manage the sale privately.</p>,
    },
    {
      q: "What photos should I upload when selling my SUV?",
      a: <p>Upload clear photos of the outside, inside, kitchen, beds, seating area, bathroom, tyres, drawbar and any included accessories. Good photos help buyers understand the condition of your SUV and can increase enquiries.</p>,
    },
    {
      q: "How should I price my SUV?",
      a: <p>Check similar SUVs for sale in {stateLabel} before setting your price. Compare by make, model, year, condition, length, ATM, tare weight, sleeping capacity, features and location. A realistic asking price can help attract more genuine buyers.</p>,
    },
    {
      q: "Is it safe to sell my SUV privately online?",
      a: <p>Yes, but you should take normal precautions. Speak with buyers directly, meet in a safe location, confirm payment has cleared before handover and complete any required transfer paperwork for {stateLabel}.</p>,
    },
    {
      q: "Do I pay commission when my SUV sells?",
      a: <p>No. SuvForSale.com.au does not charge commission when your SUV sells. You pay the one-time listing fee and keep 100% of the agreed sale price.</p>,
    },
    {
      q: "Can I remove my listing after my SUV is sold?",
      a: <p>Yes. Once your SUV has sold, you can remove your listing so buyers know it is no longer available.</p>,
    },
  ];

  return (
    <div className="page_wrapper demo-page">

      {/* ── Hero ── */}
      <section className="demo-hero">
        <div className="container">
          <h1 className="demo-hero__title">
            Sell My SUV in {stateLabel}
          </h1>
          <p className="demo-hero__subtitle">
            The fastest, safest way to reach active SUV buyers across {capital} and regional {stateLabel}.
          </p>

          {/* Pricing card + CTA wrapper */}
          <div className="demo-price-wrapper">
            <div className="demo-price-card">

              {/* Left: State info */}
              <div className="demo-price-card__left">
                <div className="demo-price-card__aus-circle">
                  <img src={state.mapImg} alt={stateLabel} />
                </div>
                <div className="demo-price-card__header">
                  <h3>Looking to sell your SUV?</h3>
                </div>
                <p className="demo-price-card__desc">
                  List your SUV on Australia's #1 SUV marketplace and connect with thousands of buyers across {capital} and regional {stateLabel}.
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
                  { icon: "fa-percent", label: "No Commissions" },
                  { icon: "fa-calendar-days", label: "No Subscription" },
                  { icon: "fa-circle-dollar-to-slot", label: "No Upfront Fees" },
                  { icon: "fa-bullhorn", label: "Sell Until It's Sold" },
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

            {/* CTA */}
            <a href="https://seller.marketplacenetwork.com.au/caravan-seller-subscription/" className="demo-hero__cta">
              List Your SUV Now <i className="fa-solid fa-arrow-right" />
            </a>
          </div>{/* end demo-price-wrapper */}

        </div>
      </section>

      {/* ── Feature cards ── */}
      <section className="demo-features-section">
        <div className="container">
          <div className="demo-features-grid">
            {[
              { img: "/images/chat2.png", title: "Direct Buyer Contact", desc: "Communicate directly with buyers, no middleman." },
              { img: "/images/calendar.png", title: "Live Until Sold", desc: "Your listing stays live until your SUV is sold." },
              { img: "/images/caravan.png", title: "SUV-Only Marketplace", desc: "Reach engaged SUV buyers actively looking to buy SUVs." },
              { img: "/images/dollar.png", title: "Keep 100% of Your Sale", desc: "Pay only a one-time fee for maximum value. No hidden costs." },
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

          <div className="demo-reach-heading">
            <h3>Reach SUV Buyers Across {stateLabel}, Including: </h3>
          </div>

          {/* Region links */}
          <section className="demo-city-section">
            <div className="container">
              <div className="demo-city-grid">
                {CITY_LINKS.map((c) => (
                  <div key={c.label} className="demo-city-item">
                    <span className="demo-city-icon">
                      <img src="/images/caravan.png" alt="" />
                    </span>
                    <h3 className="demo-city-label">
                      <a
                        href={`/sell-my-suv/${state.slug}/${c.pageSlug}/`}
                        title={`Sell my SUV in ${c.label.trim()}`}
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
              <img src="/images/your-caravan-desktop-seller-2.jpg" className="img-fluid d-none d-lg-block" alt="SUV For Sale Desktop" />
              <img src="/images/your-caravan-mobile-2.jpg" className="img-fluid d-block d-lg-none" alt="SUV For Sale Mobile" />
            </div>

            {/* Pricing + FAQ card */}
            <div className="demo-reach-card">
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
                    "1 SUV listed until sold",
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
                  List Your SUV Now <i className="fa-solid fa-arrow-right" />
                </a>
              </div>

              <div className="demo-reach-card__divider" />

              <div className="demo-reach-card__right">
                <div className="demo-reach-faq">
                  <div className="demo-reach-faq__body">
                    <h4>How long does the listing stay up?</h4>
                    <ul>
                      <li><i className="fa-solid fa-circle-check" />Your listing stays live until sold.</li>
                      <li><i className="fa-solid fa-circle-check" />Edit or update anytime, even after publishing.</li>
                      <li><i className="fa-solid fa-circle-check" />No extra fees to keep your ad active.</li>
                    </ul>
                  </div>
                </div>
                <div className="demo-reach-faq demo-reach-faq--border">
                  <div className="demo-reach-faq__body">
                    <h4>Can I edit my listing after posting?</h4>
                    <ul>
                      <li><i className="fa-solid fa-circle-check" />Yes, update your details, photos or price.</li>
                      <li><i className="fa-solid fa-circle-check" />Keep your listing accurate 24/7.</li>
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
                <h3>Why sell on SuvForSale.com.au?</h3>
              </div>
              <ul className="demo-guide-card__list">
                <li>Australia's #1 marketplace for buying and selling SUVs.</li>
                <li>Targeted SUV buyers across {capital} and regional {stateLabel}.</li>
                <li>Your listing stays live until sold with no hidden fees.</li>
                <li>Fast, simple and secure way to sell your SUV.</li>
              </ul>
            </div>

            <div className="demo-guide-card">
              <div className="demo-guide-card__header">
                <span className="demo-guide-card__num">2</span>
                <h3>What you need before listing</h3>
              </div>
              <ul className="demo-guide-card__list">
                <li>Photos: exterior, interior, kitchen, bathroom, tyres, accessories.</li>
                <li>Details: make, model, year, ATM, tare, length, sleeps, condition.</li>
                <li>Extras: rego, service history, inclusions, price, location.</li>
              </ul>
            </div>

            <div className="demo-guide-card">
              <div className="demo-guide-card__header">
                <span className="demo-guide-card__num">3</span>
                <h3>How to price your SUV</h3>
              </div>
              <ul className="demo-guide-card__list">
                <li>Check similar SUVs for sale in {stateLabel}.</li>
                <li>Compare make, model, year, condition and inclusions.</li>
                <li>List at a realistic price to attract more buyers.</li>
              </ul>
            </div>

            <div className="demo-guide-card">
              <div className="demo-guide-card__header">
                <span className="demo-guide-card__num">4</span>
                <h3>Private sale vs other options</h3>
              </div>
              <ul className="demo-guide-card__list">
                <li>Private sale: you keep 100% of the sale price.</li>
                <li>Dealers/consignment: may charge fees or commission.</li>
                <li>SuvForSale.com.au: one-time fee, no commission.</li>
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
            <p>Everything you need to know about selling your SUV in {stateLabel} on SuvForSale.com.au</p>
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

      {/* ── Caravan types ── */}
      <section className="demo-types-section">
        <div className="container">
          <h2 className="demo-section-title">Sell Any Type of SUV</h2>
          <div className="demo-types-grid">
            {CARAVAN_TYPES.map((t) => (
              <div key={t.label} className="demo-type-item">
                <div className="demo-type-icon">
                  <img src={t.img} alt={t.label} width={80} height={80} />
                </div>
                <span className="demo-type-label">{t.label}</span>
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
              <img src="/images/your-caravan-desktop-seller-2.jpg" className="img-fluid demo-why-img" alt={`${demonym} SUV buyers`} />
            </div>
            <div className="col-md-6">
              <h2>Why {demonym} SUV Buyers Visit SuvForSale Every Month</h2>
              <p>
                SuvForSale.com.au helps {demonym} SUV sellers reach buyers searching for
                used SUVs, off road SUVs, family SUVs, pop tops, hybrids and touring
                SUVs across {capital} and regional {stateLabel}.
              </p>
              <div className="demo-check-grid demo-check-grid--2col mt-3">
                {[
                  "Thousands of active buyers", `Local reach across ${abbr} regions`,
                  "SUV-only marketplace", "Simple listing process",
                  "High quality enquiries", "No commissions",
                  "Live until sold – no extra fees", "Friendly local support team",
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
          <h2 className="demo-steps-title">How To Sell Your SUV Online</h2>
          <p className="demo-steps-subtitle">List in minutes and reach thousands of active SUV buyers in {stateLabel}.</p>

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
            Start selling your SUV in {stateLabel} today for just{" "}
            <strong>$49 (Inc. GST)</strong> — live until sold.
          </p>
          <a href="https://seller.marketplacenetwork.com.au/caravan-seller-subscription/" className="btn white_btn">
            List Your SUV Now
          </a>
          <p className="demo-cta-strip__alt-link">
            Not in {abbr}? Sell your SUV across Australia <a href="/sell-my-suv/">here</a>.
          </p>
        </div>
      </section>

      {/* ── Have something other than a caravan to sell? ── */}
      <section className="demo-sell-explore">
        <div className="container text-center">
          <h2 className="demo-sell-explore__title">Have something other than an SUV to sell in {stateLabel}?</h2>
          <p className="demo-sell-explore__body">
            You can{" "}
            <a href={`https://www.motorhomesforsale.com.au/sell-my-motorhome/${state.slug}/`} target="_blank" rel="noopener noreferrer">sell your motorhome</a>,{" "}
            <a href={`https://www.campervansforsale.au/sell-my-campervan/${state.slug}/`} target="_blank" rel="noopener noreferrer">sell your campervan</a>{" "}
            or{" "}
            <a href={`https://www.campingtrailersforsale.com.au/sell-my-camper-trailer/${state.slug}/`} target="_blank" rel="noopener noreferrer">sell your camper trailer</a>{" "}
            through our other marketplaces. Visit the relevant website to see your listing options and get started.
          </p>
        </div>
      </section>

    </div>
  );
}
