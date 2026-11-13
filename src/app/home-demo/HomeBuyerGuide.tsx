import Image from "next/image";
import Link from "next/link";
import { site, portalLinks } from "@/config/sites";
import ExploreOtherVehicles from "@/app/components/ExploreOtherVehicles";
import type { ReactNode } from "react";
import HomeFaq from "./HomeFaq";
import { HOME_FAQS } from "./homeFaqData";

const faqs = HOME_FAQS[site.key];

/** Buyer Guide text written for one site, keyed by site key. Sites without an
 * entry use the shared copy in HomeBuyerGuide below. */
const SITE_COPY: Partial<Record<string, ReactNode>> = {
  utes: (
    <>
      <h2 className="hbg-title">Utes for Sale in Australia – Buy with Confidence</h2>
      <p className="hbg-body">
        Looking to buy a ute in Australia? UtesForSale.com helps you browse and compare new and used utes for sale from dealerships and private sellers nationwide. Whether you&apos;re buying your first ute, upgrading your work vehicle or searching for an affordable second-hand model, find a ute that suits your budget and driving needs.
      </p>
      <p className="hbg-body">
        Explore utes from popular brands such as Toyota, Ford, Isuzu, Mitsubishi, Mazda, Nissan, GWM and LDV. From practical single cab and tray-back utes for tradies to versatile dual cab models for families, 4x4 utes for off-road adventures and electric or hybrid options, compare vehicles designed for work, towing, everyday driving and recreation.
      </p>
      <p className="hbg-body">
        Use our search filters to find utes by location, price, condition, make, model, cab type, fuel type and drivetrain. Compare key specifications including year, kilometres travelled, transmission, engine type, payload and towing capacity, along with features such as safety technology, four-wheel drive systems and accessories.
      </p>
      <p className="hbg-body">
        When buying a used ute, check its service history, mechanical condition, registration and signs of heavy commercial use. Whether you need a reliable workhorse or a comfortable family vehicle, <Link href="/listings/" className="hbg-link">browse our Ute listings</Link>, compare available listings and contact dealers or private sellers directly.
      </p>
    </>
  ),
  suv: (
    <>
      <h2 className="hbg-title">SUVs for Sale in Australia – Buy with Confidence</h2>
      <p className="hbg-body">
        Looking to buy an SUV in Australia? SUVForSale.com.au helps you browse and compare new and used SUVs for sale from dealerships and private sellers nationwide. Whether you&apos;re buying your first SUV, upgrading your family vehicle or searching for an affordable second-hand model, find an SUV that suits your budget and driving needs.
      </p>
      <p className="hbg-body">
        Explore SUVs from popular brands such as Toyota, Mazda, Hyundai, Kia, Mitsubishi, Nissan, BMW and Mercedes-Benz. From compact SUVs for city driving to spacious 5-seater and 7-seater family models, luxury SUVs, hybrid and electric vehicles, and capable AWD and 4WD SUVs, compare options suited to everyday commuting, family adventures and long-distance travel.
      </p>
      <p className="hbg-body">
        Use our search filters to find SUVs by location, price, condition, make, model, body size, fuel type, drivetrain and seating capacity. Compare key specifications including year, kilometres travelled, transmission, fuel efficiency, boot space, safety features and towing capacity.
      </p>
      <p className="hbg-body">
        When buying a used SUV, check its service history, mechanical condition, registration and safety features. Whether you need a practical family SUV, an economical hybrid or a capable 4WD for weekend adventures, <Link href="/listings/" className="hbg-link">browse our suv listings</Link> and contact dealers or private sellers directly.
      </p>
    </>
  ),
};

