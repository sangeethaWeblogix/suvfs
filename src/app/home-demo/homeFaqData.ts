import { portalLinks, site } from "@/config/sites";
import { WEBSITE_ID } from "@/utils/seo/siteSchema";

/** One FAQ tab on the home page. */
export interface FaqCategory {
  label: string;
  items: FaqItem[];
}

export interface FaqItem {
  question: string;
  /** HTML string — may contain inline <a> tags to this site's /listings/ pages. */
  answer: string;
}

const SELL = portalLinks.sell;

/** Home page FAQ tabs, keyed by site key. Sites without an entry show no FAQ
 * section. Links are relative so they stay on the site being viewed. */
export const HOME_FAQS: Partial<Record<string, FaqCategory[]>> = {
  utes: [
    {
      label: "Used Utes",
      items: [
        {
          question: "Where can I find used utes for sale in Australia?",
          answer: `Browse <a href="/listings/used-condition/">used utes for sale</a> on UtesForSale.com. Compare second-hand vehicles from dealerships and private sellers across Australia.`,
        },
        {
          question: "How much does a second-hand ute cost?",
          answer: `Second-hand utes can cost under $10,000 for older models or exceed $60,000 for newer premium vehicles. Prices depend on age, kilometres, brand and condition.`,
        },
        {
          question: "Are second-hand utes worth buying?",
          answer: `Used utes can offer good value, particularly when properly maintained. Check their service records, mechanical condition, kilometres travelled and previous use before buying.`,
        },
        {
          question: "What mileage is good for a used ute?",
          answer: `Kilometres alone don't determine a ute's condition. A well-maintained vehicle with 150,000 km may be a better purchase than a poorly serviced ute with fewer kilometres.`,
        },
        {
          question: "What are the most reliable second-hand utes?",
          answer: `Toyota HiLux, Isuzu D-MAX, Mitsubishi Triton and Ford Ranger are commonly considered by Australian used ute buyers. Reliability varies by model, age, maintenance and condition.`,
        },
        {
          question: "How do I check the history of a used ute?",
          answer: `Conduct a PPSR search using the VIN to check registered security interests and available stolen or written-off records. Review service history and registration details separately.`,
        },
        {
          question: "Are ex-commercial utes worth buying?",
          answer: `Ex-commercial utes can offer value when properly maintained. Check for heavy towing, excessive loads, suspension wear, chassis damage and signs of extensive worksite use.`,
        },
        {
          question: "Where can I find cheap used utes?",
          answer: `Browse <a href="/listings/under-10000/">utes under $10,000</a> or apply other price filters on UtesForSale.com to compare affordable second-hand vehicles.`,
        },
      ],
    },
    {
      label: "Ute Brands",
      items: [
        {
          question: "What are the most popular ute brands in Australia?",
          answer: `Popular ute brands include Toyota, Ford, Isuzu, Mitsubishi, Mazda, Nissan, Volkswagen, GWM and LDV. Compare available makes and models on UtesForSale.com.`,
        },
        {
          question: "Are Toyota HiLux utes reliable?",
          answer: `The Toyota HiLux has a long-standing reputation for durability and work capability. Reliability depends on servicing and previous use. Browse <a href="/listings/toyota/">Toyota utes for sale</a>.`,
        },
        {
          question: "Which Ford Ranger is best to buy?",
          answer: `The Ranger XL and XLT suit many work and everyday needs, while Wildtrak and Raptor models offer different premium or performance features. Compare <a href="/listings/ford/">Ford utes for sale</a>.`,
        },
        {
          question: "Are Isuzu D-MAX utes good for work?",
          answer: `The Isuzu D-MAX offers practical work-focused configurations, including 2WD, 4WD and cab chassis options. Compare payload, towing capacity and specifications to find a suitable model.`,
        },
        {
          question: "What makes Mitsubishi Triton utes popular?",
          answer: `The Mitsubishi Triton offers a range of configurations suited to work and recreation. Its appeal includes available 4WD capability, practical features and competitive pricing.`,
        },
        {
          question: "Are GWM and LDV utes reliable?",
          answer: `GWM and LDV offer competitively priced utes with different features and warranties. Reliability varies by model and year, so compare servicing records, owner experiences and warranty support.`,
        },
        {
          question: "Which ute brands offer the best value for money?",
          answer: `Value depends on purchase price, features, reliability, servicing costs and resale value. Compare Toyota, Ford, Isuzu, Mitsubishi, GWM and LDV models to assess your options.`,
        },
      ],
    },
    {
      label: "Electric & Hybrid Utes",
      items: [
        {
          question: "What electric utes are available in Australia?",
          answer: `Fully electric options include the KGM Musso EV and Toyota HiLux BEV, with other models entering the Australian market. Browse <a href="/listings/electric-fuel-type/">electric utes for sale</a> to compare available listings.`,
        },
        {
          question: "Are electric utes worth buying?",
          answer: `Electric utes can suit buyers with regular charging access and predictable driving distances. Consider purchase price, driving range, charging facilities, payload and towing requirements.`,
        },
        {
          question: "What is the difference between hybrid and electric utes?",
          answer: `Electric utes run entirely on battery power, while hybrids combine an engine with electric assistance. Plug-in hybrids can also be charged using an external power source.`,
        },
        {
          question: "Are BYD utes fully electric or hybrid?",
          answer: `The BYD Shark 6 is a plug-in hybrid ute combining a petrol engine with electric motors and a rechargeable battery. It is not a fully electric vehicle.`,
        },
        {
          question: "Are plug-in hybrid utes available in Australia?",
          answer: `Yes. Options include the BYD Shark 6, Ford Ranger PHEV and GWM Cannon Alpha PHEV. Browse <a href="/listings/plug-in-hybrid-fuel-type/">plug-in hybrid utes for sale</a> to compare available models.`,
        },
        {
          question: "Are electric utes suitable for towing?",
          answer: `Some electric utes can tow trailers and caravans, but towing capacities vary by model. Heavy loads also reduce driving range, so check manufacturer specifications before buying.`,
        },
        {
          question: "How much does it cost to charge an electric ute?",
          answer: `Charging costs depend on battery capacity, electricity rates and charging method. Home charging is often cheaper than public fast charging, particularly using off-peak electricity.`,
        },
      ],
    },
    {
      label: "Ute Types & Features",
      items: [
        {
          question: "What is the difference between single cab and dual cab utes?",
          answer: `Single cab utes generally provide two front seats and more cargo space, while dual cab utes offer additional passenger seating. Compare <a href="/listings/single-cab-cab-type/">single cab</a> and <a href="/listings/dual-cab-cab-type/">dual cab utes</a>.`,
        },
        {
          question: "Are extra cab utes good for work?",
          answer: `Extra cab utes offer additional cabin storage and, in some models, occasional rear seating. They can suit buyers needing a balance between passenger accommodation and cargo space.`,
        },
        {
          question: "What is the difference between 2WD and 4WD utes?",
          answer: `2WD utes drive through one axle and are generally suitable for everyday roads. 4WD utes provide additional traction for selected off-road and challenging driving conditions.`,
        },
        {
          question: "Are 4x4 utes better for off-road driving?",
          answer: `Yes, 4x4 utes generally offer better off-road capability. However, ground clearance, tyres, suspension and driving conditions also affect performance.`,
        },
        {
          question: "What is a cab chassis ute?",
          answer: `A cab chassis ute comes with a cabin and exposed chassis behind it, allowing a tray or specialised body to be fitted for different work requirements.`,
        },
        {
          question: "What is a tray-back ute?",
          answer: `A tray-back ute has a flat cargo tray rather than a conventional tub. It is commonly used for transporting tools, equipment and bulky work materials.`,
        },
        {
          question: "Which utes have the highest towing capacity?",
          answer: `Many 4WD utes offer braked towing capacities of up to 3,500 kg, while some heavy-duty models exceed this. Always check payload, GCM and towball limits.`,
        },
        {
          question: "What is the best ute for carrying heavy loads?",
          answer: `A work-focused single cab or cab chassis ute with sufficient payload may be ideal. Compare GVM, tare weight, tray dimensions and load capacity.`,
        },
      ],
    },
    {
      label: "Prices & Finance",
      items: [
        {
          question: "How much does a new ute cost in Australia?",
          answer: `New ute prices vary from around $30,000 for some entry-level models to over $100,000 for premium and heavy-duty vehicles. Compare <a href="/listings/new-condition/">new utes for sale</a> for current asking prices.`,
        },
        {
          question: "What is the cheapest new ute in Australia?",
          answer: `The cheapest new ute depends on manufacturer pricing and dealer promotions. Entry-level 2WD and single cab models are often among the most affordable options.`,
        },
        {
          question: "Can I get ute finance in Australia?",
          answer: `Yes. Banks and specialist lenders offer finance for new and used utes, subject to eligibility. Compare interest rates, fees and repayment terms before borrowing.`,
        },
        {
          question: "What are the ongoing costs of owning a ute?",
          answer: `Ongoing costs include registration, insurance, fuel or electricity, servicing, tyres, repairs and depreciation. Heavy towing and work-related modifications may increase expenses.`,
        },
        {
          question: "Are demo utes cheaper than brand-new utes?",
          answer: `Demo utes may cost less than equivalent new models. Check kilometres travelled, registration history, warranty commencement dates and vehicle condition before buying.`,
        },
      ],
    },
    {
      label: "Utes for Sale by Location",
      items: [
        {
          question: "Where can I find utes for sale in Sydney?",
          answer: `Browse <a href="/listings/new-south-wales-state/sydney-region/">utes for sale in Sydney</a> on UtesForSale.com. Compare new, used and demo vehicles from dealerships and private sellers.`,
        },
        {
          question: "Where can I find utes for sale in Melbourne?",
          answer: `Explore <a href="/listings/victoria-state/melbourne-region/">utes for sale in Melbourne</a> and filter available listings by price, make, model, condition and drivetrain.`,
        },
        {
          question: "Where can I find utes for sale in Brisbane?",
          answer: `Browse <a href="/listings/queensland-state/brisbane-region/">utes for sale in Brisbane</a> and compare available models, prices and specifications from local dealerships and private sellers.`,
        },
        {
          question: "Where can I find utes for sale in Adelaide?",
          answer: `Find <a href="/listings/south-australia-state/adelaide-region/">utes for sale in Adelaide</a> on UtesForSale.com, including available new, used and demo vehicles.`,
        },
        {
          question: "Where can I find utes for sale in Perth?",
          answer: `Browse <a href="/listings/western-australia-state/perth-region/">utes for sale in Perth</a> to compare prices, brands and available vehicle specifications.`,
        },
        {
          question: "Where can I find utes for sale near me?",
          answer: `Use the location filters on UtesForSale.com to find available utes in your state, city or region.`,
        },
      ],
    },
    {
      label: "Selling & Our Marketplace",
      items: [
        {
          question: "How does UtesForSale.com work?",
          answer: `UtesForSale.com is an Australian ute marketplace where buyers browse listings, compare vehicles and contact dealers or private sellers directly. Advertisers can list eligible vehicles through our marketplace network.`,
        },
        {
          question: "How can I sell my ute online in Australia?",
          answer: `You can <a href="${SELL}">sell your car online</a> through our unified marketplace for $49 including GST. Your ute is advertised across relevant automotive marketplaces until sold.`,
        },
        {
          question: "How much is my ute worth?",
          answer: `Your ute's value depends on its make, model, year, kilometres, condition and features. Compare similar vehicles currently advertised to estimate a competitive asking price.`,
        },
        {
          question: "How much does it cost to advertise a ute for sale?",
          answer: `Private sellers pay a one-time fee of $49 including GST through SellMyCarOnline.au. There are no monthly listing fees or sales commissions.`,
        },
        {
          question: "How long will my ute advertisement stay online?",
          answer: `Your private seller advertisement remains live until your vehicle is sold, with no automatic monthly listing charges.`,
        },
        {
          question: "Will my ute be advertised across multiple websites?",
          answer: `Yes. When you list through SellMyCarOnline.au, your vehicle is automatically advertised across relevant automotive marketplaces within our network.`,
        },
        {
          question: "Can I sell my ute without paying dealership commissions?",
          answer: `Yes. SellMyCarOnline.au allows private sellers to advertise directly for $49 including GST, with no commission on the final selling price.`,
        },
        {
          question: "How do buyers contact sellers on UtesForSale.com?",
          answer: `Buyers can contact dealers and private sellers directly using the enquiry options provided on individual ute listings.`,
        },
        {
          question: "Can I edit my ute listing after publishing?",
          answer: `Yes. Private sellers can manage their advertisements through their seller account, including updating relevant listing details and photographs.`,
        },
        {
          question: "Can dealerships advertise their utes on UtesForSale.com?",
          answer: `Yes. Dealerships can advertise eligible stock through our unified automotive marketplace network, allowing vehicles to appear on relevant websites through a single dealer account.`,
        },
      ],
    },
    {
      label: "General & Buying",
      items: [
        {
          question: "What is a ute?",
          answer: `A ute is a utility vehicle designed to carry passengers and cargo, usually with an open tub or tray. Utes are popular across Australia for work, everyday driving and recreation.`,
        },
        {
          question: "Where can I buy utes in Australia?",
          answer: `Browse <a href="/listings/">new and used utes for sale</a> on UtesForSale.com. Compare available vehicles from dealerships and private sellers across Australia.`,
        },
        {
          question: "What are the different types of utes available in Australia?",
          answer: `Australian utes include single cab, extra cab and dual cab models, with 2WD, 4WD, tub and tray-back configurations. Each offers different passenger, cargo and towing capabilities.`,
        },
        {
          question: "Which ute is best for Australian conditions?",
          answer: `The best ute depends on your driving needs. A 4WD ute may suit regional roads and off-road travel, while a 2WD model can be practical for city driving and everyday work.`,
        },
        {
          question: "Are utes suitable for family use?",
          answer: `Yes. Many dual cab utes offer five seats, modern safety features and comfortable interiors. Compare rear-seat space, child-seat compatibility and safety ratings before buying.`,
        },
        {
          question: "What should I consider when buying a ute?",
          answer: `Consider your budget, intended use, cab type, drivetrain, payload, towing capacity and running costs. For used utes, also check kilometres travelled, service history and mechanical condition.`,
        },
        {
          question: "How do I compare different utes before buying?",
          answer: `Compare price, make, model, year, kilometres, engine, transmission, cab type and towing capacity. Use the search filters on UtesForSale.com to narrow your options.`,
        },
        {
          question: "Is it better to buy a new or used ute?",
          answer: `New utes offer current features and applicable manufacturer warranties, while used utes generally cost less. Compare available models to find the best option for your budget and requirements.`,
        },
        {
          question: "Can I buy a ute directly from a private seller?",
          answer: `Yes. UtesForSale.com includes advertisements from private sellers, allowing buyers to contact owners directly. Always verify vehicle details and arrange an inspection before purchasing.`,
        },
        {
          question: "What should I check before buying a ute?",
          answer: `Check the engine, transmission, tyres, suspension, chassis and service history. For used vehicles, confirm registration details, conduct a PPSR check and consider an independent inspection.`,
        },
      ],
    },
  ],
};

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/** FAQPage node for the home page's JSON-LD @graph (layout.tsx) — every tab's
 * questions in one mainEntity list, with answers reduced to the plain text
 * schema.org expects. */
export function buildHomeFaqJsonLd(categories: FaqCategory[]) {
  return {
    "@type": "FAQPage",
    "@id": `${site.url}/#faq`,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: categories.flatMap((c) => c.items).map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: stripHtml(item.answer),
      },
    })),
  };
}
