"use client";
import "@fortawesome/fontawesome-free/css/fontawesome.min.css";
import { siteRange } from "@/config/siteRange";
import "@fortawesome/fontawesome-free/css/solid.min.css";
import "@fortawesome/fontawesome-free/css/regular.min.css";
import React, { useState } from "react";
import { StateData } from "../sell-my-caravan-region/states-data";
import { getRegionsByState } from "../sell-my-caravan-region/regions-data";
import { site, sitePaths } from "@/config/sites";

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
    { num: 1, iconSet: "fa-regular", icon: "fa-file-lines", title: "Create Your Listing", desc: `Add your ${site.noun} details, description, price and location in minutes.` },
    { num: 2, iconSet: "fa-regular", icon: "fa-image", title: "Upload Photos", desc: `Add clear photos of the inside, outside and features of your ${site.noun}.` },
    { num: 3, iconSet: "fa-regular", icon: "fa-comment-dots", title: "Reach Buyers", desc: `Your listing is live across ${stateLabel}. Buyers contact you directly.` },
    { num: 4, iconSet: "fa-regular", icon: "fa-handshake", title: "Negotiate Directly", desc: "Arrange inspections and negotiate price with buyers." },
    { num: 5, iconSet: "fa-regular", icon: "fa-circle-check", title: "Complete The Sale", desc: "Once sold, remove your listing or mark as sold. It's that simple." },
  ];

  const MAIN_FAQS = [
    {
      q: `How do I sell my ${site.noun} in ${stateLabel}?`,
      a: <p>You can sell your {site.noun} online by creating a private seller listing on {site.brand}. Simply add your {site.noun} details, upload clear photos, set your asking price, and publish your ad so active buyers across {stateLabel} and all of Australia can contact you directly.</p>,
    },
    {
      q: `How much does it cost to sell my ${site.noun} in ${stateLabel}?`,
      a: <p>We charge a simple, flat one-time fee of just $49 (inc. GST). There are absolutely no commissions, no hidden upfront fees, and no recurring monthly subscriptions. You keep 100% of your sale price.</p>,
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
      a: <p>Upload clear photos of the outside, inside, kitchen, beds, seating area, bathroom, tyres, drawbar and any included accessories. Good photos help buyers understand the condition of your {site.noun} and can increase enquiries.</p>,
    },
    {
      q: `How should I price my ${site.noun}?`,
      a: <p>Check similar {site.nounPlural} for sale in {stateLabel} before setting your price. Compare by make, model, year, condition, length, ATM, tare weight, sleeping capacity, features and location. A realistic asking price can help attract more genuine buyers.</p>,
    },
    {
      q: `Is it safe to sell my ${site.noun} privately online?`,
      a: <p>Yes, but you should take normal precautions. Speak with buyers directly, meet in a safe location, confirm payment has cleared before handover and complete any required transfer paperwork for {stateLabel}.</p>,
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

  return (
    <div className="page_wrapper demo-page">

      {/* ── Hero ── */}
      <section className="demo-hero">
        <div className="container">
          <h1 className="demo-hero__title">
            Sell My {site.singular} in {stateLabel}
          </h1>
          <p className="demo-hero__subtitle">
            The fastest, safest way to reach active {site.noun} buyers across {capital} and regional {stateLabel}.
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
                  <h3>Looking to sell your {site.noun}?</h3>
                </div>
                <p className="demo-price-card__desc">
                  List your {site.noun} on Australia's #1 {site.noun} marketplace and connect with thousands of buyers across {capital} and regional {stateLabel}.
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
              { img: "/images/chat2.png", title: "Direct Buyer Contact", desc: "Communicate directly with buyers, no middleman." },
              { img: "/images/calendar.png", title: "Live Until Sold", desc: `Your listing stays live until your ${site.noun} is sold.` },
              { img: site.vehicleIcon, title: `${site.singular}-Only Marketplace`, desc: `Reach engaged ${site.noun} buyers actively looking to buy ${site.nounPlural}.` },
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
            <h3>Reach {site.singular} Buyers Across {stateLabel}, Including: </h3>
          </div>

          {/* Region links */}
          <section className="demo-city-section">
            <div className="container">
              <div className="demo-city-grid">
                {CITY_LINKS.map((c) => (
                  <div key={c.label} className="demo-city-item">
                    <span className="demo-city-icon">
                      <img src={site.vehicleIcon} alt="" />
                    </span>
                    <h3 className="demo-city-label">
                      <a
                        href={`${sitePaths.sell}${state.slug}/${c.pageSlug}/`}
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
                  List Your {site.singular} Now <i className="fa-solid fa-arrow-right" />
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
                <h3>Why sell on {site.brand}?</h3>
              </div>
              <ul className="demo-guide-card__list">
                <li>Australia's #1 marketplace for buying and selling {site.nounPlural}.</li>
                <li>Targeted {site.noun} buyers across {capital} and regional {stateLabel}.</li>
                <li>Your listing stays live until sold with no hidden fees.</li>
                <li>Fast, simple and secure way to sell your {site.noun}.</li>
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
                <h3>How to price your {site.noun}</h3>
              </div>
              <ul className="demo-guide-card__list">
                <li>Check similar {site.nounPlural} for sale in {stateLabel}.</li>
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
                <li>{site.brand}: one-time fee, no commission.</li>
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
            <p>Everything you need to know about selling your {site.noun} in {stateLabel} on {site.brand}</p>
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
              <img src="/images/sell-mockup-desktop.jpg" className="img-fluid demo-why-img" alt={`${demonym} ${site.noun} buyers`} />
            </div>
            <div className="col-md-6">
              <h2>Why {demonym} {site.singular} Buyers Visit {site.brand} Every Month</h2>
              <p>
                {site.brand} helps {demonym} {site.noun} sellers reach buyers searching for
                {" "}{siteRange} across {capital} and regional {stateLabel}.
              </p>
              <div className="demo-check-grid demo-check-grid--2col mt-3">
                {[
                  "Thousands of active buyers", `Local reach across ${abbr} regions`,
                  `${site.singular}-only marketplace`, "Simple listing process",
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
          <h2 className="demo-steps-title">How To Sell Your {site.singular} Online</h2>
          <p className="demo-steps-subtitle">List in minutes and reach thousands of active {site.noun} buyers in {stateLabel}.</p>

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
            Start selling your {site.noun} in {stateLabel} today for just{" "}
            <strong>$49 (Inc. GST)</strong> — live until sold.
          </p>
          <a href="https://seller.marketplacenetwork.com.au/caravan-seller-subscription/" className="btn white_btn">
            List Your {site.singular} Now
          </a>
          <p className="demo-cta-strip__alt-link">
            Not in {abbr}? Sell your {site.noun} across Australia <a href={sitePaths.sell}>here</a>.
          </p>
        </div>
      </section>

    </div>
  );
}
