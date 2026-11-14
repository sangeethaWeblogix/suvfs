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
const DEALER = portalLinks.dealer;

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
  suv: [
    {
      label: "New, Used & Prices",
      items: [
        {
          question: "Where can I buy new SUVs in Australia?",
          answer: `Browse <a href="/listings/new-condition/">new SUVs for sale</a> on SUVForSale.com.au. Compare available models from Australian dealerships by make, price, seating capacity, fuel type and location.`,
        },
        {
          question: "Where can I find used SUVs for sale?",
          answer: `Explore <a href="/listings/used-condition/">used SUVs for sale</a> across Australia. Compare second-hand vehicles from dealerships and private sellers by price, age, condition, kilometres and features.`,
        },
        {
          question: "Should I buy a new or used SUV?",
          answer: `New SUVs offer current technology and applicable manufacturer warranties, while used SUVs generally cost less. Compare purchase prices, vehicle condition, features and ongoing expenses before deciding.`,
        },
        {
          question: "How much does a new SUV cost in Australia?",
          answer: `New SUV prices vary from under $30,000 for some entry-level models to over $100,000 for premium and luxury vehicles. Prices depend on brand, size, drivetrain and features.`,
        },
        {
          question: "How much does a used SUV cost?",
          answer: `Used SUV prices range from under $10,000 for some older vehicles to over $80,000 for newer luxury models. Age, kilometres, condition, brand and features influence asking prices.`,
        },
        {
          question: "Where can I find SUVs under $20,000?",
          answer: `Browse <a href="/listings/between-10000-20000/">SUVs between $10,000 and $20,000</a> and lower price ranges on SUVForSale.com.au. Compare affordable used models by condition, age and kilometres.`,
        },
        {
          question: "Where can I find SUVs under $30,000?",
          answer: `Explore <a href="/listings/between-20000-30000/">SUVs between $20,000 and $30,000</a> or select a lower budget. Compare compact, medium and family SUVs from different manufacturers.`,
        },
        {
          question: "What factors affect SUV resale value?",
          answer: `Resale value depends on brand, model, age, kilometres, condition, service history and buyer demand. Fuel economy, safety features, warranty coverage and accident history can also influence value.`,
        },
      ],
    },
    {
      label: "SUV Brands",
      items: [
        {
          question: "What are the most popular SUV brands in Australia?",
          answer: `Popular SUV brands include Toyota, Mazda, Hyundai, Kia, Mitsubishi, Nissan, Subaru, BMW and Mercedes-Benz. Compare available models, specifications and prices to find a suitable SUV.`,
        },
        {
          question: "Where can I find Toyota SUVs for sale?",
          answer: `Browse <a href="/listings/toyota/">Toyota SUVs for sale</a>, including available RAV4, Corolla Cross, Kluger, Yaris Cross, Prado and LandCruiser models.`,
        },
        {
          question: "Where can I find Mazda SUVs for sale?",
          answer: `Explore <a href="/listings/mazda/">Mazda SUVs for sale</a>, including popular models such as the CX-3, CX-5, CX-30, CX-60 and CX-90.`,
        },
        {
          question: "Where can I find Hyundai SUVs for sale?",
          answer: `Browse <a href="/listings/hyundai/">Hyundai SUVs for sale</a>, including the Kona, Tucson, Santa Fe, Palisade and electric SUV options.`,
        },
        {
          question: "Where can I find Kia SUVs for sale?",
          answer: `Find <a href="/listings/kia/">Kia SUVs for sale</a>, including the Seltos, Sportage, Sorento, EV3, EV5 and EV9. Compare available petrol, diesel, hybrid and electric models.`,
        },
        {
          question: "Where can I find BMW SUVs for sale?",
          answer: `Browse available BMW SUVs on SUVForSale.com.au, including models such as the X1, X3, X5, X6 and electric iX range. Compare prices, condition and features.`,
        },
        {
          question: "Where can I find Mercedes-Benz SUVs for sale?",
          answer: `Explore Mercedes-Benz SUV listings on SUVForSale.com.au, including GLA, GLB, GLC, GLE and GLS models. Compare available luxury, family and electric options.`,
        },
      ],
    },
    {
      label: "SUV Sizes, Seating & Features",
      items: [
        {
          question: "Where can I find compact SUVs for sale?",
          answer: `Browse <a href="/listings/small-body-size/">small SUVs for sale</a>, including available Toyota Yaris Cross, Mazda CX-3, Hyundai Kona and Kia Stonic models.`,
        },
        {
          question: "What are the best midsize SUVs in Australia?",
          answer: `Popular medium SUVs include the Toyota RAV4, Mazda CX-5, Hyundai Tucson, Kia Sportage and Honda CR-V. Browse <a href="/listings/medium-body-size/">medium SUVs for sale</a> to compare.`,
        },
        {
          question: "Where can I find large SUVs for sale?",
          answer: `Explore <a href="/listings/large-body-size/">large SUVs for sale</a>, including models suited to families needing additional seating, boot space and towing capability.`,
        },
        {
          question: "What is a crossover SUV?",
          answer: `A crossover SUV generally combines SUV styling and practicality with a passenger-car-based platform. Crossovers are often designed for everyday road driving rather than demanding off-road conditions.`,
        },
        {
          question: "Where can I find coupe SUVs for sale?",
          answer: `Coupe-style SUVs feature a more sloping roofline and sportier appearance. Examples include the BMW X4, BMW X6 and Mercedes-Benz GLC Coupe, subject to availability.`,
        },
        {
          question: "What are the best luxury SUVs in Australia?",
          answer: `Luxury SUVs include models from BMW, Mercedes-Benz, Audi, Lexus, Volvo and Porsche. Compare comfort, technology, interior space, performance and running costs before choosing.`,
        },
        {
          question: "Where can I find 7-seater SUVs for sale?",
          answer: `Browse <a href="/listings/7-seats/">7-seater SUVs for sale</a>, including available Kia Sorento, Hyundai Santa Fe, Toyota Kluger, Mazda CX-90 and Ford Everest models.`,
        },
        {
          question: "What are the best 5-seater SUVs for families?",
          answer: `Popular family options include the Toyota RAV4, Mazda CX-5, Hyundai Tucson and Kia Sportage. Compare rear-seat comfort, child-seat compatibility, boot space and safety features.`,
        },
        {
          question: "What safety features should I look for in an SUV?",
          answer: `Look for autonomous emergency braking, blind-spot monitoring, lane-keeping assistance, reversing cameras and suitable child-seat anchors. Check the model's applicable ANCAP safety rating and assessment year.`,
        },
      ],
    },
    {
      label: "Hybrid & Electric SUVs",
      items: [
        {
          question: "Where can I find hybrid SUVs for sale?",
          answer: `SUVForSale.com.au features hybrid SUVs from brands such as Toyota, Hyundai, Kia, Honda and GWM. Use the Fuel Type filter to browse available hybrid models.`,
        },
        {
          question: "Where can I find electric SUVs for sale?",
          answer: `Browse electric SUVs on SUVForSale.com.au using the Electric fuel-type filter. Compare models from Tesla, BYD, Hyundai, Kia, BMW and other manufacturers.`,
        },
        {
          question: "Where can I find plug-in hybrid SUVs for sale?",
          answer: `Use the Plug-in Hybrid fuel-type filter on SUVForSale.com.au to explore models such as the Mitsubishi Outlander PHEV, Kia Sorento PHEV and BYD Sealion 6.`,
        },
        {
          question: "What is the difference between hybrid and plug-in hybrid SUVs?",
          answer: `Conventional hybrids recharge their batteries through the engine and regenerative braking. Plug-in hybrids have larger batteries that can also be charged externally, allowing more electric-only driving.`,
        },
        {
          question: "What are the benefits of owning a hybrid SUV?",
          answer: `Hybrid SUVs can reduce fuel consumption, particularly in stop-start traffic. They offer petrol-engine flexibility with electric assistance, although savings depend on the model and driving conditions.`,
        },
        {
          question: "Are electric SUVs suitable for long-distance driving?",
          answer: `Yes. Many electric SUVs support long-distance travel, provided their range and charging needs suit your route. Consider battery range, charging speed and charger availability.`,
        },
        {
          question: "Which SUV manufacturers offer electric and hybrid models?",
          answer: `Toyota, Hyundai, Kia, BYD, BMW, Mercedes-Benz, MG and several other manufacturers offer hybrid or electric SUVs. Compare available models by fuel type, range, features and price.`,
        },
      ],
    },
    {
      label: "AWD, 4WD & Towing",
      items: [
        {
          question: "Where can I find 4WD SUVs for sale?",
          answer: `Browse <a href="/listings/four-wheel-drive-drive-type/">4WD SUVs for sale</a>, including available Toyota LandCruiser Prado, Ford Everest, Isuzu MU-X and Mitsubishi Pajero Sport models.`,
        },
        {
          question: "Where can I find AWD SUVs for sale?",
          answer: `Explore <a href="/listings/all-wheel-drive-drive-type/">AWD SUVs for sale</a>, including models designed to provide additional traction across varying road conditions.`,
        },
        {
          question: "What is the difference between 4WD and AWD SUVs?",
          answer: `AWD systems generally distribute power automatically between wheels, while traditional 4WD systems often offer selectable driving modes or low-range gearing. Actual capabilities vary by vehicle.`,
        },
        {
          question: "Which SUVs are suitable for off-road driving?",
          answer: `Models such as the Toyota LandCruiser Prado, Ford Everest, Isuzu MU-X and Mitsubishi Pajero Sport offer off-road-focused variants. Check ground clearance, tyres, suspension and 4WD specifications.`,
        },
        {
          question: "What are the best SUVs for towing caravans?",
          answer: `SUVs such as the Ford Everest, Toyota LandCruiser Prado and Isuzu MU-X are commonly considered for caravan towing. Check braked towing capacity, towball download, GVM and GCM limits.`,
        },
        {
          question: "Which SUVs offer the highest towing capacity?",
          answer: `Some larger SUVs offer braked towing capacities around 3,000–3,500kg, depending on model and variant. Always check manufacturer ratings and the vehicle's permitted combined weight.`,
        },
        {
          question: "Are diesel SUVs suitable for towing?",
          answer: `Diesel SUVs can suit towing because many offer strong low-speed torque and practical touring range. Check the specific vehicle's towing limits, payload and service requirements.`,
        },
      ],
    },
    {
      label: "SUVs for Sale by Location",
      items: [
        {
          question: "Where can I find SUVs for sale in Sydney?",
          answer: `Browse <a href="/listings/new-south-wales-state/sydney-region/">SUVs for sale in Sydney</a> on SUVForSale.com.au. Compare new, used and demo models from dealers and private sellers.`,
        },
        {
          question: "Where can I find SUVs for sale in Melbourne?",
          answer: `Explore <a href="/listings/victoria-state/melbourne-region/">SUVs for sale in Melbourne</a> and filter available vehicles by make, price, condition, fuel type and seating capacity.`,
        },
        {
          question: "Where can I find SUVs for sale in Brisbane?",
          answer: `Browse <a href="/listings/queensland-state/brisbane-region/">SUVs for sale in Brisbane</a> and compare available small, medium, large, hybrid and electric SUVs.`,
        },
        {
          question: "Where can I find SUVs for sale in Perth?",
          answer: `Find <a href="/listings/western-australia-state/perth-region/">SUVs for sale in Perth</a> and compare available models, prices, features and specifications.`,
        },
        {
          question: "Where can I find SUVs for sale in Adelaide?",
          answer: `Browse <a href="/listings/south-australia-state/adelaide-region/">SUVs for sale in Adelaide</a> and compare new, used and demo vehicles advertised by dealers and private sellers.`,
        },
        {
          question: "How can I find SUVs for sale near me?",
          answer: `Use the location filters on SUVForSale.com.au to search by state, city or region. Narrow results by price, make, condition and features.`,
        },
      ],
    },
    {
      label: "Selling an SUV",
      items: [
        {
          question: "How do I sell my SUV online in Australia?",
          answer: `You can <a href="${SELL}">sell your car online</a> through our unified marketplace for $49 including GST. Your SUV is advertised across relevant automotive marketplaces until sold.`,
        },
        {
          question: "Can private owners advertise SUVs for sale?",
          answer: `Yes. Private owners can create an advertisement through SellMyCarOnline.au, allowing eligible SUVs to appear on SUVForSale.com.au and other relevant marketplace websites.`,
        },
        {
          question: "How much does it cost to advertise an SUV?",
          answer: `Private sellers pay a one-time fee of $49 including GST through SellMyCarOnline.au. Your advertisement stays live until sold, with no monthly listing charges or sales commission.`,
        },
        {
          question: "Will my SUV be advertised across multiple marketplaces?",
          answer: `Yes. When you list through SellMyCarOnline.au, your SUV is automatically advertised on relevant websites within our automotive network based on its vehicle attributes.`,
        },
        {
          question: "Can dealerships advertise their SUV inventory?",
          answer: `Yes. Dealerships can advertise eligible SUV stock through our unified marketplace network, allowing vehicles to appear on relevant websites through a single dealer account.`,
        },
        {
          question: "What information should I include in my SUV advertisement?",
          answer: `Include the make, model, year, kilometres, condition, asking price, fuel type, transmission and features. Add clear interior and exterior photos, plus available service history.`,
        },
        {
          question: "How do I determine the resale price of my SUV?",
          answer: `Compare similar SUVs by make, model, year, kilometres, condition and features. Review current asking prices on SUVForSale.com.au to estimate a competitive selling price.`,
        },
      ],
    },
    {
      label: "General & Buying",
      items: [
        {
          question: "Where can I find SUVs for sale in Australia?",
          answer: `Browse <a href="/listings/">new and used SUVs for sale</a> on SUVForSale.com.au. Compare vehicles from dealerships and private sellers across Australia by price, make, model, location and specifications.`,
        },
        {
          question: "What are the most popular SUVs in Australia?",
          answer: `Popular SUVs include the Toyota RAV4, Mazda CX-5, Hyundai Tucson, Kia Sportage, Mitsubishi Outlander and Toyota Kluger. Compare available models based on size, features, fuel economy and budget.`,
        },
        {
          question: "What types of SUVs are available in Australia?",
          answer: `SUVs are available in small, medium and large sizes, including family, luxury, crossover, hybrid, electric and 4WD models. Each offers different seating, storage and driving capabilities.`,
        },
        {
          question: "What is the difference between an SUV and an ordinary car?",
          answer: `SUVs generally offer higher seating positions, increased ground clearance and more versatile cargo space than conventional sedans or hatchbacks. However, size and driving capabilities vary between models.`,
        },
        {
          question: "Which SUVs are best for everyday driving?",
          answer: `Compact and medium SUVs such as the Toyota Corolla Cross, Mazda CX-5, Hyundai Kona and Kia Sportage can suit everyday driving. Consider fuel economy, comfort, parking and safety features.`,
        },
        {
          question: "What should I consider before buying an SUV?",
          answer: `Consider your budget, passenger requirements, boot space, fuel type, safety features and running costs. For used SUVs, also check service history, kilometres travelled and mechanical condition.`,
        },
        {
          question: "How can I compare different SUVs for sale?",
          answer: `Compare SUVs by make, model, year, price, kilometres, fuel type, transmission, drivetrain, seating capacity and features. Use the search filters on SUVForSale.com.au to narrow your choices.`,
        },
        {
          question: "Are SUVs available from private sellers and dealers?",
          answer: `Yes. SUVForSale.com.au features new, used and demo SUVs advertised by Australian dealerships and private sellers, allowing buyers to compare options and contact advertisers directly.`,
        },
        {
          question: "How do I contact an SUV seller?",
          answer: `Select an SUV listing on SUVForSale.com.au and use the available enquiry options to contact the dealership or private seller directly about inspections, availability and purchasing.`,
        },
      ],
    },
  ],
  "4wd": [
    {
      label: "New, Used & Prices",
      items: [
        {
          question: "Where can I buy new 4WD vehicles in Australia?",
          answer: `Browse <a href="/listings/new-condition/">new 4WDs for sale</a> on 4WDForSale.com.au. Compare available models from Australian dealerships by make, price, seating and specifications.`,
        },
        {
          question: "Where can I find used 4WDs for sale?",
          answer: `Explore <a href="/listings/used-condition/">used 4WDs for sale</a> across Australia. Compare second-hand SUVs and wagons from dealerships and private sellers by price, age, condition and kilometres.`,
        },
        {
          question: "Is it better to buy a new or used 4WD?",
          answer: `New 4WDs offer current features and applicable manufacturer warranties, while used 4WDs generally cost less. Compare vehicle condition, reliability, capabilities and running costs before deciding.`,
        },
        {
          question: "How much does a new 4WD cost in Australia?",
          answer: `Some new 4WD SUVs are advertised from around $45,000, while premium off-road wagons can exceed $100,000. Prices vary by brand, model, drivetrain and features.`,
        },
        {
          question: "How much does a used 4WD cost?",
          answer: `Used 4WDs can cost under $20,000 for some older models, while newer premium vehicles may exceed $80,000. Age, condition, kilometres and modifications influence asking prices.`,
        },
        {
          question: "Where can I find 4WDs under $20,000?",
          answer: `Browse <a href="/listings/between-10000-20000/">4WDs between $10,000 and $20,000</a> and lower price ranges. Compare affordable used models by age, condition and mechanical history.`,
        },
        {
          question: "Where can I find 4WDs under $30,000?",
          answer: `Explore <a href="/listings/between-20000-30000/">4WDs between $20,000 and $30,000</a> or select a lower budget. Compare available SUVs and wagons from different manufacturers.`,
        },
        {
          question: "What should I check before buying a used 4WD?",
          answer: `Inspect the engine, transmission, transfer case, differential, suspension, chassis and underbody. Check for off-road damage, review service records and conduct a PPSR search before purchasing.`,
        },
      ],
    },
    {
      label: "4WD Brands",
      items: [
        {
          question: "What are the most popular 4WD brands in Australia?",
          answer: `Well-known 4WD brands include Toyota, Nissan, Ford, Mitsubishi, Isuzu, Land Rover, Suzuki and GWM. Compare individual models for reliability, off-road capability and towing requirements.`,
        },
        {
          question: "Where can I find Toyota 4WDs for sale?",
          answer: `Browse <a href="/listings/toyota/">Toyota 4WDs for sale</a>, including available LandCruiser, Prado and other four-wheel-drive models from dealerships and private sellers.`,
        },
        {
          question: "Where can I find Nissan 4WDs for sale?",
          answer: `Explore <a href="/listings/nissan/">Nissan 4WDs for sale</a>, including available Patrol, Pathfinder and X-TRAIL models. Compare drivetrain, seating, price and specifications.`,
        },
        {
          question: "Where can I find Ford 4WDs for sale?",
          answer: `Browse <a href="/listings/ford/">Ford 4WDs for sale</a>, including available Everest models suited to family travel, towing and selected off-road conditions.`,
        },
        {
          question: "Where can I find Mitsubishi 4WDs for sale?",
          answer: `Explore <a href="/listings/mitsubishi/">Mitsubishi 4WDs for sale</a>, including Pajero and Pajero Sport models. Compare available vehicles by condition, price and features.`,
        },
        {
          question: "Where can I find Isuzu 4WDs for sale?",
          answer: `Browse <a href="/listings/isuzu/">Isuzu 4WDs for sale</a>, including available MU-X models designed for family transport, towing and recreational travel.`,
        },
        {
          question: "Are GWM 4WDs suitable for off-road driving?",
          answer: `GWM offers off-road-focused models such as the Tank 300 and Tank 500. Compare <a href="/listings/gwm/">GWM 4WDs for sale</a> by drivetrain, ground clearance, features and price.`,
        },
      ],
    },
    {
      label: "4WD Types & Seating",
      items: [
        {
          question: "Where can I find 4WD SUVs for sale?",
          answer: `Browse <a href="/listings/suv-body-type/">4WD SUVs for sale</a> on 4WDForSale.com.au. Compare available models by make, price, condition, seating capacity and features.`,
        },
        {
          question: "Where can I find 4WD wagons for sale?",
          answer: `Explore <a href="/listings/wagon-body-type/">4WD wagons for sale</a>, including available models suited to family travel, long-distance touring and off-road adventures.`,
        },
        {
          question: "Where can I find 4WD utes for sale?",
          answer: `Browse <a href="https://www.4x4forsale.com.au/">4x4s for sale</a> across Australia to compare four-wheel-drive utes, SUVs and other vehicle types within our automotive marketplace network.`,
        },
        {
          question: "What is the difference between a 4WD SUV and a 4WD ute?",
          answer: `4WD SUVs generally provide enclosed passenger and cargo space, while 4WD utes have a separate tub or tray. Both can offer towing and off-road capability, depending on the model.`,
        },
        {
          question: "Where can I find 7-seater 4WDs for sale?",
          answer: `Browse <a href="/listings/7-seats/">7-seater 4WDs for sale</a>, including available Ford Everest, Toyota Prado, Isuzu MU-X and other family-oriented models.`,
        },
        {
          question: "What are the best small 4WD vehicles in Australia?",
          answer: `The Suzuki Jimny is a popular compact off-road 4WD. When choosing a smaller vehicle, compare ground clearance, low-range capability, passenger space, payload and everyday comfort.`,
        },
      ],
    },
    {
      label: "Fuel Types & Powertrains",
      items: [
        {
          question: "Where can I find diesel 4WDs for sale?",
          answer: `Browse <a href="/listings/diesel-fuel-type/">diesel 4WDs for sale</a> on 4WDForSale.com.au. Compare available models by price, age, seating, condition and specifications.`,
        },
        {
          question: "Where can I find petrol 4WDs for sale?",
          answer: `Explore <a href="/listings/petrol-fuel-type/">petrol 4WDs for sale</a>, including available SUVs and wagons suited to everyday driving, family travel and touring.`,
        },
        {
          question: "Where can I find hybrid 4WDs for sale?",
          answer: `Browse <a href="/listings/hybrid-fuel-type/">hybrid 4WDs for sale</a> and compare available models combining petrol engines with electric assistance. Check the drivetrain and off-road capabilities of individual vehicles.`,
        },
        {
          question: "Are electric 4WD vehicles available in Australia?",
          answer: `Yes. Some electric SUVs use dual-motor or other four-wheel-drive systems. However, electric all-wheel traction does not necessarily provide the low-range gearing or clearance needed for demanding off-road driving.`,
        },
        {
          question: "What is the difference between petrol and diesel 4WDs?",
          answer: `Diesel 4WDs often provide strong low-speed torque and practical touring range, while petrol models may offer smoother performance. Compare fuel consumption, servicing costs and towing requirements.`,
        },
      ],
    },
    {
      label: "Off-Road, Touring & Towing",
      items: [
        {
          question: "What is the difference between a 4WD and an AWD vehicle?",
          answer: `Both can distribute power to four wheels. Traditional 4WD systems often provide additional off-road features such as low-range gearing, while AWD systems commonly prioritise road traction. Capabilities vary by model.`,
        },
        {
          question: "What is the difference between high-range and low-range 4WD?",
          answer: `High-range 4WD provides additional traction for normal-speed driving on suitable surfaces. Low-range gearing increases torque multiplication for slow, controlled driving over steep or challenging terrain.`,
        },
        {
          question: "Which 4WDs are best for off-road driving?",
          answer: `Models such as the Toyota LandCruiser, Nissan Patrol, Ford Everest and Mitsubishi Pajero Sport offer off-road-capable variants. Compare ground clearance, low-range gearing, traction systems and tyres.`,
        },
        {
          question: "What are the best 4WDs for Australian outback adventures?",
          answer: `Choose a 4WD with suitable ground clearance, reliability, payload, fuel range and off-road capability. Toyota LandCruiser, Nissan Patrol and other touring-focused models are popular options.`,
        },
        {
          question: "Which 4WDs are suitable for long-distance touring?",
          answer: `A touring 4WD should offer comfortable seating, practical storage, adequate payload and reliable performance. Consider fuel range, servicing availability and towing needs for remote travel.`,
        },
        {
          question: "Which 4WDs offer the best ground clearance?",
          answer: `Ground clearance varies by model, variant, tyres and suspension. Dedicated off-road 4WDs generally offer more clearance than road-focused SUVs. Check manufacturer specifications before choosing.`,
        },
        {
          question: "What are the best 4WDs for towing caravans?",
          answer: `The Toyota LandCruiser, Nissan Patrol, Ford Everest and Isuzu MU-X are commonly considered for towing. Compare braked towing capacity, towball download, GVM and GCM limits.`,
        },
        {
          question: "What features improve 4WD off-road performance?",
          answer: `Useful features include low-range gearing, differential locks, suitable tyres, ground clearance, underbody protection and traction-control systems. Driving technique and vehicle weight also affect off-road performance.`,
        },
      ],
    },
    {
      label: "Accessories & Ownership",
      items: [
        {
          question: "What accessories are essential for a 4WD?",
          answer: `Useful accessories may include all-terrain tyres, recovery equipment, a tyre compressor, underbody protection and additional storage. Choose equipment that suits your destinations and vehicle.`,
        },
        {
          question: "What recovery equipment should every 4WD owner carry?",
          answer: `Recovery equipment may include rated recovery points, suitable recovery gear, a tyre compressor and a shovel. Use equipment compatible with your vehicle and obtain proper recovery training.`,
        },
        {
          question: "Are bull bars and snorkels useful for off-road driving?",
          answer: `Bull bars can provide frontal protection, while properly installed snorkels may help protect the engine's air intake in dusty conditions. Check compatibility, legal requirements and installation quality.`,
        },
        {
          question: "Are 4WD suspension upgrades worth considering?",
          answer: `Suspension upgrades may improve load handling or ground clearance when properly selected. However, modifications can affect ride comfort, handling, vehicle compliance and warranty coverage.`,
        },
        {
          question: "What accessories are useful for 4WD camping and touring?",
          answer: `Popular touring accessories include roof racks, drawers, portable refrigerators, awnings, dual-battery systems and camping equipment. Consider payload limits and weight distribution when adding accessories.`,
        },
      ],
    },
    {
      label: "4WDs for Sale by Location",
      items: [
        {
          question: "Where can I find 4WDs for sale in Sydney?",
          answer: `Browse <a href="/listings/new-south-wales-state/sydney-region/">4WDs for sale in Sydney</a> on 4WDForSale.com.au. Compare new, used and demo vehicles from dealers and private sellers.`,
        },
        {
          question: "Where can I find 4WDs for sale in Melbourne?",
          answer: `Explore <a href="/listings/victoria-state/melbourne-region/">4WDs for sale in Melbourne</a> and compare available SUVs and wagons by make, model, price and condition.`,
        },
        {
          question: "Where can I find 4WDs for sale in Brisbane?",
          answer: `Browse <a href="/listings/queensland-state/brisbane-region/">4WDs for sale in Brisbane</a> and compare available models suited to everyday driving, family use and touring.`,
        },
        {
          question: "Where can I find 4WDs for sale in Perth?",
          answer: `Find <a href="/listings/western-australia-state/perth-region/">4WDs for sale in Perth</a> and compare vehicles by price, make, condition, seating and specifications.`,
        },
        {
          question: "Where can I find 4WDs for sale in Adelaide?",
          answer: `Browse <a href="/listings/south-australia-state/adelaide-region/">4WDs for sale in Adelaide</a> on 4WDForSale.com.au, including available new and used models.`,
        },
        {
          question: "How can I find 4WDs for sale near me?",
          answer: `Use the location filters on 4WDForSale.com.au to browse vehicles in your state, city or region. Narrow results by price, make, condition and features.`,
        },
      ],
    },
    {
      label: "Selling a 4WD",
      items: [
        {
          question: "How do I sell my 4WD online in Australia?",
          answer: `You can <a href="${SELL}">sell your car online</a> through our unified marketplace for $49 including GST. Your eligible 4WD is advertised across relevant automotive marketplaces until sold.`,
        },
        {
          question: "Where can I advertise my 4WD for sale?",
          answer: `Advertise through SellMyCarOnline.au. Create one listing and your 4WD can appear on 4WDForSale.com.au and other relevant automotive marketplaces.`,
        },
        {
          question: "How much does it cost to advertise a 4WD?",
          answer: `Private sellers pay a one-time fee of $49 including GST through SellMyCarOnline.au. Your advertisement stays live until sold, with no monthly listing fees or sales commission.`,
        },
        {
          question: "Can private owners advertise 4WDs for sale?",
          answer: `Yes. Private owners can list eligible vehicles through SellMyCarOnline.au and receive enquiries directly from interested buyers without using a dealership.`,
        },
        {
          question: "Can dealerships advertise their 4WD inventory?",
          answer: `Yes. Dealerships can <a href="${DEALER}">advertise across our automotive marketplace network</a>, with eligible 4WD stock automatically displayed on relevant websites through a single dealer account.`,
        },
        {
          question: "How do I determine the resale price of my 4WD?",
          answer: `Compare similar 4WDs by make, model, year, kilometres, condition and modifications. Review current asking prices on 4WDForSale.com.au to estimate a competitive selling price.`,
        },
        {
          question: "What information should I include in a 4WD advertisement?",
          answer: `Include the make, model, year, kilometres, condition, price, drivetrain and service history. Highlight towing capacity, accessories and modifications, with clear interior, exterior and underbody photographs.`,
        },
      ],
    },
    {
      label: "General & Buying",
      items: [
        {
          question: "Where can I find 4WD vehicles for sale in Australia?",
          answer: `Browse <a href="/listings/">new and used 4WDs for sale</a> on 4WDForSale.com.au. Compare available SUVs and wagons from dealerships and private sellers across Australia.`,
        },
        {
          question: "What are the most popular 4WDs in Australia?",
          answer: `Popular 4WD models include the Toyota LandCruiser Prado, Nissan Patrol, Ford Everest, Isuzu MU-X and Mitsubishi Pajero Sport. Compare available models by price, features and capability.`,
        },
        {
          question: "What types of 4WD vehicles are available in Australia?",
          answer: `4WD vehicles include SUVs, wagons and utes, ranging from family-focused models to dedicated off-road vehicles. 4WDForSale.com.au primarily features 4WD SUVs and wagons.`,
        },
        {
          question: "What are the best 4WD vehicles for Australian conditions?",
          answer: `The best 4WD depends on your destinations and driving needs. Consider ground clearance, low-range gearing, reliability, towing capacity and comfort for Australian roads and off-road conditions.`,
        },
        {
          question: "Which 4WDs are suitable for everyday driving?",
          answer: `Models such as the Ford Everest, Toyota Prado, Isuzu MU-X and Mitsubishi Pajero Sport can combine everyday comfort with touring capability. Compare fuel economy, safety and parking practicality.`,
        },
        {
          question: "What should I consider before buying a 4WD?",
          answer: `Consider your budget, intended use, drivetrain, ground clearance, towing capacity, seating and running costs. For used 4WDs, check service history, mechanical condition and previous off-road use.`,
        },
        {
          question: "How can I compare different 4WDs for sale?",
          answer: `Compare 4WDs by make, model, year, price, kilometres, fuel type, transmission, seating and features. Use the search filters on 4WDForSale.com.au to narrow your options.`,
        },
        {
          question: "Are 4WDs available from private sellers and dealers?",
          answer: `Yes. 4WDForSale.com.au features new, used and demo 4WDs advertised by Australian dealerships and private sellers. Buyers can compare available vehicles and contact advertisers directly.`,
        },
      ],
    },
  ],
  "4x4": [
    {
      label: "New, Used & Prices",
      items: [
        {
          question: "Where can I find new 4x4s for sale in Australia?",
          answer: `Browse <a href="/listings/new-condition/">new 4x4s for sale</a> on 4x4ForSale.com.au. Compare available utes, SUVs and wagons from Australian dealerships.`,
        },
        {
          question: "Where can I find used 4x4s for sale?",
          answer: `Explore <a href="/listings/used-condition/">used 4x4s for sale</a> across Australia. Compare second-hand vehicles from dealerships and private sellers by price, condition, age and kilometres.`,
        },
        {
          question: "Is it better to buy a new or used 4x4?",
          answer: `New 4x4s offer current features and applicable manufacturer warranties, while used models generally cost less. Compare condition, reliability, off-road capability and running costs before deciding.`,
        },
        {
          question: "How much does a 4x4 cost in Australia?",
          answer: `4x4 prices vary from under $20,000 for some older used vehicles to over $100,000 for premium models. Brand, age, condition, specifications and modifications influence prices.`,
        },
        {
          question: "Where can I find 4x4s under $20,000?",
          answer: `Browse <a href="/listings/between-10000-20000/">4x4s between $10,000 and $20,000</a> or lower price ranges. Compare affordable used vehicles by age, condition, kilometres and service history.`,
        },
        {
          question: "Where can I find cheap 4x4s for sale?",
          answer: `Explore <a href="/listings/under-10000/">4x4s under $10,000</a> and other budget categories on 4x4ForSale.com.au. Consider servicing, mechanical condition and potential repair costs before purchasing.`,
        },
        {
          question: "What should I check before buying a used 4x4?",
          answer: `Inspect the engine, transmission, transfer case, suspension, chassis and underbody. Check for corrosion, off-road damage, accident history and modifications. Review service records and conduct a PPSR search.`,
        },
        {
          question: "Are second-hand 4x4s worth buying?",
          answer: `Used 4x4s can offer good value, particularly when properly maintained. Check their mechanical condition, previous use, service history and any modifications before purchasing.`,
        },
        {
          question: "Can I get finance to buy a new or used 4x4?",
          answer: `Yes. Banks and specialist vehicle lenders may offer finance for new and used 4x4s, subject to eligibility. Compare interest rates, fees, loan terms and repayments.`,
        },
      ],
    },
    {
      label: "4x4 Brands & Models",
      items: [
        {
          question: "Where can I find Toyota 4x4s for sale?",
          answer: `Browse <a href="/listings/toyota/">Toyota 4x4s for sale</a>, including available HiLux, LandCruiser, Prado and other four-wheel-drive models from Australian dealerships and private sellers.`,
        },
        {
          question: "Where can I find Ford 4x4s for sale?",
          answer: `Explore <a href="/listings/ford/">Ford 4x4s for sale</a>, including Ranger, Ranger Raptor and Everest models suited to work, towing, touring and recreation.`,
        },
        {
          question: "Where can I find Mitsubishi 4x4s for sale?",
          answer: `Browse <a href="/listings/mitsubishi/">Mitsubishi 4x4s for sale</a>, including available Triton, Pajero and Pajero Sport models. Compare prices, condition and specifications.`,
        },
        {
          question: "Where can I find Nissan 4x4s for sale?",
          answer: `Explore <a href="/listings/nissan/">Nissan 4x4s for sale</a>, including Patrol, Navara and other available models. Compare drivetrain, towing capacity, seating and features.`,
        },
        {
          question: "Where can I find Suzuki 4x4s for sale?",
          answer: `Browse <a href="/listings/suzuki/">Suzuki 4x4s for sale</a>, including the compact Jimny and other available four-wheel-drive models suited to different driving needs.`,
        },
        {
          question: "Where can I find Jeep 4x4s for sale?",
          answer: `Explore <a href="/listings/jeep/">Jeep 4x4s for sale</a>, including available Wrangler, Gladiator and Grand Cherokee models. Compare prices, features and off-road specifications.`,
        },
        {
          question: "Where can I find Isuzu 4x4s for sale?",
          answer: `Browse <a href="/listings/isuzu/">Isuzu 4x4s for sale</a>, including available D-MAX utes and MU-X SUVs suited to work, towing and family touring.`,
        },
        {
          question: "Are GWM 4x4s worth considering?",
          answer: `GWM offers 4x4 models such as the Cannon ute and Tank SUV range. Compare <a href="/listings/gwm/">GWM 4x4s for sale</a> by price, warranty, features and off-road capabilities.`,
        },
      ],
    },
    {
      label: "4x4 Types & Sizes",
      items: [
        {
          question: "Where can I find 4x4 utes for sale?",
          answer: `Browse <a href="/listings/ute-body-type/">4x4 utes for sale</a>, including available Toyota HiLux, Ford Ranger, Mitsubishi Triton, Isuzu D-MAX and Nissan Navara models.`,
        },
        {
          question: "Where can I find 4x4 SUVs for sale?",
          answer: `Explore <a href="/listings/suv-body-type/">4x4 SUVs for sale</a>, including models suited to family driving, towing, long-distance touring and recreational adventures.`,
        },
        {
          question: "Where can I find 4x4 wagons for sale?",
          answer: `Browse <a href="/listings/wagon-body-type/">4x4 wagons for sale</a>, including available Toyota LandCruiser, Ford Everest and other touring-focused models.`,
        },
        {
          question: "What are the best small 4x4s in Australia?",
          answer: `The Suzuki Jimny is a popular compact off-road 4x4. When comparing smaller vehicles, consider ground clearance, low-range gearing, passenger space, payload and everyday comfort.`,
        },
        {
          question: "Which 4x4s are suitable for families?",
          answer: `Models such as the Toyota Prado, Ford Everest, Isuzu MU-X and Mitsubishi Pajero Sport offer family-oriented configurations. Compare seating capacity, safety features, boot space and comfort.`,
        },
        {
          question: "Where can I find luxury 4x4s for sale?",
          answer: `Browse premium 4x4s from brands such as Toyota, Land Rover, Mercedes-Benz and Jeep. Compare available models by price, comfort, towing capacity and off-road features.`,
        },
      ],
    },
    {
      label: "Fuel, Off-Road & Performance",
      items: [
        {
          question: "What is the difference between petrol and diesel 4x4s?",
          answer: `Diesel 4x4s often offer strong low-speed torque and practical touring range, while petrol models may provide smoother performance. Compare fuel consumption, servicing costs and towing requirements.`,
        },
        {
          question: "Are hybrid and electric 4x4 vehicles available in Australia?",
          answer: `Yes. Some hybrid and electric vehicles offer four-wheel-drive or AWD systems. However, not all have the low-range gearing or clearance associated with traditional off-road 4x4s.`,
        },
        {
          question: "Are electric 4x4s suitable for off-road driving?",
          answer: `Some electric 4x4s can handle selected off-road conditions. Check ground clearance, traction systems, battery protection, water-crossing limits and available driving range before travelling.`,
        },
        {
          question: "What is the difference between high-range and low-range 4x4?",
          answer: `High-range 4x4 is suited to higher-speed driving where additional traction is needed. Low-range gearing helps provide greater torque multiplication and control over steep or difficult terrain.`,
        },
        {
          question: "Which 4x4s are best for off-road driving?",
          answer: `Popular options include the Toyota LandCruiser, Jeep Wrangler, Suzuki Jimny, Nissan Patrol and Ford Ranger. Compare ground clearance, low-range gearing, differential locks and tyres.`,
        },
        {
          question: "What are the best 4x4s for towing caravans?",
          answer: `The Toyota LandCruiser, Ford Everest, Isuzu MU-X and selected 4x4 utes are commonly considered for towing. Check braked towing capacity, towball download, GVM and GCM.`,
        },
        {
          question: "What features improve 4x4 off-road performance?",
          answer: `Low-range gearing, differential locks, suitable tyres, ground clearance, underbody protection and traction-control systems can improve off-road capability. Vehicle weight and driver experience also matter.`,
        },
        {
          question: "Are automatic or manual 4x4s better for off-road driving?",
          answer: `Both can perform well off-road. Automatics often provide easier low-speed control, while manuals give drivers direct gear selection. The best choice depends on vehicle design and preference.`,
        },
        {
          question: "Are 4x4s suitable for everyday driving?",
          answer: `Yes. Many modern 4x4s offer comfortable interiors, safety technology and practical everyday features. Consider vehicle size, fuel economy, parking requirements and running costs.`,
        },
      ],
    },
    {
      label: "Classic & Modified 4x4s",
      items: [
        {
          question: "Where can I find classic 4x4s for sale in Australia?",
          answer: `Older Toyota LandCruiser, Nissan Patrol, Jeep and Land Rover models are popular with classic 4x4 enthusiasts. Browse used 4x4 listings and filter by make and year.`,
        },
        {
          question: "Are older 4x4s worth buying?",
          answer: `Older 4x4s can offer value and straightforward mechanical designs, but may require additional maintenance. Check corrosion, service history, parts availability and previous modifications.`,
        },
        {
          question: "Where can I find modified 4x4s for sale?",
          answer: `Some used 4x4 listings include vehicles with suspension lifts, upgraded tyres, bull bars and touring equipment. Check each advertisement for modifications and supporting documentation.`,
        },
        {
          question: "What are the benefits of buying a lifted 4x4?",
          answer: `A properly designed suspension lift may improve ground clearance and accommodate suitable tyres. However, lifts can affect handling, vehicle stability, legal compliance and maintenance requirements.`,
        },
        {
          question: "Are modified 4x4s legal in Australia?",
          answer: `Many 4x4 modifications are permitted when they meet applicable state or territory requirements. Suspension lifts, larger tyres and structural changes may require inspection or engineering approval.`,
        },
        {
          question: "Which modifications improve 4x4 off-road performance?",
          answer: `Suitable all-terrain tyres, suspension upgrades, differential locks and underbody protection can improve capability. Choose modifications based on your vehicle's specifications and intended terrain.`,
        },
        {
          question: "What should I check before buying a classic or modified 4x4?",
          answer: `Inspect the chassis, rust, driveline, suspension, tyres and electrical systems. Check modification approvals, service records, roadworthiness and parts availability before purchasing.`,
        },
      ],
    },
    {
      label: "4x4s for Sale by Location",
      items: [
        {
          question: "Where can I find 4x4s for sale in Sydney?",
          answer: `Browse <a href="/listings/new-south-wales-state/sydney-region/">4x4s for sale in Sydney</a> on 4x4ForSale.com.au. Compare new and used utes, SUVs and wagons from dealers and private sellers.`,
        },
        {
          question: "Where can I find 4x4s for sale in Melbourne?",
          answer: `Explore <a href="/listings/victoria-state/melbourne-region/">4x4s for sale in Melbourne</a> and compare available models by price, make, body type, condition and features.`,
        },
        {
          question: "Where can I find 4x4s for sale in Brisbane?",
          answer: `Browse <a href="/listings/queensland-state/brisbane-region/">4x4s for sale in Brisbane</a> and compare available vehicles suited to work, family use, touring and off-road recreation.`,
        },
        {
          question: "Where can I find 4x4s for sale in Perth?",
          answer: `Find <a href="/listings/western-australia-state/perth-region/">4x4s for sale in Perth</a> and compare available utes, SUVs and wagons by price, condition and specifications.`,
        },
        {
          question: "Where can I find 4x4s for sale in Adelaide?",
          answer: `Browse <a href="/listings/south-australia-state/adelaide-region/">4x4s for sale in Adelaide</a> on 4x4ForSale.com.au. Compare available vehicles from dealers and private sellers.`,
        },
        {
          question: "Can I buy a 4x4 from another state in Australia?",
          answer: `Yes. You can contact interstate sellers and arrange inspections or transport. Check registration transfer requirements, roadworthy certificates, delivery costs and vehicle condition before purchasing.`,
        },
      ],
    },
    {
      label: "Selling & Our Marketplace",
      items: [
        {
          question: "How do I sell my 4x4 online in Australia?",
          answer: `You can <a href="${SELL}">sell your car online</a> through our unified marketplace for $49 including GST. Your eligible 4x4 is advertised across relevant automotive marketplaces until sold.`,
        },
        {
          question: "How much does it cost to advertise a 4x4?",
          answer: `Private sellers pay a one-time fee of $49 including GST through SellMyCarOnline.au, with no monthly listing fees or commission on the sale.`,
        },
        {
          question: "How long will my 4x4 advertisement stay online?",
          answer: `Your private seller advertisement remains live until your vehicle is sold. There are no recurring monthly listing charges.`,
        },
        {
          question: "Will my 4x4 be advertised across multiple marketplaces?",
          answer: `Yes. When you list through SellMyCarOnline.au, eligible vehicles are automatically advertised across relevant automotive marketplaces within our network, based on their attributes.`,
        },
        {
          question: "How do I determine the resale price of my 4x4?",
          answer: `Compare similar vehicles by make, model, year, kilometres, condition and modifications. Review advertised prices on 4x4ForSale.com.au to estimate a competitive asking price.`,
        },
        {
          question: "What information should I include in a 4x4 advertisement?",
          answer: `Include the make, model, year, kilometres, condition, price, drivetrain and service history. Highlight towing capacity, accessories and modifications, supported by clear photographs.`,
        },
        {
          question: "Can private sellers and dealerships advertise 4x4s?",
          answer: `Yes. Private sellers can list through SellMyCarOnline.au, while dealerships can <a href="${DEALER}">advertise eligible stock</a> across relevant marketplaces through a unified dealer account.`,
        },
      ],
    },
    {
      label: "General & Buying",
      items: [
        {
          question: "Where can I find 4x4s for sale in Australia?",
          answer: `Browse <a href="/listings/">new and used 4x4s for sale</a> on 4x4ForSale.com.au. Compare utes, SUVs and wagons from dealerships and private sellers across Australia.`,
        },
        {
          question: "What does 4x4 mean in a vehicle?",
          answer: `4x4 refers to a four-wheel-drive vehicle capable of delivering power to all four wheels. Systems vary, with some designed for demanding off-road conditions and others primarily for road traction.`,
        },
        {
          question: "What are the most popular 4x4 vehicles in Australia?",
          answer: `Popular 4x4s include the Toyota HiLux, Ford Ranger, Toyota LandCruiser, Nissan Patrol, Mitsubishi Triton, Isuzu D-MAX and Suzuki Jimny. Compare models based on your driving needs.`,
        },
        {
          question: "What types of 4x4 vehicles are available in Australia?",
          answer: `4x4s include dual-cab utes, single-cab work vehicles, SUVs, wagons and compact off-road models. Each offers different passenger space, towing capability, cargo capacity and off-road features.`,
        },
        {
          question: "What are the benefits of owning a 4x4?",
          answer: `A 4x4 can provide additional traction, off-road capability and versatility for work, touring and recreation. Suitability depends on the vehicle's drivetrain, clearance, tyres and specifications.`,
        },
        {
          question: "What is the difference between a 4x4 and an AWD vehicle?",
          answer: `Traditional 4x4 systems often include selectable driving modes and low-range gearing, while AWD commonly focuses on distributing traction automatically. Actual off-road capabilities vary between vehicles.`,
        },
        {
          question: "What should I consider before buying a 4x4?",
          answer: `Consider your budget, intended use, ground clearance, drivetrain, towing capacity, fuel consumption and running costs. For used 4x4s, check service history, mechanical condition and previous off-road use.`,
        },
        {
          question: "How can I compare different 4x4s for sale?",
          answer: `Compare 4x4s by make, model, year, price, kilometres, body type, fuel type, transmission and features. Use the search filters on 4x4ForSale.com.au to narrow your options.`,
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