export default function HomeBuyerGuide() {
  return (
    <>
      {/* ── Buyer Guide ── */}
      <section className="hbg-section">
        <div className="container">
          <div className="hbg-row">

            {/* Left: Image */}
            <div className="hbg-img-col">
              <div className="hbg-img-wrap">
                <Image
                  src={site.buyerGuideImage}
                  alt={`${site.plural} for Sale Australia`}
                  width={1024}
                  height={682}
                  className="hbg-img"
                  unoptimized
                />
                <div className="hbg-badge">
                  <svg className="hbg-badge-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <polyline points="9 12 11 14 15 10"/>
                  </svg>
                  <span className="hbg-badge-text">AUSTRALIA&apos;S TRUSTED<br />{site.singular.toUpperCase()} MARKETPLACE</span>
                </div>
              </div>
            </div>

            {/* Right: Text — a site's own copy when it has one, else the shared copy */}
            <div className="hbg-text-col">
              {SITE_COPY[site.key] ?? (
                <>
                  <h2 className="hbg-title">
                    {site.plural} for Sale Australia: <span className="hbg-title-accent">Buyer Guide</span>
                  </h2>
                  <p className="hbg-body">
                    {site.brand} makes it easy to browse new and used {site.nounPlural} for sale across Australia from dealers and private sellers. Compare affordable pre-owned vehicles, the latest new models and options suited to different budgets and driving needs. Review important details such as make, model, year, odometer, fuel type, transmission, drivetrain, seating, safety features, condition and service history before contacting a seller or visiting a dealership.
                  </p>
                  <p className="hbg-body">
                    Compare popular makes, models and variants from reputable dealers and private sellers across Australia. Consider running costs, fuel efficiency, warranty coverage, finance options, trade-ins and after-sales support before making your decision. Use our buyer&apos;s guide and convenient search filters to browse listings by state, location, budget, year, odometer and key specifications, helping you find the right {site.noun} for your lifestyle.
                  </p>
                </>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── Explore Other Vehicle Options ── */}
      <section className="hbg-explore-section">
        <div className="container">
          <div className="hbg-explore-card">
            <ExploreOtherVehicles classes={{ title: "hbg-explore-title", body: "hbg-explore-body", link: "hbg-explore-link" }} />
          </div>
        </div>
      </section>

      {/* ── FAQ (only sites with their own questions; its FAQPage schema is in layout.tsx's home @graph) ── */}
      {faqs && <HomeFaq categories={faqs} />}

      {/* ── Sell CTA Card ── */}
      <section className="hbg-sell-section">
        <div className="container">
          <div className="hbg-sell-card">

            {/* Icon row */}
            <div className="hbg-sell-icon-row">
              <span className="hbg-sell-line" />
              <div className="hbg-sell-icon-wrap">
                <Image src={site.vehicleIcon} alt="" width={24} height={24} style={{ opacity: 0.4, objectFit: "contain" }} />
              </div>
              <span className="hbg-sell-line" />
            </div>

            <h2 className="hbg-sell-title">Looking to sell your car?</h2>
            <p className="hbg-sell-body">
              Whether you&apos;re upgrading or simply ready for a change,{" "}
              <a href={portalLinks.sell} className="hbg-sell-link">sell your car online</a>{" "}
              for just $49 incl. GST. Your listing stays live until sold and is advertised across all relevant marketplaces within our network, helping you reach more potential buyers across Australia.
            </p>


          </div>
        </div>
      </section>

      {/* ── Why Australians ── */}
      <section className="hbg-why-section">
        <div className="container">
          <h2 className="hbg-why-title">
            Why Australians Use <span className="hbg-why-accent">{site.brand}</span>
          </h2>
          

          <div className="hbg-why-cards-wrap">
            <div className="hbg-why-grid">

              <div className="hbg-why-card">
                <div className="hbg-why-icon">
                  <Image src="/images/seller.svg" alt="Dealers & Private Sellers" width={34} height={34} />
                </div>
                <h3 className="hbg-why-card-title">Dealers &amp; Private Sellers</h3>
                <div className="hbg-why-card-sep" />
                <p className="hbg-why-card-desc">Browse new and used {site.nounPlural} for sale from trusted dealers and private sellers across Australia.</p>
              </div>

              <div className="hbg-why-card">
                <div className="hbg-why-icon">
                  <Image src="/images/australia.png" alt="Australia-Wide Coverage" width={34} height={34} />
                </div>
                <h3 className="hbg-why-card-title">Australia-Wide Coverage</h3>
                <div className="hbg-why-card-sep" />
                <p className="hbg-why-card-desc">Find {site.noun} listings across every state and territory, including major cities and regional locations.</p>
              </div>

              <div className="hbg-why-card">
                <div className="hbg-why-icon">
                  <Image src={site.vehicleIcon} alt={`Dedicated ${site.singular} Marketplace`} width={55} height={40} className="hbg-why-icon__vehicle" />
                </div>
                <h3 className="hbg-why-card-title">Dedicated {site.singular} Marketplace</h3>
                <div className="hbg-why-card-sep" />
                <p className="hbg-why-card-desc">Explore an Australian marketplace focused exclusively on {site.nounPlural} and {site.noun} buyers.</p>
              </div>

              <div className="hbg-why-card">
                <div className="hbg-why-icon">
                  <Image src="/images/dollar.png" alt="Easy to Compare" width={34} height={34} />
                </div>
                <h3 className="hbg-why-card-title">Easy to Compare</h3>
                <div className="hbg-why-card-sep" />
                <p className="hbg-why-card-desc">Compare {site.noun} prices, features, layouts and seller details to find the right match.</p>
              </div>

            </div>
          </div>


        </div>
      </section>
    </>
  );
}
