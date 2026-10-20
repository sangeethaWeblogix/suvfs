import Image from "next/image";
import { SITES, site, sitePaths } from "@/config/sites";

const RELATED_SITE_KEYS: Record<string, [string, string, string]> = {
  suv: ["4x4", "wagons", "hybrid"],
  utes: ["4x4", "vans", "suv"],
  peoplemovers: ["vans", "suv", "wagons"],
  sedans: ["hatchbacks", "coupes", "wagons"],
  hatchbacks: ["sedans", "wagons", "electric"],
  wagons: ["suv", "sedans", "peoplemovers"],
  coupes: ["convertibles", "sedans", "hatchbacks"],
  convertibles: ["coupes", "sedans", "electric"],
  vans: ["utes", "peoplemovers", "suv"],
  "4x4": ["suv", "utes", "wagons"],
  electric: ["hybrid", "hatchbacks", "suv"],
  hybrid: ["electric", "suv", "sedans"],
};

const RELATED_SITE_BENEFITS: Record<string, string> = {
  suv: "versatile family driving",
  utes: "work-ready practicality",
  peoplemovers: "extra passenger space",
  sedans: "comfortable everyday driving",
  hatchbacks: "compact, city-friendly practicality",
  wagons: "flexible passenger and cargo space",
  coupes: "sporty styling and performance",
  convertibles: "open-air driving",
  vans: "business and cargo versatility",
  "4x4": "off-road capability",
  electric: "efficient electric driving",
  hybrid: "improved fuel efficiency",
};

export default function HomeBuyerGuide() {
  const relatedSites = (RELATED_SITE_KEYS[site.key] ?? RELATED_SITE_KEYS.suv).map((key) => SITES[key]);

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

            {/* Right: Text */}
            <div className="hbg-text-col">
              <h2 className="hbg-title">
                {site.plural} for Sale Australia: <span className="hbg-title-accent">Buyer Guide</span>
              </h2>
              
              <p className="hbg-body">
                {site.brand} makes it easy to browse new and used {site.nounPlural} for sale across Australia from dealers and private sellers. Compare affordable pre-owned vehicles, the latest new models and options suited to different budgets and driving needs. Review important details such as make, model, year, odometer, fuel type, transmission, drivetrain, seating, safety features, condition and service history before contacting a seller or visiting a dealership.
              </p>
              <p className="hbg-body">
                Compare popular makes, models and variants from reputable dealers and private sellers across Australia. Consider running costs, fuel efficiency, warranty coverage, finance options, trade-ins and after-sales support before making your decision. Use our buyer&apos;s guide and convenient search filters to browse listings by state, location, budget, year, odometer and key specifications, helping you find the right {site.noun} for your lifestyle.
              </p>
              
            </div>

          </div>
        </div>
      </section>

      {/* ── Explore Other Vehicle Options ── */}
      <section className="hbg-explore-section">
        <div className="container">
          <div className="hbg-explore-card">
            <h2 className="hbg-explore-title">Explore Other Vehicle Options</h2>
            <p className="hbg-explore-body">
              Still deciding which vehicle best suits your needs? Browse{" "}
              <a href={`${relatedSites[0].url}/`} className="hbg-explore-link" target="_blank" rel="noopener noreferrer">{relatedSites[0].nounPlural} for sale</a>{" "}
              for {RELATED_SITE_BENEFITS[relatedSites[0].key]}, explore{" "}
              <a href={`${relatedSites[1].url}/`} className="hbg-explore-link" target="_blank" rel="noopener noreferrer">{relatedSites[1].nounPlural} for sale</a>{" "}
              for {RELATED_SITE_BENEFITS[relatedSites[1].key]}, or compare{" "}
              <a href={`${relatedSites[2].url}/`} className="hbg-explore-link" target="_blank" rel="noopener noreferrer">{relatedSites[2].nounPlural} for sale</a>{" "}
              for {RELATED_SITE_BENEFITS[relatedSites[2].key]} across our other Australian car marketplaces.
            </p>
          </div>
        </div>
      </section>

      {/* ── Sell CTA Card ── */}
      <section className="hbg-sell-section">
        <div className="container">
          <div className="hbg-sell-card">

            {/* Icon row */}
            <div className="hbg-sell-icon-row">
              <span className="hbg-sell-line" />
              <div className="hbg-sell-icon-wrap">
                <Image src="/images/category.svg" alt="" width={24} height={24} style={{ opacity: 0.4 }} />
              </div>
              <span className="hbg-sell-line" />
            </div>

            <h2 className="hbg-sell-title">Looking to Sell Your {site.singular}?</h2>
            <p className="hbg-sell-body">
              If you&apos;re upgrading or no longer need your current {site.noun},{" "}
              <a href={sitePaths.sell} className="hbg-sell-link">sell your {site.noun}</a>{" "}
              by creating a listing on {site.brand} and connect with active buyers across Australia. Your advertisement stays online until it&apos;s sold for a one-time fee of $49.
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
                  <Image src="/images/category.svg" alt={`Dedicated ${site.singular} Marketplace`} width={34} height={34} />
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
