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
  "4wd": (
    <>
      <h2 className="hbg-title">4WDs for Sale in Australia – Buy with Confidence</h2>
      <p className="hbg-body">
        Looking to buy a 4WD in Australia? 4WDForSale.com.au helps you browse and compare new and used 4WDs for sale from dealerships and private sellers nationwide. Whether you&apos;re buying your first 4WD, upgrading your family vehicle or searching for an affordable second-hand model, find a 4WD that suits your budget and driving needs.
      </p>
      <p className="hbg-body">
        Explore popular 4WD models such as the Toyota LandCruiser and Prado, Nissan Patrol, Ford Everest, Isuzu MU-X, Mitsubishi Pajero Sport and Suzuki Jimny. From compact off-road vehicles to spacious 7-seater 4WD SUVs and wagons, compare options suited to everyday driving, family adventures, caravan towing and Australian outback touring.
      </p>
      <p className="hbg-body">
        Use our search filters to find 4WDs by location, price, condition, make, model, fuel type, transmission and seating capacity. Compare important specifications such as ground clearance, low-range gearing, towing capacity, drivetrain, safety features and off-road capabilities.
      </p>
      <p className="hbg-body">
        When buying a used 4WD, check its service history, mechanical condition, registration and signs of previous off-road damage. Whether you&apos;re planning weekend adventures or long-distance touring, <Link href="/listings/" className="hbg-link">browse our 4wd listings</Link> and find a vehicle that best matches your requirements and contact dealers or private sellers directly.
      </p>
    </>
  ),
  "4x4": (
    <>
      <h2 className="hbg-title">4x4s for Sale in Australia – Buy with Confidence</h2>
      <p className="hbg-body">
        Looking to buy a 4x4 in Australia? 4x4ForSale.com.au helps you browse and compare new and used 4x4s for sale from dealerships and private sellers nationwide. Whether you&apos;re buying your first 4x4, upgrading your off-road vehicle or searching for an affordable second-hand model, find a 4x4 that suits your budget and driving needs.
      </p>
      <p className="hbg-body">
        Explore popular 4x4 models such as the Toyota HiLux and LandCruiser, Ford Ranger, Nissan Patrol and Navara, Mitsubishi Triton, Isuzu D-MAX, Jeep Wrangler and Suzuki Jimny. From rugged 4x4 utes and compact off-road vehicles to spacious SUVs, wagons and modified 4x4s, compare options suited to work, family adventures, caravan towing and Australian outback touring.
      </p>
      <p className="hbg-body">
        Use our search filters to find 4x4s by location, price, condition, make, model, body type, fuel type and transmission. Compare important specifications such as drivetrain, ground clearance, low-range gearing, towing capacity, safety features and off-road equipment.
      </p>
      <p className="hbg-body">
        When buying a used 4x4, check its service history, mechanical condition, registration and signs of previous off-road damage or modifications. Whether you&apos;re looking for a dependable workhorse or an adventure-ready vehicle, <Link href="/listings/" className="hbg-link">browse our 4x4 listings</Link>, compare available listings and contact dealers or private sellers directly.
      </p>
    </>
  ),
  convertibles: (
    <>
      <h2 className="hbg-title">Convertibles for Sale in Australia – Buy with Confidence</h2>
      <p className="hbg-body">
        Looking to buy a convertible in Australia? ConvertiblesForSale.com.au helps you browse and compare new and used convertibles for sale from dealerships and private sellers nationwide. Whether you&apos;re buying your first convertible car, upgrading to a luxury model or searching for an affordable second-hand car, find one that suits your budget and driving preferences.
      </p>
      <p className="hbg-body">
        Explore popular convertible models such as the Mazda MX-5, Ford Mustang Convertible, BMW Z4, Mercedes-Benz SL, Porsche Boxster and Audi Cabriolet models. From sporty 2-seater roadsters and practical 4-seater convertibles to luxury cabriolets and high-performance sports cars, compare soft-top and retractable hardtop designs suited to everyday driving, weekend escapes and open-top adventures.
      </p>
      <p className="hbg-body">
        Use our search filters to find convertibles by location, price, condition, make, model, fuel type, transmission and seating capacity. Compare important features such as roof operation, boot space, interior comfort, safety technology and driving performance.
      </p>
      <p className="hbg-body">
        When buying a used convertible, check its service history, mechanical condition, registration, roof seals and folding mechanism for signs of wear or water leaks. Whether you&apos;re looking for a sporty roadster or a luxury convertible, <Link href="/listings/" className="hbg-link">browse our convertible listings</Link>, compare available listings and contact dealers or private sellers directly.
      </p>
    </>
  ),
  coupes: (
    <>
      <h2 className="hbg-title">Coupes for Sale in Australia – Buy with Confidence</h2>
      <p className="hbg-body">
        Looking to buy a coupe in Australia? CoupesForSale.com.au helps you browse and compare new and used coupes for sale from dealerships and private sellers nationwide. Whether you&apos;re buying your first coupe, upgrading to a performance model or searching for an affordable second-hand sports car, find one that suits your budget and driving preferences.
      </p>
      <p className="hbg-body">
        Explore popular coupe models such as the Ford Mustang, Toyota GR86, Subaru BRZ, Nissan Z, BMW 4 Series, Mercedes-Benz CLE and Porsche 911. From lightweight 2-seater sports coupes and powerful V8 muscle cars to luxury coupes and comfortable grand tourers, compare vehicles designed for everyday driving, weekend escapes and performance enthusiasts.
      </p>
      <p className="hbg-body">
        Use our search filters to find coupes by location, price, condition, make, model, fuel type, transmission, drivetrain and seating capacity. Compare important specifications such as engine performance, rear-wheel drive or AWD capability, handling, safety features, interior comfort and boot space.
      </p>
      <p className="hbg-body">
        When buying a used coupe, check its service history, mechanical condition, registration and signs of accident damage or previous modifications. Whether you&apos;re looking for an engaging sports coupe or a refined luxury grand tourer, <Link href="/listings/" className="hbg-link">browse our coupe listings</Link>, compare available listings and contact dealers or private sellers directly.
      </p>
    </>
  ),
  awd: (
    <>
      <h2 className="hbg-title">AWDs for Sale in Australia – Buy with Confidence</h2>
      <p className="hbg-body">
        Looking to buy an AWD car in Australia? AWDForSale.com.au helps you browse and compare new and used AWDs for sale from dealerships and private sellers nationwide. Whether you&apos;re buying your first all-wheel-drive vehicle, upgrading your family car or searching for an affordable second-hand model, find an AWD that suits your budget and driving needs.
      </p>
      <p className="hbg-body">
        Explore popular AWD models such as the Subaru Forester, Outback and Crosstrek, Toyota RAV4, Mazda CX-5, Hyundai Tucson, Kia Sportage and BMW xDrive models. From compact AWD hatchbacks and practical family SUVs to spacious wagons, luxury sedans, hybrid and electric AWD vehicles, compare options suited to everyday commuting, long-distance travel and varying Australian road conditions.
      </p>
      <p className="hbg-body">
        Use our search filters to find AWD vehicles by location, price, condition, make, model, body type, fuel type and transmission. Compare important specifications such as drivetrain technology, fuel efficiency, safety features, traction systems, seating capacity and driving performance.
      </p>
      <p className="hbg-body">
        When buying a used AWD, check its service history, mechanical condition, registration, tyre wear and drivetrain maintenance. Whether you&apos;re looking for improved traction on slippery roads or a comfortable family vehicle, <Link href="/listings/" className="hbg-link">browse our AWD listings</Link>, compare available listings and contact dealers or private sellers directly.
      </p>
    </>
  ),
  hatchbacks: (
    <>
      <h2 className="hbg-title">Hatchbacks for Sale in Australia – Buy with Confidence</h2>
      <p className="hbg-body">
        Looking to buy a hatchback in Australia? HatchbacksForSale.com.au helps you browse and compare new and used hatchbacks for sale from dealerships and private sellers nationwide. Whether you&apos;re buying your first car, upgrading your daily driver or searching for an affordable second-hand hatchback, find a vehicle that suits your budget and lifestyle.
      </p>
      <p className="hbg-body">
        Explore popular hatchback models such as the Toyota Corolla, Mazda3, Hyundai i30, Kia Picanto, Suzuki Swift, MG3 and Volkswagen Golf. From compact city hatchbacks and economical small cars to practical family models, hybrid and electric hatchbacks, and sporty hot hatches, compare vehicles suited to everyday commuting, weekend trips and performance driving.
      </p>
      <p className="hbg-body">
        Use our search filters to find hatchbacks by location, price, condition, make, model, body size, fuel type and transmission. Compare important features such as fuel efficiency, boot space, folding rear seats, safety technology, parking convenience and running costs.
      </p>
      <p className="hbg-body">
        When buying a used hatchback, check its service history, mechanical condition, registration and kilometres travelled. Whether you&apos;re looking for a budget-friendly first car, a fuel-efficient hybrid or a performance hatchback, <Link href="/listings/" className="hbg-link">browse our hatchback listings</Link>, compare available listings and contact dealers or private sellers directly.
      </p>
    </>
  ),
  sedans: (
    <>
      <h2 className="hbg-title">Sedans for Sale in Australia – Buy with Confidence</h2>
      <p className="hbg-body">
        Looking to buy a sedan in Australia? SedansForSale.com.au helps you browse and compare new and used sedans for sale from dealerships and private sellers nationwide. Whether you&apos;re buying your first sedan, upgrading your family car or searching for an affordable second-hand model, find a vehicle that suits your budget and driving needs.
      </p>
      <p className="hbg-body">
        Explore popular sedan models such as the Toyota Camry and Corolla Sedan, Hyundai i30 Sedan, Kia K4, Mazda3, BMW 3 Series, Mercedes-Benz C-Class and Tesla Model 3. From compact and fuel-efficient sedans to spacious family cars, luxury executive sedans, hybrid and electric models, and high-performance sports sedans, compare options suited to everyday commuting, family travel and long-distance driving.
      </p>
      <p className="hbg-body">
        Use our search filters to find sedans by location, price, condition, make, model, body size, fuel type and transmission. Compare important features such as passenger comfort, boot space, fuel efficiency, safety technology, drivetrain and running costs.
      </p>
      <p className="hbg-body">
        When buying a used sedan, check its service history, mechanical condition, registration and kilometres travelled. Whether you&apos;re looking for an economical family car or a premium luxury sedan, <Link href="/listings/" className="hbg-link">browse our sedans for sale</Link>, compare available listings and contact dealers or private sellers directly.
      </p>
    </>
  ),
  electric: (
    <>
      <h2 className="hbg-title">Electric Cars for Sale in Australia – Buy with Confidence</h2>
      <p className="hbg-body">
        Looking to buy an electric car in Australia? ElectricCarsForSale.au helps you browse and compare new and used electric cars for sale from dealerships and private sellers nationwide. Whether you&apos;re buying your first electric vehicle, upgrading to a newer EV or searching for an affordable second-hand model, find one that suits your budget and driving needs.
      </p>
      <p className="hbg-body">
        Explore popular electric models such as the Tesla Model 3 and Model Y, BYD Atto 3, Seal and Dolphin, MG4, Hyundai IONIQ 5 and Kia EV5. From compact electric hatchbacks and practical family SUVs to spacious electric sedans and luxury EVs, compare fully electric vehicles suited to everyday commuting, family travel and long-distance driving.
      </p>
      <p className="hbg-body">
        Use our search filters to find electric cars by location, price, condition, make, model, body type, driving range and battery capacity. Compare important specifications such as charging speed, battery technology, energy efficiency, safety features, warranty coverage and running costs.
      </p>
      <p className="hbg-body">
        When buying a used electric car, check its battery health, remaining battery warranty, charging compatibility, service history and overall condition. Whether you&apos;re looking for an economical city EV or a long-range electric vehicle, <Link href="/listings/" className="hbg-link">browse our electric car listings</Link>, compare available listings and contact dealers or private sellers directly.
      </p>
    </>
  ),
  hybrid: (
    <>
      <h2 className="hbg-title">Hybrid Cars for Sale in Australia – Buy with Confidence</h2>
      <p className="hbg-body">
        Looking to buy a hybrid car in Australia? HybridCarsForSale.com.au helps you browse and compare new and used hybrid cars for sale from dealerships and private sellers nationwide. Whether you&apos;re buying your first hybrid, upgrading from a petrol car or searching for an affordable second-hand model, find a vehicle that suits your budget and driving needs.
      </p>
      <p className="hbg-body">
        Explore popular hybrid models such as the Toyota Corolla, Camry and RAV4, Hyundai Tucson, Kia Sportage, Honda HR-V, Mitsubishi Outlander PHEV and BYD Sealion 6. From fuel-efficient hybrid hatchbacks and sedans to spacious family SUVs and plug-in hybrid vehicles, compare options suited to everyday commuting, family travel and long-distance driving.
      </p>
      <p className="hbg-body">
        Choose between conventional hybrids (HEVs), which recharge their batteries while driving, and plug-in hybrids (PHEVs), which support external charging and extended electric-only driving. Use our search filters to compare vehicles by location, price, condition, make, model, body type and fuel type. Review fuel consumption, electric driving range, safety features, battery warranties and running costs.
      </p>
      <p className="hbg-body">
        When buying a used hybrid, check its service history, hybrid battery condition, remaining battery warranty and overall mechanical condition. <Link href="/listings/" className="hbg-link">Browse our hybrid car listings</Link>, compare available listings and contact dealers or private sellers directly.
      </p>
    </>
  ),
  vans: (
    <>
      <h2 className="hbg-title">Vans for Sale in Australia – Buy with Confidence</h2>
      <p className="hbg-body">
        Looking to buy a van in Australia? VansForSale.au helps you browse and compare new and used vans for sale from dealerships and private sellers nationwide. Whether you need a dependable work van, an affordable second-hand delivery vehicle or a spacious van for your business, find one that suits your budget and requirements.
      </p>
      <p className="hbg-body">
        Explore popular van models such as the Toyota HiAce, Ford Transit, Volkswagen Transporter and Crafter, Hyundai Staria Load, Renault Trafic, Mercedes-Benz Sprinter and LDV Deliver 9. From compact city vans and practical panel vans to long-wheelbase, high-roof and electric cargo vans, compare vehicles suited to tradespeople, couriers, delivery businesses and commercial transport.
      </p>
      <p className="hbg-body">
        Use our search filters to find vans by location, price, condition, make, model, fuel type, wheelbase and roof height. Compare important specifications such as cargo volume, payload capacity, loading access, fuel efficiency, towing capability and running costs.
      </p>
      <p className="hbg-body">
        When buying a used van, check its service history, mechanical condition, kilometres travelled, cargo floor and signs of heavy commercial use. Whether you&apos;re looking for a compact delivery van or a large commercial workhorse, <Link href="/listings/" className="hbg-link">browse our van listings</Link>, compare available listings and contact dealers or private sellers directly.
      </p>
    </>
  ),
  peoplemovers: (
    <>
      <h2 className="hbg-title">People Movers for Sale in Australia – Buy with Confidence</h2>
      <p className="hbg-body">
        Looking to buy a people mover in Australia? PeopleMoversForSale.com.au helps you browse and compare new and used people movers for sale from dealerships and private sellers nationwide. Whether you&apos;re upgrading your family vehicle, looking for an affordable second-hand model or need additional passenger space, find a people mover that suits your budget and travel needs.
      </p>
      <p className="hbg-body">
        Explore popular models such as the Kia Carnival, Hyundai Staria, Toyota HiAce Commuter, Toyota Alphard and Vellfire, Volkswagen Multivan, Honda Odyssey and Mercedes-Benz V-Class. From practical 7-seater and 8-seater family vehicles to spacious passenger vans and luxury people movers, compare options suited to school runs, family holidays, group travel and passenger transport.
      </p>
      <p className="hbg-body">
        Use our search filters to find people movers by location, price, condition, make, model, fuel type and seating capacity. Compare important features such as sliding doors, third-row access, flexible seating arrangements, child-seat compatibility, boot space, safety technology and passenger comfort.
      </p>
      <p className="hbg-body">
        When buying a used people mover, check its service history, mechanical condition, registration, sliding doors and interior wear. Whether you need a comfortable family vehicle or a spacious people mover for group travel, <Link href="/listings/" className="hbg-link">browse our people mover listings</Link>, compare available listings and contact dealers or private sellers directly.
      </p>
    </>
  ),
  wagons: (
    <>
      <h2 className="hbg-title">Wagons for Sale in Australia – Buy with Confidence</h2>
      <p className="hbg-body">
        Looking to buy a wagon in Australia? WagonsForSale.com.au helps you browse and compare new and used wagons for sale from dealerships and private sellers nationwide. Whether you&apos;re buying your first station wagon, upgrading your family car or searching for an affordable second-hand model, find a wagon that suits your budget and driving needs.
      </p>
      <p className="hbg-body">
        Explore popular station wagon models such as the Subaru Outback, Skoda Octavia Wagon, Volkswagen Passat Wagon, Mazda6 Wagon, Holden Commodore Sportwagon, BMW 3 Series Touring and Audi Avant models. From practical family wagons and spacious touring vehicles to luxury estates, AWD wagons and high-performance sports wagons, compare options suited to everyday commuting, family holidays and long-distance travel.
      </p>
      <p className="hbg-body">
        Use our search filters to find wagons by location, price, condition, make, model, body size, fuel type and drivetrain. Compare important features such as boot capacity, folding rear seats, cargo space, passenger comfort, fuel efficiency, safety technology and running costs.
      </p>
      <p className="hbg-body">
        When buying a used wagon, check its service history, mechanical condition, registration, kilometres travelled and cargo area for signs of wear. Whether you&apos;re looking for a practical family station wagon or a premium performance estate, <Link href="/listings/" className="hbg-link">browse our wagon listings</Link>, compare available listings and contact dealers or private sellers directly.
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
              Ready to sell? Visit{" "}
              <a href={portalLinks.sell} className="hbg-sell-link">Sell My Car Online</a>{" "}
              to advertise your car for just $49 incl. GST. Your listing stays live until sold and is advertised across all relevant marketplaces within our network, helping you reach more potential buyers across Australia.
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
