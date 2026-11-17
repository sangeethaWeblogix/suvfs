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
  convertibles: [
    {
      label: "Convertible Roofs & Styles",
      items: [
        {
          question: "What is the difference between soft-top and hardtop convertibles?",
          answer: `Soft-top convertibles use folding fabric roofs, while retractable hardtops use rigid roof panels. Soft-tops are often lighter, while hardtops may offer greater insulation and security.`,
        },
        {
          question: "What is a roadster?",
          answer: `A roadster is generally a sporty two-seat open-top car designed around driving enjoyment. Popular examples include the Mazda MX-5 and Porsche Boxster.`,
        },
        {
          question: "What is a cabriolet?",
          answer: `Cabriolet is another term for a convertible car, commonly used by European manufacturers. Cabriolets can feature soft-top or retractable hardtop roofs and two or more seats.`,
        },
        {
          question: "What is the difference between a targa and a convertible?",
          answer: `A targa typically features a removable or retractable roof section while retaining more fixed roof structure. Traditional convertibles generally allow a larger roof section to open.`,
        },
        {
          question: "Are convertible cars waterproof in heavy rain?",
          answer: `Modern convertibles are designed to withstand normal rain when their roofs and seals are maintained. Inspect roof seals, drainage channels and the interior for water leaks.`,
        },
        {
          question: "Are soft-top convertibles secure when parked?",
          answer: `Soft-top convertibles have locking mechanisms and security features, but fabric roofs may be more vulnerable to damage than metal roofs. Avoid leaving valuables visible.`,
        },
        {
          question: "Do convertible cars have enough boot space?",
          answer: `Boot space varies considerably between convertible models. Some retractable roofs reduce luggage capacity when lowered. Compare boot dimensions and roof operation before buying.`,
        },
      ],
    },
    {
      label: "New, Used & Prices",
      items: [
        {
          question: "Where can I find new convertibles for sale in Australia?",
          answer: `Browse <a href="/listings/new-condition/">new convertibles for sale</a> on ConvertiblesForSale.com.au. Compare available models from dealerships by price, make, seating and specifications.`,
        },
        {
          question: "Where can I find used convertibles for sale?",
          answer: `Explore <a href="/listings/used-condition/">used convertibles for sale</a> across Australia. Compare second-hand vehicles by price, age, kilometres, condition and features.`,
        },
        {
          question: "Is it better to buy a new or used convertible?",
          answer: `New convertibles offer current features and applicable warranties, while used models generally cost less. Consider vehicle condition, roof maintenance, servicing and insurance before deciding.`,
        },
        {
          question: "How much does a new convertible cost in Australia?",
          answer: `New convertible prices vary by brand, performance and features. Models such as the Mazda MX-5 generally cost less than premium European sports cars and luxury convertibles.`,
        },
        {
          question: "How much does a used convertible cost in Australia?",
          answer: `Some older used convertibles are advertised for under $20,000, while newer luxury and performance models can exceed $100,000. Prices depend on brand, age, condition and kilometres.`,
        },
        {
          question: "Where can I find cheap convertibles for sale?",
          answer: `Browse <a href="/listings/between-10000-20000/">convertibles between $10,000 and $20,000</a> or explore other budget categories. Check roof condition, servicing and possible repair costs before purchasing.`,
        },
        {
          question: "Where can I find luxury convertibles for sale?",
          answer: `Explore <a href="/listings/over-100000/">convertibles over $100,000</a>, including available premium models from Porsche, Ferrari, Mercedes-Benz and other manufacturers.`,
        },
      ],
    },
    {
      label: "Convertible Brands & Models",
      items: [
        {
          question: "What are the most popular convertible cars in Australia?",
          answer: `Well-known convertible models include the Mazda MX-5, Ford Mustang Convertible, BMW 4 Series Convertible, Mercedes-Benz Cabriolet models and Porsche Boxster.`,
        },
        {
          question: "Where can I find Mazda convertibles for sale?",
          answer: `Browse <a href="/listings/mazda/">Mazda convertibles for sale</a>, including available MX-5 models. Compare manual and automatic variants, prices, condition and features.`,
        },
        {
          question: "Where can I find Ford Mustang convertibles for sale?",
          answer: `Explore <a href="/listings/ford/">Ford convertibles for sale</a>, including Mustang Convertible models. Compare engine options, transmissions, performance and prices.`,
        },
        {
          question: "Where can I find BMW convertibles for sale?",
          answer: `Browse <a href="/listings/bmw/">BMW convertibles for sale</a>, including available Z4 roadsters and 2 Series, 4 Series and M performance convertibles.`,
        },
        {
          question: "Where can I find Mercedes-Benz convertibles for sale?",
          answer: `Explore <a href="/listings/mercedes-benz/">Mercedes-Benz convertibles for sale</a>, including available SL, SLK, C-Class and E-Class cabriolet models.`,
        },
        {
          question: "Where can I find Porsche convertibles for sale?",
          answer: `Browse <a href="/listings/porsche/">Porsche convertibles for sale</a>, including available Boxster, 718 Spyder, 911 Cabriolet and Targa models.`,
        },
        {
          question: "Where can I find Audi convertibles for sale?",
          answer: `Explore <a href="/listings/audi/">Audi convertibles for sale</a>, including available A3 and A5 Cabriolet models. Compare prices, roof designs, performance and condition.`,
        },
      ],
    },
    {
      label: "Driving & Practicality",
      items: [
        {
          question: "Should I buy a 2-seater or 4-seater convertible?",
          answer: `A <a href="/listings/2-seats/">2-seater convertible</a> suits buyers prioritising sporty driving, while <a href="/listings/4-seats/">4-seater convertibles</a> offer additional passenger flexibility.`,
        },
        {
          question: "Are 4-seater convertibles practical for families?",
          answer: `Some four-seat convertibles can accommodate families, but rear-seat space and boot capacity may be limited. Check child-seat compatibility, safety features and everyday usability.`,
        },
        {
          question: "Are manual or automatic convertibles better?",
          answer: `Manual convertibles appeal to drivers who enjoy greater gear control, while automatics offer convenience in traffic. The better choice depends on driving preferences and vehicle specifications.`,
        },
        {
          question: "What features improve convertible driving comfort?",
          answer: `Useful features include heated seats, climate control, wind deflectors, adjustable seating and effective roof insulation. These can improve comfort during open-top driving and longer journeys.`,
        },
        {
          question: "What safety features should I look for in a convertible?",
          answer: `Look for electronic stability control, autonomous emergency braking, suitable rollover protection and airbags. Check the model's safety specifications and applicable ANCAP rating where available.`,
        },
      ],
    },
    {
      label: "Inspections & Ownership",
      items: [
        {
          question: "What should I inspect before buying a used convertible?",
          answer: `Check the engine, transmission, tyres, brakes, service history and roof mechanism. Inspect fabric or hardtop panels, seals, drainage channels and the interior for water damage.`,
        },
        {
          question: "How can I check a convertible for roof leaks?",
          answer: `Inspect roof seals, windows, carpets, boot lining and drainage channels for moisture or staining. Test the roof operation and consider an independent inspection before purchasing.`,
        },
        {
          question: "Are convertible roofs expensive to repair?",
          answer: `Repair costs depend on the roof design and the extent of damage. Fabric repairs may be relatively simple, while motors, hydraulic systems and retractable hardtop mechanisms can be expensive.`,
        },
        {
          question: "How often should convertible roofs be maintained?",
          answer: `Follow the manufacturer's recommendations and regularly inspect seals, fabric, drainage channels and moving components. Keep the roof clean and address leaks or operating problems promptly.`,
        },
        {
          question: "Are convertibles expensive to insure and maintain?",
          answer: `Costs vary by model, value, performance and roof design. Luxury or high-performance convertibles may have higher insurance, servicing, tyre and roof-repair expenses.`,
        },
        {
          question: "What documents should I check before buying a used convertible?",
          answer: `Check registration details, VIN, service records and available warranty information. Conduct a PPSR search and consider an independent mechanical and roof inspection before purchasing.`,
        },
      ],
    },
    {
      label: "Convertibles for Sale by Location",
      items: [
        {
          question: "Where can I find convertibles for sale in Sydney?",
          answer: `Browse <a href="/listings/new-south-wales-state/sydney-region/">convertibles for sale in Sydney</a> on ConvertiblesForSale.com.au. Compare new and used vehicles from dealerships and private sellers.`,
        },
        {
          question: "Where can I find convertibles for sale in Melbourne?",
          answer: `Explore <a href="/listings/victoria-state/melbourne-region/">convertibles for sale in Melbourne</a> and compare available models by make, price, condition, seating and features.`,
        },
        {
          question: "Where can I find convertibles for sale in Brisbane?",
          answer: `Browse <a href="/listings/queensland-state/brisbane-region/">convertibles for sale in Brisbane</a> and compare available roadsters, cabriolets, sports cars and luxury models.`,
        },
        {
          question: "Where can I find convertibles for sale on the Gold Coast?",
          answer: `Explore <a href="/listings/queensland-state/gold-coast-region/">convertibles for sale on the Gold Coast</a>, including available new and used vehicles advertised across the region.`,
        },
        {
          question: "Where can I find convertibles for sale in Perth?",
          answer: `Browse <a href="/listings/western-australia-state/perth-region/">convertibles for sale in Perth</a> and compare available vehicles by make, price, condition and specifications.`,
        },
        {
          question: "How can I find convertibles for sale near me?",
          answer: `Use the location filters on ConvertiblesForSale.com.au to find vehicles in your state, city or region. Narrow results by make, price and condition.`,
        },
      ],
    },
    {
      label: "Selling a Convertible",
      items: [
        {
          question: "How do I sell my convertible online in Australia?",
          answer: `You can <a href="${SELL}">sell your car online</a> through our unified automotive marketplace network. Create one advertisement, add your vehicle details and photos, and receive enquiries directly.`,
        },
        {
          question: "How much does it cost to advertise a convertible?",
          answer: `Private sellers pay a one-time fee of $49 including GST through SellMyCarOnline.au. There are no monthly listing fees or commission on the final sale.`,
        },
        {
          question: "How long will my convertible advertisement stay online?",
          answer: `Your private seller advertisement remains live until your vehicle is sold, with no recurring monthly listing charges.`,
        },
        {
          question: "Will my convertible be advertised across multiple marketplaces?",
          answer: `Yes. Eligible vehicles are automatically advertised across relevant automotive marketplaces within our network, based on their body type and other vehicle attributes.`,
        },
        {
          question: "What information should I include when selling my convertible?",
          answer: `Include the make, model, year, kilometres, condition, price, roof type and service history. Add clear photographs showing the roof open and closed, interior and exterior.`,
        },
        {
          question: "Can private sellers and dealerships advertise convertibles?",
          answer: `Yes. Private sellers can list through SellMyCarOnline.au, while dealerships can <a href="${DEALER}">advertise eligible stock</a> through our unified automotive marketplace network.`,
        },
      ],
    },
    {
      label: "General & Buying",
      items: [
        {
          question: "Where can I find convertibles for sale in Australia?",
          answer: `Browse <a href="/listings/">new and used convertibles for sale</a> on ConvertiblesForSale.com.au. Compare vehicles from dealerships and private sellers across Australia by price, make, model, location and features.`,
        },
        {
          question: "What is a convertible car?",
          answer: `A convertible is a car with a roof that can be opened or removed for open-air driving. Convertibles include soft-top, retractable hardtop, roadster and cabriolet models.`,
        },
        {
          question: "What is the difference between a convertible and a coupe?",
          answer: `Convertibles have roofs designed to open or be removed, while coupes generally have fixed roofs. Compare convertibles with <a href="https://www.coupesforsale.com.au/">coupes for sale</a> to explore both styles.`,
        },
        {
          question: "What are the different types of convertibles available in Australia?",
          answer: `Popular types include soft-top convertibles, retractable hardtops, two-seat roadsters, four-seat cabriolets and targa-roof sports cars. Each offers different levels of practicality, comfort and performance.`,
        },
        {
          question: "How do I choose the right convertible?",
          answer: `Consider your budget, seating requirements, roof design, driving preferences and running costs. Compare convertible models by price, condition, performance, features and everyday practicality.`,
        },
        {
          question: "Are convertibles suitable for everyday driving?",
          answer: `Yes. Many modern convertibles provide comfortable interiors, air conditioning and safety features for daily use. Consider roof insulation, boot space, fuel economy and parking requirements.`,
        },
        {
          question: "Are convertibles available from private sellers and dealers?",
          answer: `Yes. ConvertiblesForSale.com.au features new, used and demo convertibles advertised by Australian dealerships and private sellers. Buyers can compare vehicles and contact advertisers directly.`,
        },
        {
          question: "How can I compare different convertibles for sale?",
          answer: `Compare convertibles by make, model, year, price, kilometres, roof type, seating, fuel type and transmission. Use the filters on ConvertiblesForSale.com.au to narrow your options.`,
        },
      ],
    },
  ],
  coupes: [
    {
      label: "New, Used & Prices",
      items: [
        {
          question: "Where can I find new coupes for sale in Australia?",
          answer: `Browse <a href="/listings/new-condition/">new coupes for sale</a> on CoupesForSale.com.au. Compare available sports, luxury and performance models from Australian dealerships.`,
        },
        {
          question: "Where can I find used coupes for sale?",
          answer: `Explore <a href="/listings/used-condition/">used coupes for sale</a> across Australia. Compare second-hand vehicles from dealerships and private sellers by price, condition, age and kilometres.`,
        },
        {
          question: "Is it better to buy a new or used coupe?",
          answer: `New coupes offer current features and applicable manufacturer warranties, while used models generally cost less. Compare vehicle condition, performance, depreciation and ongoing ownership costs.`,
        },
        {
          question: "How much does a coupe cost in Australia?",
          answer: `Some older used coupes cost under $20,000, while new sports and luxury coupes can exceed $100,000. Prices depend on brand, age, performance, condition and specifications.`,
        },
        {
          question: "Where can I find affordable sports coupes for sale?",
          answer: `Browse <a href="/listings/between-10000-20000/">coupes between $10,000 and $20,000</a> or explore other price ranges. Compare affordable models by condition, kilometres and maintenance history.`,
        },
        {
          question: "What should I check before buying a used coupe?",
          answer: `Inspect the engine, transmission, suspension, brakes, tyres and bodywork. Review service records, check for accident damage or modifications, and conduct a PPSR search before purchasing.`,
        },
        {
          question: "Can I get finance to buy a new or used coupe?",
          answer: `Yes. Banks and vehicle finance providers may offer loans for new and used coupes, subject to eligibility. Compare interest rates, fees, repayments and loan conditions.`,
        },
      ],
    },
    {
      label: "Coupe Brands & Models",
      items: [
        {
          question: "What are the most popular coupe brands in Australia?",
          answer: `Well-known coupe brands include Ford, Toyota, Subaru, Nissan, BMW, Mercedes-Benz, Porsche, Audi and Chevrolet. Compare available models by performance, price, features and driving preferences.`,
        },
        {
          question: "Where can I find Ford Mustang coupes for sale?",
          answer: `Browse <a href="/listings/ford/">Ford coupes for sale</a>, including available Mustang EcoBoost, GT and performance variants. Compare engines, transmissions, condition and prices.`,
        },
        {
          question: "Where can I find Toyota coupes for sale?",
          answer: `Explore <a href="/listings/toyota/">Toyota coupes for sale</a>, including available Toyota 86 and GR86 models. Compare manual and automatic variants, performance and features.`,
        },
        {
          question: "Where can I find Nissan Z coupes for sale?",
          answer: `Browse <a href="/listings/nissan/">Nissan coupes for sale</a>, including available Nissan Z, 370Z and older 350Z models. Compare prices, condition and specifications.`,
        },
        {
          question: "Where can I find BMW coupes for sale?",
          answer: `Explore <a href="/listings/bmw/">BMW coupes for sale</a>, including available 2 Series, 4 Series, M2 and M4 models. Compare luxury features, performance and prices.`,
        },
        {
          question: "Where can I find Mercedes-Benz coupes for sale?",
          answer: `Browse <a href="/listings/mercedes-benz/">Mercedes-Benz coupes for sale</a>, including available C-Class, E-Class, CLE and AMG GT models.`,
        },
        {
          question: "Where can I find Porsche coupes for sale?",
          answer: `Explore <a href="/listings/porsche/">Porsche coupes for sale</a>, including available 911, Cayman and 718 models. Compare performance, transmission, condition and price.`,
        },
        {
          question: "Where can I find Chevrolet Corvette coupes for sale?",
          answer: `Browse <a href="/listings/chevrolet/">Chevrolet coupes for sale</a>, including available Corvette models. Compare engine specifications, performance features, prices and condition.`,
        },
      ],
    },
    {
      label: "Coupe Types & Seating",
      items: [
        {
          question: "What are the different types of coupe cars available?",
          answer: `Coupes include sports coupes, luxury coupes, muscle cars, grand tourers and classic models. Each offers different performance, styling, seating arrangements and everyday practicality.`,
        },
        {
          question: "What are the best sports coupes in Australia?",
          answer: `Popular sports coupes include the Toyota GR86, Subaru BRZ, Nissan Z, Porsche Cayman and Ford Mustang. Compare handling, engine performance, transmission and affordability.`,
        },
        {
          question: "What is the difference between a sports coupe and a grand tourer?",
          answer: `Sports coupes generally prioritise agility and driving performance, while grand tourers combine performance with greater comfort for longer journeys. Models vary in size, equipment and practicality.`,
        },
        {
          question: "Should I buy a 2-seater or 4-seater coupe?",
          answer: `A <a href="/listings/2-seats/">2-seater coupe</a> can suit performance-focused drivers, while <a href="/listings/4-seats/">4-seater coupes</a> offer additional passenger flexibility.`,
        },
        {
          question: "Where can I find luxury coupes for sale?",
          answer: `Browse <a href="/listings/over-100000/">premium coupes over $100,000</a>, including available models from Porsche, Mercedes-Benz, BMW, Ferrari and other luxury manufacturers.`,
        },
        {
          question: "What are the benefits of a fastback coupe design?",
          answer: `Fastback coupes feature a roofline that slopes towards the rear, creating a streamlined, sporty appearance. Depending on the model, this design can reduce rear headroom or luggage practicality.`,
        },
      ],
    },
    {
      label: "Performance & Drivetrains",
      items: [
        {
          question: "What is the difference between rear-wheel drive and AWD coupes?",
          answer: `Rear-wheel-drive coupes deliver power to the rear wheels, while AWD models distribute power between both axles. Compare <a href="/listings/rear-wheel-drive-drive-type/">RWD coupes</a> and AWD options for traction and driving preferences.`,
        },
        {
          question: "Are manual sports coupes still available in Australia?",
          answer: `Yes. Some sports coupes, including variants of the Toyota GR86, Subaru BRZ, Nissan Z and Ford Mustang, offer manual transmissions. Availability depends on the model and year.`,
        },
        {
          question: "Are automatic coupes suitable for performance driving?",
          answer: `Yes. Many modern performance coupes use automatic or dual-clutch transmissions for rapid gear changes. Compare transmission type, driving modes and handling characteristics before choosing.`,
        },
        {
          question: "Which coupes offer V8 performance?",
          answer: `V8 coupe options include selected Ford Mustang GT, Chevrolet Corvette, Mercedes-AMG and older Australian muscle car models. Compare power output, handling, fuel consumption and maintenance costs.`,
        },
        {
          question: "Are electric coupes available in Australia?",
          answer: `Yes. Fully electric two-door coupes include models such as the Maserati GranTurismo Folgore and Rolls-Royce Spectre. Availability and pricing vary considerably.`,
        },
        {
          question: "Which coupe cars offer good fuel economy?",
          answer: `Smaller-engine coupes and some hybrid models can offer better fuel economy than large V8 performance cars. Compare official consumption figures and expected running costs.`,
        },
        {
          question: "What should I look for when test-driving a coupe?",
          answer: `Check steering response, braking, transmission operation, suspension comfort and unusual noises. Assess visibility, seating position, cabin space and overall driving comfort.`,
        },
      ],
    },
    {
      label: "Classic & Modified Coupes",
      items: [
        {
          question: "Where can I find classic coupes for sale in Australia?",
          answer: `Browse used coupes for sale and filter by make and year. Classic examples include older Holden, Ford, Porsche, Nissan and Jaguar models.`,
        },
        {
          question: "What are the most iconic Australian muscle coupes?",
          answer: `Well-known Australian muscle coupes include the Holden Monaro and Ford Falcon hardtop models. Enthusiasts often value their performance heritage, styling and historical significance.`,
        },
        {
          question: "Are older and vintage coupes worth buying?",
          answer: `Classic coupes can offer distinctive styling and driving enjoyment, but may require additional maintenance. Check rust, mechanical condition, originality, service history and replacement parts availability.`,
        },
        {
          question: "Where can I find modified and performance coupes for sale?",
          answer: `Some coupe listings feature aftermarket wheels, suspension, exhaust systems and engine modifications. Review individual advertisements and confirm modification details before purchasing.`,
        },
        {
          question: "What should I check before buying a modified coupe?",
          answer: `Inspect the engine, suspension, brakes, tyres and structural condition. Confirm modifications comply with applicable regulations and review engineering approvals, servicing records and insurance implications.`,
        },
        {
          question: "Are classic coupes a good investment?",
          answer: `Some rare and desirable coupes may appreciate, but future values are uncertain. Consider purchase price, originality, condition, restoration costs and long-term maintenance before buying.`,
        },
      ],
    },
    {
      label: "Coupes for Sale by Location",
      items: [
        {
          question: "Where can I find coupes for sale in Sydney?",
          answer: `Browse <a href="/listings/new-south-wales-state/sydney-region/">coupes for sale in Sydney</a> on CoupesForSale.com.au. Compare new and used models from dealerships and private sellers.`,
        },
        {
          question: "Where can I find coupes for sale in Melbourne?",
          answer: `Explore <a href="/listings/victoria-state/melbourne-region/">coupes for sale in Melbourne</a> and compare available sports, luxury and performance models by price, make and condition.`,
        },
        {
          question: "Where can I find coupes for sale in Brisbane?",
          answer: `Browse <a href="/listings/queensland-state/brisbane-region/">coupes for sale in Brisbane</a> and compare available models, prices, transmissions and performance features.`,
        },
        {
          question: "Where can I find coupes for sale in Perth?",
          answer: `Find <a href="/listings/western-australia-state/perth-region/">coupes for sale in Perth</a> and compare available vehicles by make, condition, price and specifications.`,
        },
        {
          question: "Where can I find coupes for sale in Adelaide?",
          answer: `Browse <a href="/listings/south-australia-state/adelaide-region/">coupes for sale in Adelaide</a> on CoupesForSale.com.au. Compare available models from dealers and private sellers.`,
        },
      ],
    },
    {
      label: "Selling a Coupe",
      items: [
        {
          question: "How do I sell my coupe online in Australia?",
          answer: `You can <a href="${SELL}">sell your car online</a> through our unified automotive marketplace network. Create one listing and receive enquiries directly from interested buyers.`,
        },
        {
          question: "How much does it cost to advertise a coupe?",
          answer: `Private sellers pay a one-time fee of $49 including GST through SellMyCarOnline.au. Your listing stays live until sold, with no monthly fees or sales commission.`,
        },
        {
          question: "Will my coupe be advertised across multiple marketplaces?",
          answer: `Yes. Eligible coupes are automatically advertised across relevant automotive marketplaces within our network based on their body type and other vehicle attributes.`,
        },
        {
          question: "What information should I include in a coupe advertisement?",
          answer: `Include the make, model, year, kilometres, condition, asking price, engine, transmission, features and service history. Add clear photographs of the exterior, interior and any modifications.`,
        },
        {
          question: "How do I determine the resale value of my coupe?",
          answer: `Compare similar coupes by make, model, year, kilometres, condition and specifications. Consider performance variants, service history, modifications and current asking prices when setting your price.`,
        },
      ],
    },
    {
      label: "General & Buying",
      items: [
        {
          question: "Where can I find coupes for sale in Australia?",
          answer: `Browse <a href="/listings/">new and used coupes for sale</a> on CoupesForSale.com.au. Compare available vehicles from dealerships and private sellers across Australia by price, make, model, location and features.`,
        },
        {
          question: "What makes a car a coupe?",
          answer: `A coupe traditionally has two doors, a fixed roof and a sporty, often sloping roofline. Some manufacturers also use the coupe name for four-door vehicles with similar styling.`,
        },
        {
          question: "What is the difference between a coupe and a sedan?",
          answer: `Coupes generally prioritise sporty styling and driving enjoyment, while sedans typically offer more passenger space and practicality. Compare coupes with <a href="https://www.sedansforsale.com.au/">sedans for sale</a> to explore both styles.`,
        },
        {
          question: "What is the difference between a coupe and a convertible?",
          answer: `Coupes generally have fixed roofs, while convertibles feature roofs that open or retract. Explore <a href="https://www.convertiblesforsale.com.au/">convertibles for sale</a> to compare open-top models with fixed-roof coupes.`,
        },
        {
          question: "What are the most popular coupe cars in Australia?",
          answer: `Well-known coupe models include the Ford Mustang, Toyota GR86, Subaru BRZ, Nissan Z, BMW 4 Series and Porsche 911. Compare available models based on performance, price and practicality.`,
        },
        {
          question: "Are coupe cars suitable for everyday driving?",
          answer: `Yes. Many modern coupes offer comfortable interiors, safety technology and practical features for daily driving. Consider rear-seat access, boot space, fuel consumption and running costs.`,
        },
        {
          question: "What should I consider when choosing a coupe?",
          answer: `Consider your budget, seating requirements, engine performance, transmission, drivetrain and running costs. Compare sports, luxury and grand touring coupes to find a suitable model.`,
        },
        {
          question: "How can I compare different coupes for sale?",
          answer: `Compare coupes by make, model, year, price, kilometres, fuel type, transmission, drivetrain, engine power and seating capacity. Use the filters on CoupesForSale.com.au to narrow your options.`,
        },
      ],
    },
  ],
  awd: [
    {
      label: "New, Used & Prices",
      items: [
        {
          question: "Where can I find new AWD cars for sale in Australia?",
          answer: `Browse <a href="/listings/new-condition/">new AWDs for sale</a> on AWDForSale.com.au. Compare available SUVs, sedans, hatchbacks and wagons from Australian dealerships.`,
        },
        {
          question: "Where can I find used AWD cars for sale?",
          answer: `Explore <a href="/listings/used-condition/">used AWDs for sale</a> across Australia. Compare second-hand vehicles from dealerships and private sellers by price, age, condition and kilometres.`,
        },
        {
          question: "Is it better to buy a new or used AWD car?",
          answer: `New AWDs offer current features and applicable manufacturer warranties, while used vehicles generally cost less. Compare reliability, service history, condition and running costs before deciding.`,
        },
        {
          question: "How much does an AWD car cost in Australia?",
          answer: `AWD prices range from under $10,000 for some older used vehicles to over $100,000 for premium models. Prices depend on brand, age, condition, drivetrain and features.`,
        },
        {
          question: "Where can I find affordable AWD cars under $20,000?",
          answer: `Browse <a href="/listings/between-10000-20000/">AWDs between $10,000 and $20,000</a> or <a href="/listings/under-10000/">under $10,000</a>. Compare vehicle condition, kilometres and service history before buying.`,
        },
        {
          question: "What should I check before buying a used AWD car?",
          answer: `Inspect the engine, transmission, tyres, suspension and AWD drivetrain. Check for unusual noises, fluid leaks and uneven tyre wear. Review service records and conduct a PPSR search.`,
        },
        {
          question: "Are AWD cars more expensive to maintain than 2WD vehicles?",
          answer: `Some AWD vehicles have additional drivetrain components requiring maintenance. Costs vary by model, and tyre replacement requirements can also affect ownership expenses.`,
        },
      ],
    },
    {
      label: "AWD Brands & Models",
      items: [
        {
          question: "What are the most popular AWD car brands in Australia?",
          answer: `Well-known AWD brands include Subaru, Toyota, Mazda, Hyundai, Kia, Mitsubishi, BMW, Mercedes-Benz and Audi. Compare available models by price, features, fuel economy and drivetrain.`,
        },
        {
          question: "Where can I find Subaru AWD cars for sale?",
          answer: `Browse <a href="/listings/subaru/">Subaru AWDs for sale</a>, including available Forester, Outback, Crosstrek, Impreza and WRX models. Compare prices, condition and specifications.`,
        },
        {
          question: "Where can I find Toyota AWD cars for sale?",
          answer: `Explore <a href="/listings/toyota/">Toyota AWDs for sale</a>, including AWD variants of the RAV4, Kluger, Corolla Cross and other available models.`,
        },
        {
          question: "Where can I find Mazda AWD cars for sale?",
          answer: `Browse <a href="/listings/mazda/">Mazda AWDs for sale</a>, including available CX-5, CX-30, CX-60, CX-80 and CX-90 models. Compare size, features and fuel type.`,
        },
        {
          question: "Where can I find Hyundai AWD cars for sale?",
          answer: `Explore <a href="/listings/hyundai/">Hyundai AWDs for sale</a>, including available Tucson, Santa Fe, Kona and electric AWD models. Compare prices, seating and features.`,
        },
        {
          question: "Where can I find Kia AWD cars for sale?",
          answer: `Browse <a href="/listings/kia/">Kia AWDs for sale</a>, including AWD variants of the Sportage, Sorento, Seltos, EV5 and EV9.`,
        },
        {
          question: "Where can I find Mitsubishi AWD cars for sale?",
          answer: `Explore <a href="/listings/mitsubishi/">Mitsubishi AWDs for sale</a>, including available Outlander and Eclipse Cross variants. Compare petrol, hybrid and plug-in hybrid options.`,
        },
        {
          question: "Where can I find BMW AWD cars for sale?",
          answer: `Browse <a href="/listings/bmw/">BMW AWDs for sale</a>, including available xDrive SUVs, sedans and performance models. Compare specifications, features and prices.`,
        },
        {
          question: "Where can I find Mercedes-Benz AWD cars for sale?",
          answer: `Explore <a href="/listings/mercedes-benz/">Mercedes-Benz AWDs for sale</a>, including available 4MATIC SUVs, sedans, electric vehicles and performance models.`,
        },
      ],
    },
    {
      label: "AWD Types & Body Styles",
      items: [
        {
          question: "Where can I find AWD SUVs for sale?",
          answer: `Browse <a href="/listings/suv-body-type/">AWD SUVs for sale</a>, including available family, compact, luxury and hybrid models from dealerships and private sellers.`,
        },
        {
          question: "Where can I find AWD sedans for sale?",
          answer: `Explore <a href="/listings/sedan-body-type/">AWD sedans for sale</a>, including available Subaru, BMW, Audi and Mercedes-Benz models. Compare comfort, performance and drivetrain features.`,
        },
        {
          question: "Where can I find AWD hatchbacks for sale?",
          answer: `Browse <a href="/listings/hatchback-body-type/">AWD hatchbacks for sale</a>, including compact and performance-focused models. Compare size, handling, fuel consumption and everyday practicality.`,
        },
        {
          question: "Where can I find AWD wagons for sale?",
          answer: `Explore <a href="/listings/wagon-body-type/">AWD wagons for sale</a>, including available Subaru Outback and other practical models suited to family travel and additional cargo needs.`,
        },
        {
          question: "Are AWD utes available in Australia?",
          answer: `Some utes offer full-time all-wheel-drive or selectable four-wheel-drive systems. Browse <a href="/listings/ute-body-type/">AWD ute listings</a> and check each vehicle's actual drivetrain specifications.`,
        },
        {
          question: "Which AWD vehicles are suitable for families?",
          answer: `Popular family options include the Subaru Forester, Toyota RAV4, Mazda CX-5, Hyundai Tucson and Kia Sportage. Compare seating, boot space, safety features and running costs.`,
        },
      ],
    },
    {
      label: "Electric & Hybrid AWDs",
      items: [
        {
          question: "Where can I find electric AWD cars for sale?",
          answer: `Browse <a href="/listings/electric-fuel-type/">electric AWDs for sale</a>, including available dual-motor electric SUVs and sedans. Compare battery range, charging speed, price and features.`,
        },
        {
          question: "Where can I find hybrid AWD cars for sale?",
          answer: `Explore <a href="/listings/hybrid-fuel-type/">hybrid AWDs for sale</a>, including available Toyota, Subaru, Hyundai, Kia and other hybrid models.`,
        },
        {
          question: "Where can I find plug-in hybrid AWD vehicles?",
          answer: `Browse <a href="/listings/plug-in-hybrid-fuel-type/">plug-in hybrid AWDs for sale</a>, including available Mitsubishi Outlander PHEV and other rechargeable hybrid models.`,
        },
        {
          question: "What is the difference between electric AWD and hybrid AWD vehicles?",
          answer: `Electric AWDs use electric motors to drive both axles. Hybrid AWDs combine an internal combustion engine with electric assistance, with drivetrain arrangements varying by model.`,
        },
        {
          question: "Are AWD electric cars suitable for long-distance travel?",
          answer: `Yes. Many AWD electric vehicles support long-distance driving, provided charging facilities are available. Compare battery range, energy consumption, charging speed and planned routes.`,
        },
        {
          question: "What are the benefits of owning a hybrid AWD vehicle?",
          answer: `Hybrid AWD vehicles combine electric assistance with all-wheel-drive traction. Some can reduce fuel consumption, particularly in city driving, while retaining petrol-engine flexibility.`,
        },
        {
          question: "Which AWD cars offer good fuel economy?",
          answer: `Fuel-efficient AWD options include selected hybrid SUVs and electric vehicles. Compare official fuel consumption or energy efficiency figures, as results vary by model and driving conditions.`,
        },
      ],
    },
    {
      label: "AWD Performance & Maintenance",
      items: [
        {
          question: "How does an AWD drivetrain work?",
          answer: `AWD systems distribute driving power between the front and rear wheels using mechanical or electronic controls. Some operate continuously, while others engage additional wheels when needed.`,
        },
        {
          question: "What is the difference between AWD and front-wheel drive?",
          answer: `Front-wheel-drive vehicles deliver power to the front wheels, while AWD systems can distribute power to both axles. AWD may improve traction in certain conditions but adds complexity.`,
        },
        {
          question: "Are AWD cars better for wet and slippery roads?",
          answer: `AWD can improve traction when accelerating on slippery surfaces. However, it does not automatically shorten braking distances or prevent skidding. Tyres and driver behaviour remain important.`,
        },
        {
          question: "Are AWD vehicles suitable for off-road driving?",
          answer: `Some AWD vehicles handle gravel roads and light off-road conditions, but not all suit challenging terrain. Check ground clearance, tyres, drivetrain capability and manufacturer restrictions.`,
        },
        {
          question: "What maintenance does an AWD system require?",
          answer: `AWD systems may require servicing of differentials, transfer units, transmissions and related components. Follow the manufacturer's maintenance schedule and investigate unusual drivetrain noises.`,
        },
        {
          question: "Do AWD cars need matching tyres?",
          answer: `Many AWD vehicles require tyres with compatible sizes, tread depths and rolling circumferences. Significant differences can stress drivetrain components. Follow the manufacturer's tyre replacement recommendations.`,
        },
        {
          question: "What should I check when test-driving an AWD car?",
          answer: `Check steering, braking, acceleration and transmission operation. Listen for drivetrain noises, vibrations or binding during turns, and assess tyre condition and overall handling.`,
        },
      ],
    },
    {
      label: "AWDs for Sale by Location",
      items: [
        {
          question: "Where can I find AWD cars for sale in Sydney?",
          answer: `Browse <a href="/listings/new-south-wales-state/sydney-region/">AWDs for sale in Sydney</a> on AWDForSale.com.au. Compare new and used vehicles from dealerships and private sellers.`,
        },
        {
          question: "Where can I find AWD cars for sale in Melbourne?",
          answer: `Explore <a href="/listings/victoria-state/melbourne-region/">AWDs for sale in Melbourne</a> and compare available SUVs, sedans, hatchbacks and wagons by price, make and condition.`,
        },
        {
          question: "Where can I find AWD cars for sale in Brisbane?",
          answer: `Browse <a href="/listings/queensland-state/brisbane-region/">AWDs for sale in Brisbane</a> and compare available models by price, fuel type, seating and specifications.`,
        },
        {
          question: "Where can I find AWD cars for sale in Perth?",
          answer: `Explore <a href="/listings/western-australia-state/perth-region/">AWDs for sale in Perth</a> and compare available vehicles by make, price, condition and features.`,
        },
        {
          question: "Where can I find AWD cars for sale in Adelaide?",
          answer: `Browse <a href="/listings/south-australia-state/adelaide-region/">AWDs for sale in Adelaide</a> and compare available vehicles from dealerships and private sellers.`,
        },
        {
          question: "How can I find AWD cars for sale near me?",
          answer: `Use the location filters on AWDForSale.com.au to browse available vehicles by state, city or region. Narrow your search by price, make and condition.`,
        },
      ],
    },
    {
      label: "Selling an AWD",
      items: [
        {
          question: "How do I sell my AWD car online in Australia?",
          answer: `You can <a href="${SELL}">sell your car online</a> through our unified automotive marketplace network. Create one listing and advertise your eligible AWD vehicle across relevant websites.`,
        },
        {
          question: "How much does it cost to advertise an AWD car?",
          answer: `Private sellers pay a one-time fee of $49 including GST through SellMyCarOnline.au, with no monthly listing fees or commission on the sale.`,
        },
        {
          question: "Will my AWD be advertised across multiple marketplaces?",
          answer: `Yes. Eligible vehicles are automatically advertised across relevant automotive marketplaces within our network, based on their body type, drivetrain, fuel type and other attributes.`,
        },
        {
          question: "How long will my AWD advertisement stay online?",
          answer: `Your private seller advertisement remains live until your vehicle is sold, with no recurring monthly listing charges.`,
        },
        {
          question: "What information should I include in an AWD advertisement?",
          answer: `Include the make, model, year, kilometres, condition, price, drivetrain, fuel type and service history. Highlight AWD features and add clear interior and exterior photographs.`,
        },
        {
          question: "Can private sellers and dealerships advertise AWD vehicles?",
          answer: `Yes. Private sellers can list through SellMyCarOnline.au, while dealerships can <a href="${DEALER}">advertise eligible stock</a> across our automotive marketplace network.`,
        },
      ],
    },
    {
      label: "General & Buying",
      items: [
        {
          question: "Where can I find AWD cars for sale in Australia?",
          answer: `Browse <a href="/listings/">new and used AWDs for sale</a> on AWDForSale.com.au. Compare SUVs, sedans, hatchbacks, wagons and other AWD vehicles from dealerships and private sellers across Australia.`,
        },
        {
          question: "What does AWD mean in a car?",
          answer: `AWD stands for All-Wheel Drive, a drivetrain system that can deliver power to all four wheels. It provides additional traction in certain driving conditions, depending on the vehicle's design.`,
        },
        {
          question: "What are the benefits of owning an AWD vehicle?",
          answer: `AWD vehicles can provide improved traction when accelerating on wet, slippery or loose surfaces. They are popular for everyday driving, family travel and varying Australian road conditions.`,
        },
        {
          question: "What is the difference between AWD and 4WD?",
          answer: `AWD systems commonly distribute power automatically between the wheels, while traditional 4WD systems may include selectable modes and low-range gearing. Actual capabilities vary between vehicles.`,
        },
        {
          question: "Are AWD cars suitable for Australian driving conditions?",
          answer: `Yes. AWD cars can suit city driving, highways and regional roads, particularly where additional traction is useful. However, AWD does not replace suitable tyres or safe driving.`,
        },
        {
          question: "What should I consider before buying an AWD car?",
          answer: `Consider your budget, vehicle size, fuel consumption, drivetrain, safety features and running costs. For used AWDs, check service history, tyre condition and drivetrain maintenance.`,
        },
        {
          question: "How can I compare different AWD cars for sale?",
          answer: `Compare AWDs by make, model, year, price, kilometres, body type, fuel type, transmission and features. Use the search filters on AWDForSale.com.au to narrow your options.`,
        },
      ],
    },
  ],
  hatchbacks: [
    {
      label: "New, Used & Prices",
      items: [
        {
          question: "Where can I find new hatchbacks for sale in Australia?",
          answer: `Browse <a href="/listings/new-condition/">new hatchbacks for sale</a> on HatchbacksForSale.com.au. Compare available models from Australian dealerships by make, price, size, fuel type and specifications.`,
        },
        {
          question: "Where can I find used hatchbacks for sale?",
          answer: `Explore <a href="/listings/used-condition/">used hatchbacks for sale</a> across Australia. Compare second-hand vehicles from dealerships and private sellers by price, age, kilometres and condition.`,
        },
        {
          question: "Is it better to buy a new or used hatchback?",
          answer: `New hatchbacks offer current features and applicable manufacturer warranties, while used models generally cost less. Compare purchase price, reliability, condition and ongoing expenses before deciding.`,
        },
        {
          question: "How much does a hatchback cost in Australia?",
          answer: `Hatchback prices vary from under $10,000 for some older used models to over $50,000 for premium and performance vehicles. Prices depend on brand, age, condition and features.`,
        },
        {
          question: "Where can I find cheap hatchbacks under $10,000?",
          answer: `Browse <a href="/listings/under-10000/">hatchbacks under $10,000</a> on HatchbacksForSale.com.au. Compare affordable used models by age, kilometres, condition and service history.`,
        },
        {
          question: "What should I check before buying a used hatchback?",
          answer: `Inspect the engine, transmission, tyres, brakes, suspension and bodywork. Check service records, accident damage and registration details, and conduct a PPSR search before purchasing.`,
        },
        {
          question: "Are used hatchbacks affordable to maintain?",
          answer: `Many small used hatchbacks have relatively affordable servicing, tyres and fuel costs. Maintenance expenses depend on the model, age, mechanical condition and availability of replacement parts.`,
        },
      ],
    },
    {
      label: "Hatchback Brands & Models",
      items: [
        {
          question: "What are the most popular hatchback cars in Australia?",
          answer: `Well-known hatchback models include the Toyota Corolla, Mazda3, Hyundai i30, Kia Picanto, Suzuki Swift, MG3 and Volkswagen Golf. Compare available models by size, price, features and fuel economy.`,
        },
        {
          question: "Where can I find Toyota Corolla hatchbacks for sale?",
          answer: `Browse <a href="/listings/toyota/corolla/">Toyota Corolla hatchbacks for sale</a> on HatchbacksForSale.com.au. Compare petrol, hybrid, new and used models by price, condition and specifications.`,
        },
        {
          question: "Where can I find Mazda3 hatchbacks for sale?",
          answer: `Explore <a href="/listings/mazda/mazda3/">Mazda3 hatchbacks for sale</a>, including available G20 and G25 variants. Compare prices, features, transmissions and condition.`,
        },
        {
          question: "Where can I find Hyundai i30 hatchbacks for sale?",
          answer: `Browse <a href="/listings/hyundai/">Hyundai hatchbacks for sale</a>, including available i30 and i30 N models. Compare everyday and performance variants by price, features and condition.`,
        },
        {
          question: "Where can I find Kia hatchbacks for sale?",
          answer: `Explore <a href="/listings/kia/">Kia hatchbacks for sale</a>, including available Picanto and other models. Compare compact designs, prices, features and fuel economy.`,
        },
        {
          question: "Where can I find Volkswagen Golf hatchbacks for sale?",
          answer: `Browse <a href="/listings/volkswagen/">Volkswagen hatchbacks for sale</a>, including available Golf, Polo, GTI and R variants. Compare performance, practicality, price and condition.`,
        },
        {
          question: "Where can I find MG hatchbacks for sale?",
          answer: `Explore <a href="/listings/mg/">MG hatchbacks for sale</a>, including available MG3 and electric MG4 models. Compare prices, technology, fuel types and features.`,
        },
        {
          question: "Where can I find Suzuki Swift hatchbacks for sale?",
          answer: `Browse <a href="/listings/suzuki/">Suzuki hatchbacks for sale</a>, including available Swift models. Compare petrol and hybrid variants, transmissions, prices and safety features.`,
        },
        {
          question: "Where can I find Honda Civic hatchbacks for sale?",
          answer: `Explore <a href="/listings/honda/">Honda hatchbacks for sale</a>, including available Civic models. Compare petrol, hybrid and performance variants by price, features and condition.`,
        },
      ],
    },
    {
      label: "Hatchback Sizes & Practicality",
      items: [
        {
          question: "What are the different sizes of hatchbacks available?",
          answer: `Hatchbacks are available in <a href="/listings/micro-body-size/">micro</a>, <a href="/listings/small-body-size/">small</a> and <a href="/listings/medium-body-size/">medium</a> categories. Compare passenger space, boot capacity, fuel economy and manoeuvrability.`,
        },
        {
          question: "What are the best small hatchback cars in Australia?",
          answer: `Popular small hatchbacks include the Suzuki Swift, Toyota Yaris, Mazda2, MG3 and Kia Picanto. Compare affordability, fuel consumption, safety and city-driving practicality.`,
        },
        {
          question: "What is the difference between micro, small and medium hatchbacks?",
          answer: `Micro hatchbacks are generally the most compact, while small and medium models offer progressively more cabin and cargo space. Actual vehicle dimensions vary by manufacturer.`,
        },
        {
          question: "What is the difference between a 3-door and 5-door hatchback?",
          answer: `A 3-door hatchback has two side doors and a rear hatch, while a 5-door model adds two rear passenger doors. Five-door models generally provide easier rear-seat access.`,
        },
        {
          question: "Are hatchbacks suitable for families and long-distance travel?",
          answer: `Yes. Hatchbacks such as the Toyota Corolla, Mazda3 and Hyundai i30 can suit smaller families and longer trips. Compare rear-seat comfort, boot space, safety and fuel economy.`,
        },
        {
          question: "What should I look for in hatchback boot space?",
          answer: `Check luggage capacity, boot opening size, loading height and split-folding rear seats. Hatchbacks with flexible cargo arrangements can make shopping, luggage and everyday transport easier.`,
        },
      ],
    },
    {
      label: "Electric & Hybrid Hatchbacks",
      items: [
        {
          question: "Where can I find electric hatchbacks for sale?",
          answer: `Browse <a href="/listings/electric-fuel-type/">electric hatchbacks for sale</a> on HatchbacksForSale.com.au. Compare available MG4, BYD and other electric models by price, range and features.`,
        },
        {
          question: "Where can I find hybrid hatchbacks for sale?",
          answer: `Explore <a href="/listings/hybrid-fuel-type/">hybrid hatchbacks for sale</a>, including available Toyota Corolla, MG3 Hybrid and Suzuki Swift variants. Compare fuel consumption, prices and features.`,
        },
        {
          question: "What is the difference between electric and hybrid hatchbacks?",
          answer: `Electric hatchbacks run entirely on battery power, while hybrid models combine a petrol engine with electric assistance. Conventional hybrids generally don't require external charging.`,
        },
        {
          question: "Are electric hatchbacks suitable for everyday driving?",
          answer: `Yes. Electric hatchbacks can suit commuting, shopping and city travel, particularly with convenient charging access. Compare driving range, battery capacity, charging speed and running costs.`,
        },
        {
          question: "What are the benefits of owning a hybrid hatchback?",
          answer: `Hybrid hatchbacks can reduce fuel consumption, particularly in stop-start traffic. They combine petrol-engine convenience with electric assistance, making them practical for everyday driving.`,
        },
        {
          question: "Which hatchbacks offer low running costs?",
          answer: `Fuel-efficient petrol, hybrid and electric hatchbacks can offer relatively low running costs. Compare energy consumption, servicing, insurance, tyres and depreciation rather than fuel costs alone.`,
        },
      ],
    },
    {
      label: "Hot Hatches & Performance",
      items: [
        {
          question: "What is a hot hatchback?",
          answer: `A hot hatch is a performance-focused hatchback with a more powerful engine or electric drivetrain, sportier handling and upgraded features compared with a regular model.`,
        },
        {
          question: "What are the most popular hot hatchbacks in Australia?",
          answer: `Well-known hot hatches include the Volkswagen Golf GTI and R, Hyundai i30 N, Toyota GR Yaris, Honda Civic Type R and Mercedes-AMG A45.`,
        },
        {
          question: "Where can I find performance hatchbacks for sale?",
          answer: `Browse hatchbacks by manufacturer and model on HatchbacksForSale.com.au. Look for performance variants such as Golf GTI, i30 N, GR Yaris and Civic Type R.`,
        },
        {
          question: "Are AWD performance hatchbacks available in Australia?",
          answer: `Yes. Models such as the Volkswagen Golf R, Toyota GR Yaris and Mercedes-AMG A45 offer all-wheel-drive performance. Compare traction systems, power, handling and running costs.`,
        },
        {
          question: "Are manual or automatic hatchbacks better for driving?",
          answer: `Automatic hatchbacks offer convenience in traffic, while manual models provide greater control over gear selection. The best choice depends on driving preferences, vehicle availability and daily use.`,
        },
        {
          question: "What should I check before buying a modified hot hatch?",
          answer: `Inspect the engine, transmission, suspension, brakes and tyres. Review modification records, servicing, roadworthiness and any engineering approvals required for aftermarket changes.`,
        },
      ],
    },
    {
      label: "Hatchbacks for Sale by Location",
      items: [
        {
          question: "Where can I find hatchbacks for sale in Sydney?",
          answer: `Browse <a href="/listings/new-south-wales-state/sydney-region/">hatchbacks for sale in Sydney</a> on HatchbacksForSale.com.au. Compare new and used models from dealerships and private sellers.`,
        },
        {
          question: "Where can I find hatchbacks for sale in Melbourne?",
          answer: `Explore <a href="/listings/victoria-state/melbourne-region/">hatchbacks for sale in Melbourne</a> and compare available models by price, make, condition, fuel type and features.`,
        },
        {
          question: "Where can I find hatchbacks for sale in Brisbane?",
          answer: `Browse <a href="/listings/queensland-state/brisbane-region/">hatchbacks for sale in Brisbane</a> and compare affordable, family, hybrid, electric and performance models.`,
        },
        {
          question: "Where can I find hatchbacks for sale in Perth?",
          answer: `Explore <a href="/listings/western-australia-state/perth-region/">hatchbacks for sale in Perth</a> and compare available vehicles by make, price, condition and specifications.`,
        },
        {
          question: "Where can I find hatchbacks for sale in Adelaide?",
          answer: `Browse <a href="/listings/south-australia-state/adelaide-region/">hatchbacks for sale in Adelaide</a> on HatchbacksForSale.com.au. Compare available vehicles from dealers and private sellers.`,
        },
        {
          question: "How can I find hatchbacks for sale near me?",
          answer: `Use the location filters on HatchbacksForSale.com.au to find available vehicles in your state, city or region. Narrow results by make, price and condition.`,
        },
      ],
    },
    {
      label: "Selling a Hatchback",
      items: [
        {
          question: "How do I sell my hatchback online in Australia?",
          answer: `You can <a href="${SELL}">sell your car online</a> through our unified automotive marketplace network. Create one advertisement and reach interested buyers across relevant websites.`,
        },
        {
          question: "How much does it cost to advertise a hatchback?",
          answer: `Private sellers pay a one-time fee of $49 including GST through SellMyCarOnline.au. There are no monthly listing fees or commissions on the final sale.`,
        },
        {
          question: "How long will my hatchback advertisement stay online?",
          answer: `Your private seller advertisement stays live until your vehicle is sold, with no recurring monthly listing charges.`,
        },
        {
          question: "Will my hatchback be advertised across multiple marketplaces?",
          answer: `Yes. Eligible hatchbacks are automatically advertised across relevant automotive marketplaces within our network, based on their body type, fuel type, drivetrain and other vehicle attributes.`,
        },
        {
          question: "What information should I include in my hatchback advertisement?",
          answer: `Include the make, model, year, kilometres, condition, asking price, fuel type, transmission and features. Add clear interior and exterior photos, plus available service history.`,
        },
        {
          question: "Can private sellers and dealerships advertise hatchbacks?",
          answer: `Yes. Private sellers can list through SellMyCarOnline.au, while dealerships can <a href="${DEALER}">advertise eligible stock</a> through our unified automotive marketplace network.`,
        },
      ],
    },
    {
      label: "General & Buying",
      items: [
        {
          question: "Where can I find hatchbacks for sale in Australia?",
          answer: `Browse <a href="/listings/">new and used hatchbacks for sale</a> on HatchbacksForSale.com.au. Compare vehicles from dealerships and private sellers across Australia by price, make, model, location and features.`,
        },
        {
          question: "What is a hatchback car?",
          answer: `A hatchback is a car with a rear door that lifts upwards to access the boot and passenger cabin. Hatchbacks are popular for their compact size, practicality and flexible cargo space.`,
        },
        {
          question: "What is the difference between a hatchback and a sedan?",
          answer: `Hatchbacks have a lift-up rear door and flexible cargo area, while sedans typically have a separate boot. Compare hatchbacks with <a href="https://www.sedansforsale.com.au/">sedans for sale</a> to explore both styles.`,
        },
        {
          question: "What are the benefits of owning a hatchback?",
          answer: `Hatchbacks offer practical cargo space, easy parking and comfortable everyday driving. Many smaller models also provide economical fuel consumption and affordable running costs.`,
        },
        {
          question: "Are hatchbacks suitable for first-time car buyers?",
          answer: `Yes. Hatchbacks such as the Toyota Yaris, Suzuki Swift, Kia Picanto and Mazda2 are popular options for first-time buyers. Compare safety, reliability, insurance and running costs.`,
        },
        {
          question: "What should I consider when buying a hatchback?",
          answer: `Consider your budget, vehicle size, fuel economy, safety features, boot space and running costs. For used hatchbacks, check kilometres travelled, service history and mechanical condition.`,
        },
        {
          question: "How can I compare different hatchbacks for sale?",
          answer: `Compare hatchbacks by make, model, year, price, kilometres, fuel type, transmission, body size and features. Use the search filters on HatchbacksForSale.com.au to narrow your options.`,
        },
        {
          question: "Are hatchbacks available from private sellers and dealers?",
          answer: `Yes. HatchbacksForSale.com.au features new, used and demo hatchbacks advertised by Australian dealerships and private sellers. Compare available vehicles and contact advertisers directly.`,
        },
      ],
    },
  ],
  sedans: [
    {
      label: "New, Used & Prices",
      items: [
        {
          question: "Where can I find new sedans for sale in Australia?",
          answer: `Browse <a href="/listings/new-condition/">new sedans for sale</a> on SedansForSale.com.au. Compare available models from Australian dealerships by make, price, size, fuel type and specifications.`,
        },
        {
          question: "Where can I find used sedans for sale?",
          answer: `Explore <a href="/listings/used-condition/">used sedans for sale</a> across Australia. Compare second-hand vehicles from dealerships and private sellers by price, age, kilometres and condition.`,
        },
        {
          question: "Is it better to buy a new or used sedan?",
          answer: `New sedans offer current features and applicable manufacturer warranties, while used sedans generally cost less. Compare purchase price, condition, reliability and running costs before deciding.`,
        },
        {
          question: "How much does a new sedan cost in Australia?",
          answer: `Some new sedans start around $30,000, while premium and performance models can exceed $100,000. Prices depend on brand, size, fuel type and features.`,
        },
        {
          question: "How much does a used sedan cost in Australia?",
          answer: `Used sedans can cost under $10,000 for older models or exceed $80,000 for newer luxury vehicles. Age, kilometres, brand, condition and features influence asking prices.`,
        },
        {
          question: "Where can I find cheap sedans under $10,000?",
          answer: `Browse <a href="/listings/under-10000/">sedans under $10,000</a> on SedansForSale.com.au. Compare affordable used models by age, kilometres, condition and service history.`,
        },
        {
          question: "What should I check before buying a used sedan?",
          answer: `Inspect the engine, transmission, tyres, brakes, suspension and bodywork. Review service records, check for accident damage and conduct a PPSR search before purchasing.`,
        },
        {
          question: "Is it better to buy a sedan privately or through a dealership?",
          answer: `Dealership purchases generally provide stronger consumer protections, while private sales may offer competitive prices. Compare vehicle condition, seller details, price and applicable warranty coverage.`,
        },
      ],
    },
    {
      label: "Sedan Brands & Models",
      items: [
        {
          question: "What are the most popular sedan brands in Australia?",
          answer: `Well-known sedan brands include Toyota, Hyundai, Kia, Mazda, BMW, Mercedes-Benz, Lexus, Tesla and BYD. Compare available models by comfort, reliability, features and price.`,
        },
        {
          question: "Where can I find Toyota Camry sedans for sale?",
          answer: `Browse <a href="/listings/toyota/camry/">Toyota Camry sedans for sale</a> on SedansForSale.com.au. Compare available petrol and hybrid models by year, price, condition and features.`,
        },
        {
          question: "Is the Toyota Corolla Sedan suitable for families?",
          answer: `The Toyota Corolla Sedan offers practical seating, a separate boot and economical driving. Explore <a href="/listings/toyota/corolla/">Toyota Corolla sedans for sale</a> to compare available models.`,
        },
        {
          question: "Where can I find Hyundai i30 Sedans for sale?",
          answer: `Browse <a href="/listings/hyundai/">Hyundai sedans for sale</a>, including available i30 Sedan, N Line and performance variants. Compare prices, fuel types, features and condition.`,
        },
        {
          question: "Where can I find Kia K4 sedans for sale?",
          answer: `Explore <a href="/listings/kia/">Kia sedans for sale</a>, including available K4 and older Cerato models. Compare comfort, technology, fuel economy and specifications.`,
        },
        {
          question: "Where can I find Mazda6 sedans for sale?",
          answer: `Browse <a href="/listings/mazda/">Mazda sedans for sale</a>, including available Mazda6 and Mazda3 Sedan models. Compare prices, condition, performance and features.`,
        },
        {
          question: "Where can I find BMW sedans for sale?",
          answer: `Explore <a href="/listings/bmw/">BMW sedans for sale</a>, including available 3 Series, 5 Series and performance models. Compare luxury features, engines, drivetrains and prices.`,
        },
        {
          question: "Where can I find Mercedes-Benz sedans for sale?",
          answer: `Browse <a href="/listings/mercedes-benz/">Mercedes-Benz sedans for sale</a>, including available C-Class, E-Class, S-Class and AMG models. Compare comfort, technology and performance.`,
        },
        {
          question: "Where can I find used Holden and Ford sedans for sale?",
          answer: `Browse <a href="/listings/holden/">Holden sedans</a> and <a href="/listings/ford/">Ford sedans</a>, including available Commodore and Falcon models. Compare age, condition, kilometres and service history.`,
        },
        {
          question: "Where can I find Tesla Model 3 sedans for sale?",
          answer: `Explore <a href="/listings/tesla/model-3/">Tesla Model 3 sedans for sale</a> on SedansForSale.com.au. Compare available electric models by year, driving range, price and features.`,
        },
      ],
    },
    {
      label: "Sedan Sizes, Comfort & Features",
      items: [
        {
          question: "What is the difference between small, medium and large sedans?",
          answer: `<a href="/listings/small-body-size/">Small</a>, <a href="/listings/medium-body-size/">medium</a> and <a href="/listings/large-body-size/">large sedans</a> offer different levels of passenger space, boot capacity and comfort. Vehicle dimensions vary by manufacturer.`,
        },
        {
          question: "What are the best family sedans in Australia?",
          answer: `Popular family options include the Toyota Camry, Hyundai i30 Sedan, Kia K4 and Honda Accord. Compare rear-seat comfort, boot space, safety features and fuel economy.`,
        },
        {
          question: "Are large sedans comfortable for long-distance travel?",
          answer: `Yes. Large sedans often provide spacious seating, comfortable suspension and generous boot capacity. Compare ride quality, fuel economy, safety technology and highway driving comfort.`,
        },
        {
          question: "What should I look for in a sedan with a spacious boot?",
          answer: `Check luggage capacity, boot opening size, loading height and folding rear seats. A practical boot can make family travel, shopping and carrying larger items easier.`,
        },
        {
          question: "What safety features should I look for in a sedan?",
          answer: `Look for autonomous emergency braking, blind-spot monitoring, lane-keeping assistance, reversing cameras and suitable child-seat anchors. Check the vehicle's applicable ANCAP safety rating.`,
        },
        {
          question: "Are automatic sedans easier to drive than manual models?",
          answer: `Automatic sedans can be more convenient in city traffic and stop-start commuting. Manual models provide greater control over gear selection, depending on driving preferences.`,
        },
      ],
    },
    {
      label: "Hybrid, Electric & AWD Sedans",
      items: [
        {
          question: "Where can I find hybrid sedans for sale?",
          answer: `Browse <a href="/listings/hybrid-fuel-type/">hybrid sedans for sale</a>, including available Toyota Camry, Corolla Sedan and other hybrid models. Compare fuel consumption, prices and features.`,
        },
        {
          question: "Where can I find electric sedans for sale?",
          answer: `Explore <a href="/listings/electric-fuel-type/">electric sedans for sale</a>, including available Tesla Model 3, BYD Seal and other electric models. Compare range, charging and price.`,
        },
        {
          question: "What is the difference between petrol, hybrid and electric sedans?",
          answer: `Petrol sedans use an internal combustion engine, hybrids combine an engine with electric assistance, and fully electric sedans run on battery power. Each has different running costs and refuelling requirements.`,
        },
        {
          question: "What are the benefits of owning a hybrid sedan?",
          answer: `Hybrid sedans can reduce fuel consumption, particularly in stop-start traffic. They combine petrol-engine convenience with electric assistance, making them suitable for everyday commuting.`,
        },
        {
          question: "Where can I find AWD sedans for sale?",
          answer: `Browse <a href="/listings/all-wheel-drive-drive-type/">AWD sedans for sale</a>, including available Subaru, BMW, Audi, Mercedes-Benz and electric models. Compare traction, performance and features.`,
        },
        {
          question: "What should I check before buying a used electric sedan?",
          answer: `Check battery warranty details, available battery-health information, charging performance, service history and tyres. Consider an independent inspection and compare remaining warranty coverage.`,
        },
      ],
    },
    {
      label: "Luxury, Performance & Classic Sedans",
      items: [
        {
          question: "Where can I find luxury sedans for sale?",
          answer: `Browse premium sedans from BMW, Mercedes-Benz, Audi, Lexus and other manufacturers. Compare interior comfort, technology, performance, servicing costs and available features.`,
        },
        {
          question: "What is the difference between a standard and executive sedan?",
          answer: `Executive sedans generally emphasise premium comfort, larger interiors and advanced technology. Models such as the BMW 5 Series and Mercedes-Benz E-Class are examples.`,
        },
        {
          question: "What are the best sports sedans in Australia?",
          answer: `Popular performance sedans include the BMW M3, Mercedes-AMG C-Class, Audi S4 and Subaru WRX. Compare engine performance, handling, transmission, drivetrain and running costs.`,
        },
        {
          question: "Are rear-wheel-drive sedans better for performance driving?",
          answer: `Rear-wheel-drive sedans can offer engaging handling, while AWD provides additional acceleration traction. Performance depends on suspension, tyres, power delivery and vehicle design.`,
        },
        {
          question: "Are classic Holden and Ford sedans worth buying?",
          answer: `Older Holden Commodore and Ford Falcon models appeal to Australian car enthusiasts. Check rust, mechanical condition, originality, servicing and parts availability before purchasing.`,
        },
      ],
    },
    {
      label: "Sedans for Sale by Location",
      items: [
        {
          question: "Where can I find sedans for sale in Sydney?",
          answer: `Browse <a href="/listings/new-south-wales-state/sydney-region/">sedans for sale in Sydney</a> on SedansForSale.com.au. Compare new and used models from dealerships and private sellers.`,
        },
        {
          question: "Where can I find sedans for sale in Melbourne?",
          answer: `Explore <a href="/listings/victoria-state/melbourne-region/">sedans for sale in Melbourne</a> and compare available models by make, price, condition, fuel type and features.`,
        },
        {
          question: "Where can I find sedans for sale in Brisbane?",
          answer: `Browse <a href="/listings/queensland-state/brisbane-region/">sedans for sale in Brisbane</a> and compare available family, luxury, hybrid and electric models.`,
        },
        {
          question: "Where can I find sedans for sale in Perth?",
          answer: `Explore <a href="/listings/western-australia-state/perth-region/">sedans for sale in Perth</a> and compare available vehicles by make, price, condition and specifications.`,
        },
        {
          question: "Where can I find sedans for sale in Adelaide?",
          answer: `Browse <a href="/listings/south-australia-state/adelaide-region/">sedans for sale in Adelaide</a> and compare available models from dealerships and private sellers.`,
        },
        {
          question: "How can I find sedans for sale near me?",
          answer: `Use the location filters on SedansForSale.com.au to find available sedans in your state, city or region. Narrow results by make, price and condition.`,
        },
      ],
    },
    {
      label: "Selling a Sedan",
      items: [
        {
          question: "How do I sell my sedan online in Australia?",
          answer: `You can <a href="${SELL}">sell your car online</a> through our unified automotive marketplace network. Create one advertisement and reach potential buyers across relevant websites.`,
        },
        {
          question: "How much does it cost to advertise a sedan?",
          answer: `Private sellers pay a one-time fee of $49 including GST through SellMyCarOnline.au. Your advertisement stays live until sold, with no monthly listing fees or sales commission.`,
        },
        {
          question: "Will my sedan be advertised across multiple marketplaces?",
          answer: `Yes. Eligible sedans are automatically advertised across relevant automotive marketplaces within our network, based on their body type, fuel type, drivetrain and other attributes.`,
        },
        {
          question: "What information should I include in a sedan advertisement?",
          answer: `Include the make, model, year, kilometres, condition, asking price, fuel type, transmission and features. Add clear interior and exterior photographs, plus available service history.`,
        },
        {
          question: "How do I determine the resale value of my sedan?",
          answer: `Compare similar sedans by make, model, year, kilometres, condition and features. Review current asking prices on SedansForSale.com.au to estimate a competitive selling price.`,
        },
        {
          question: "Can private sellers and dealerships advertise sedans?",
          answer: `Yes. Private sellers can advertise through SellMyCarOnline.au, while dealerships can <a href="${DEALER}">advertise eligible stock</a> through our unified automotive marketplace network.`,
        },
      ],
    },
    {
      label: "General & Buying",
      items: [
        {
          question: "Where can I find sedans for sale in Australia?",
          answer: `Browse <a href="/listings/">new and used sedans for sale</a> on SedansForSale.com.au. Compare vehicles from dealerships and private sellers across Australia by price, make, model, location and features.`,
        },
        {
          question: "What is the difference between a sedan, hatchback and wagon?",
          answer: `Sedans have a separate boot, hatchbacks feature a lift-up rear door, and wagons generally offer an extended roofline with more flexible cargo space. Each suits different driving needs.`,
        },
        {
          question: "What are the benefits of owning a sedan?",
          answer: `Sedans offer comfortable passenger accommodation, a separate boot and practical everyday driving. Many models also provide good fuel efficiency, safety features and highway comfort.`,
        },
        {
          question: "Are sedans suitable for everyday driving in Australia?",
          answer: `Yes. Sedans suit city commuting, family transport and long-distance travel. Popular models such as the Toyota Camry, Hyundai i30 Sedan and Kia K4 offer different levels of comfort and practicality.`,
        },
        {
          question: "What should I consider when choosing a sedan?",
          answer: `Consider your budget, passenger space, boot capacity, fuel consumption, safety features and running costs. For used sedans, check kilometres travelled, service history and mechanical condition.`,
        },
        {
          question: "Are sedans suitable for first-time car buyers?",
          answer: `Yes. Compact sedans such as the Toyota Corolla Sedan and Hyundai i30 Sedan can suit first-time buyers. Compare reliability, safety, insurance, fuel economy and maintenance costs.`,
        },
        {
          question: "Can I buy sedans from private sellers and dealerships?",
          answer: `Yes. SedansForSale.com.au features new, used and demo sedans advertised by Australian dealerships and private sellers. Buyers can compare vehicles and contact advertisers directly.`,
        },
        {
          question: "How can I compare different sedans for sale?",
          answer: `Compare sedans by make, model, year, price, kilometres, body size, fuel type, transmission, drivetrain and features. Use the search filters on SedansForSale.com.au to narrow your options.`,
        },
      ],
    },
  ],
  electric: [
    {
      label: "New, Used & Prices",
      items: [
        {
          question: "Where can I find new electric cars for sale in Australia?",
          answer: `Browse <a href="/listings/new-condition/">new electric cars for sale</a> on ElectricCarsForSale.au. Compare available models from Australian dealerships by price, make, battery capacity, driving range and features.`,
        },
        {
          question: "Where can I find used electric cars for sale?",
          answer: `Explore <a href="/listings/used-condition/">used electric cars for sale</a> across Australia. Compare second-hand EVs from dealers and private sellers by price, age, kilometres, battery condition and features.`,
        },
        {
          question: "Is it better to buy a new or used electric car?",
          answer: `New EVs offer current technology and applicable manufacturer warranties, while used models generally cost less. Compare battery health, remaining warranty, real-world range and overall condition.`,
        },
        {
          question: "What should I check before buying a used electric car?",
          answer: `Check battery health, remaining battery warranty, charging port, cables, tyres and service history. Arrange an EV-specific inspection and conduct a PPSR search before purchasing.`,
        },
        {
          question: "How much does a new electric car cost in Australia?",
          answer: `Some entry-level electric cars cost under $30,000, while premium and luxury models can exceed $100,000. Prices vary by manufacturer, battery size, driving range and features.`,
        },
        {
          question: "How much does a used electric car cost in Australia?",
          answer: `Some older used EVs are available for under $20,000, while newer premium models can exceed $60,000. Battery health, age, kilometres and remaining warranty influence prices.`,
        },
        {
          question: "Where can I find electric cars under $30,000?",
          answer: `Browse <a href="/listings/between-20000-30000/">electric cars between $20,000 and $30,000</a> or explore lower price ranges. Compare affordable used EVs by battery condition, charging compatibility and driving range.`,
        },
      ],
    },
    {
      label: "EV Brands & Models",
      items: [
        {
          question: "What are the most popular electric car brands in Australia?",
          answer: `Established EV brands include Tesla, BYD, MG, Hyundai, Kia, BMW, Mercedes-Benz and Polestar. Other options include Geely, XPENG, Leapmotor and GWM. Compare models by price, range and features.`,
        },
        {
          question: "Where can I find Tesla electric cars for sale?",
          answer: `Browse <a href="/listings/tesla/">Tesla electric cars for sale</a>, including available Model 3, Model Y, Model S and Model X vehicles. Compare driving range, drivetrain, battery options and prices.`,
        },
        {
          question: "Where can I find BYD electric cars for sale?",
          answer: `Explore <a href="/listings/byd/">BYD electric cars for sale</a>, including available Atto, Dolphin and Seal models. Compare prices, battery capacity, range and specifications.`,
        },
        {
          question: "Where can I find MG electric cars for sale?",
          answer: `Browse <a href="/listings/mg/">MG electric cars for sale</a>, including available MG4, ZS EV and other fully electric models. Compare affordability, battery options and features.`,
        },
        {
          question: "Where can I find Hyundai electric cars for sale?",
          answer: `Explore <a href="/listings/hyundai/">Hyundai electric cars for sale</a>, including available Kona Electric, IONIQ 5, IONIQ 6 and other models. Compare range, charging capability and prices.`,
        },
        {
          question: "Where can I find Kia electric cars for sale?",
          answer: `Browse <a href="/listings/kia/">Kia electric cars for sale</a>, including available EV3, EV4, EV5, EV6 and EV9 models. Compare vehicle size, driving range and features.`,
        },
        {
          question: "Where can I find Geely electric cars for sale?",
          answer: `Explore <a href="/listings/geely/">Geely electric cars for sale</a>, including available EX2 and EX5 models. Compare battery capacity, driving range, equipment and prices.`,
        },
        {
          question: "Where can I find XPENG electric cars for sale?",
          answer: `Browse <a href="/listings/xpeng/">XPENG electric cars for sale</a>, including available G6 and other models. Compare driving range, charging technology, interior features and pricing.`,
        },
      ],
    },
    {
      label: "Electric Car Types",
      items: [
        {
          question: "Where can I find electric SUVs for sale?",
          answer: `Browse <a href="/listings/suv-body-type/">electric SUVs for sale</a>, including available family, compact and luxury models. Compare seating, luggage space, range and battery capacity.`,
        },
        {
          question: "Where can I find electric hatchbacks for sale?",
          answer: `Explore <a href="/listings/hatchback-body-type/">electric hatchbacks for sale</a>, including available MG4 and other compact EVs. Compare affordability, parking convenience, battery range and practicality.`,
        },
        {
          question: "Where can I find electric sedans for sale?",
          answer: `Browse <a href="/listings/sedan-body-type/">electric sedans for sale</a>, including available Tesla Model 3, BYD Seal, Polestar 2 and other models. Compare range, comfort and performance.`,
        },
        {
          question: "What are the best small electric cars for city driving?",
          answer: `Compact EVs such as the BYD Dolphin, MG4 and Hyundai Inster can suit city driving. Compare vehicle dimensions, parking convenience, battery range and charging requirements.`,
        },
        {
          question: "Which electric cars are suitable for families?",
          answer: `Electric SUVs such as the Tesla Model Y, Kia EV5, Hyundai IONIQ 5 and BYD Atto 3 offer family-oriented options. Compare seating, boot space, safety and driving range.`,
        },
      ],
    },
    {
      label: "Batteries, Charging & Range",
      items: [
        {
          question: "What is the difference between battery capacity and driving range?",
          answer: `Battery capacity is measured in kilowatt-hours (kWh), while driving range is the distance an EV can travel per charge. Efficiency and driving conditions also affect range.`,
        },
        {
          question: "How long do electric car batteries last?",
          answer: `Modern EV batteries are designed to last many years, although capacity gradually declines. Battery lifespan depends on chemistry, usage, charging habits and temperature.`,
        },
        {
          question: "How do I check the battery health of a used electric car?",
          answer: `Request a battery State of Health (SoH) report, which estimates remaining usable capacity compared with when new. An independent EV battery assessment can provide additional confidence.`,
        },
        {
          question: "What should I know about electric car battery warranties?",
          answer: `Many electric cars offer battery warranties of around eight years or 160,000 kilometres. Check the manufacturer's exact conditions, capacity guarantees and transferability before purchasing.`,
        },
        {
          question: "How do I charge an electric car at home in Australia?",
          answer: `EVs can be charged using compatible portable charging equipment or a dedicated home charger. A properly installed wall charger generally offers faster and more convenient charging.`,
        },
        {
          question: "What types of electric car chargers are available?",
          answer: `Common options include standard power-point charging, dedicated AC home or destination chargers, and public DC fast chargers. Charging speed depends on the vehicle and charger.`,
        },
        {
          question: "How long does it take to charge an electric car?",
          answer: `Charging time depends on battery size, starting charge level and charger power. Home charging may take several hours, while compatible DC fast chargers can recharge much faster.`,
        },
        {
          question: "How much does it cost to charge an electric car in Australia?",
          answer: `Charging costs depend on electricity rates, energy consumed and charger type. Home charging is often cheaper than public fast charging, particularly with off-peak electricity or solar power.`,
        },
        {
          question: "Why does an electric car's actual driving range differ from its advertised range?",
          answer: `Real-world range depends on driving speed, weather, terrain, air conditioning, vehicle load and battery condition. Motorway driving and extreme temperatures can increase energy consumption.`,
        },
        {
          question: "How do I plan a long-distance trip in an electric car?",
          answer: `Check your vehicle's realistic driving range and identify compatible charging stations along your route. Allow for charging time, weather, terrain and alternative charging locations.`,
        },
      ],
    },
    {
      label: "Costs & Ownership",
      items: [
        {
          question: "Are electric cars cheaper to maintain than petrol cars?",
          answer: `Electric cars generally require less routine drivetrain maintenance because they have fewer moving parts. However, tyres, brakes, suspension, cooling systems and other components still need servicing.`,
        },
        {
          question: "Are electric cars cheaper to run than hybrid cars?",
          answer: `Electric cars can have lower energy costs, particularly when charged at home. Total ownership costs depend on purchase price, electricity rates, servicing, insurance and depreciation.`,
        },
        {
          question: "How much does electric car insurance cost in Australia?",
          answer: `Insurance premiums vary by model, vehicle value, location, driver history and coverage. Compare quotes before buying, particularly for premium EVs and vehicles with expensive replacement components.`,
        },
        {
          question: "What affects the resale value of an electric car?",
          answer: `Resale value depends on brand, model, age, kilometres, battery health, remaining warranty and market demand. Changes in new EV prices and technology can also influence depreciation.`,
        },
        {
          question: "Are electric car rebates or incentives available in Australia?",
          answer: `Some electric vehicles may qualify for government incentives or tax concessions, depending on location, eligibility and current rules. Check the applicable government programs before buying.`,
        },
        {
          question: "Can I get finance to buy an electric car?",
          answer: `Yes. Banks and vehicle lenders offer finance for eligible new and used EVs. Compare interest rates, fees, repayment terms and any available electric-vehicle finance offers.`,
        },
      ],
    },
    {
      label: "Electric Cars for Sale by Location",
      items: [
        {
          question: "Where can I find electric cars for sale in Sydney?",
          answer: `Browse <a href="/listings/new-south-wales-state/sydney-region/">electric cars for sale in Sydney</a> on ElectricCarsForSale.au. Compare new and used EVs from dealerships and private sellers.`,
        },
        {
          question: "Where can I find electric cars for sale in Melbourne?",
          answer: `Explore <a href="/listings/victoria-state/melbourne-region/">electric cars for sale in Melbourne</a> and compare available models by price, manufacturer, battery capacity and driving range.`,
        },
        {
          question: "Where can I find electric cars for sale in Brisbane?",
          answer: `Browse <a href="/listings/queensland-state/brisbane-region/">electric cars for sale in Brisbane</a> and compare available electric SUVs, hatchbacks and sedans from dealerships and private sellers.`,
        },
        {
          question: "Where can I find electric cars for sale in Perth?",
          answer: `Explore <a href="/listings/western-australia-state/perth-region/">electric cars for sale in Perth</a> and compare vehicles by make, price, condition, battery range and features.`,
        },
        {
          question: "Where can I find electric cars for sale in Adelaide?",
          answer: `Browse <a href="/listings/south-australia-state/adelaide-region/">electric cars for sale in Adelaide</a> on ElectricCarsForSale.au. Compare available new, used and demo electric vehicles.`,
        },
        {
          question: "How can I find electric cars for sale near me?",
          answer: `Use the location filters on ElectricCarsForSale.au to search by state, city or region. Narrow results by make, price, driving range and condition.`,
        },
      ],
    },
    {
      label: "Selling an Electric Car",
      items: [
        {
          question: "How do I sell my electric car online in Australia?",
          answer: `You can <a href="${SELL}">sell your car online</a> through our unified automotive marketplace network. Create one listing and advertise your eligible electric car across relevant websites.`,
        },
        {
          question: "How much does it cost to advertise an electric car?",
          answer: `Private sellers pay a one-time fee of $49 including GST through SellMyCarOnline.au. There are no monthly listing fees or commissions on the final sale.`,
        },
        {
          question: "Will my electric car be advertised across multiple marketplaces?",
          answer: `Yes. Eligible electric cars are automatically advertised across relevant automotive marketplaces within our network, based on body type, fuel type, drivetrain and other vehicle attributes.`,
        },
        {
          question: "How long will my electric car advertisement stay online?",
          answer: `Your private seller advertisement stays live until your vehicle is sold, with no recurring monthly listing charges.`,
        },
        {
          question: "What information should I include in an electric car advertisement?",
          answer: `Include the make, model, year, kilometres, battery capacity, driving range, asking price and condition. Add charging specifications, available battery-health information, warranty details and clear photographs.`,
        },
        {
          question: "Can private sellers and dealerships advertise electric cars?",
          answer: `Yes. Private sellers can list through SellMyCarOnline.au, while dealerships can <a href="${DEALER}">advertise eligible stock</a> through our unified automotive marketplace network.`,
        },
      ],
    },
    {
      label: "General & Buying",
      items: [
        {
          question: "Where can I find electric cars for sale in Australia?",
          answer: `Browse <a href="/listings/">new and used electric cars for sale</a> on ElectricCarsForSale.au. Compare fully electric vehicles from dealerships and private sellers across Australia by price, make, model, driving range and location.`,
        },
        {
          question: "What is the difference between an electric car and a hybrid car?",
          answer: `Fully electric cars run entirely on rechargeable battery power, while hybrid cars combine an internal combustion engine with electric assistance. Compare electric vehicles with <a href="https://www.hybridcarsforsale.com.au/">hybrid cars for sale</a> to explore both options.`,
        },
        {
          question: "What are the benefits of owning an electric car?",
          answer: `Electric cars offer quiet driving, instant torque and potentially lower energy and maintenance costs. They produce no exhaust emissions, although overall environmental impact depends on electricity sources and manufacturing.`,
        },
        {
          question: "Are electric cars suitable for everyday driving in Australia?",
          answer: `Yes. Many electric cars are well suited to commuting, school runs and everyday travel. Consider your daily driving distance, charging access, battery range and running costs.`,
        },
        {
          question: "What are the most popular electric cars in Australia?",
          answer: `Well-known models include the Tesla Model 3 and Model Y, BYD Atto 3 and Seal, MG4, Hyundai IONIQ 5 and Kia EV5. Compare available models by range, price and features.`,
        },
        {
          question: "What should I consider before buying an electric car?",
          answer: `Consider your budget, driving range, battery capacity, charging access, warranty and running costs. For used electric cars, check battery health, service history and remaining warranty coverage.`,
        },
        {
          question: "Are electric cars suitable for long-distance travel in Australia?",
          answer: `Yes. Many modern EVs can travel several hundred kilometres per charge. Plan charging stops around your vehicle's real-world range, charger availability and travel conditions.`,
        },
        {
          question: "How can I compare different electric cars for sale?",
          answer: `Compare electric cars by make, model, year, price, battery capacity, driving range, charging speed, drivetrain and features. Use the filters on ElectricCarsForSale.au to narrow your options.`,
        },
      ],
    },
  ],
  hybrid: [
    {
      label: "New, Used & Prices",
      items: [
        {
          question: "Where can I find new hybrid cars for sale in Australia?",
          answer: `Browse <a href="/listings/new-condition/">new hybrid cars for sale</a> on HybridCarsForSale.com.au. Compare available models from Australian dealerships by price, make, fuel type, body style and features.`,
        },
        {
          question: "Where can I find used hybrid cars for sale?",
          answer: `Explore <a href="/listings/used-condition/">used hybrid cars for sale</a> across Australia. Compare second-hand hybrids from dealerships and private sellers by price, age, kilometres and condition.`,
        },
        {
          question: "Is it better to buy a new or used hybrid car?",
          answer: `New hybrids offer current technology and applicable manufacturer warranties, while used models generally cost less. Compare battery condition, remaining warranty, service history and running costs.`,
        },
        {
          question: "How much does a hybrid car cost in Australia?",
          answer: `Hybrid cars can cost under $20,000 for some older used models or over $100,000 for premium vehicles. Prices depend on brand, age, hybrid technology, condition and features.`,
        },
        {
          question: "Where can I find affordable hybrid cars under $20,000?",
          answer: `Browse <a href="/listings/between-10000-20000/">hybrid cars between $10,000 and $20,000</a>. Compare affordable used models by kilometres, service history, battery condition and price.`,
        },
        {
          question: "Where can I find hybrid cars under $30,000?",
          answer: `Explore <a href="/listings/between-20000-30000/">hybrid cars between $20,000 and $30,000</a> or select a lower budget. Compare available hatchbacks, sedans and SUVs by condition and fuel efficiency.`,
        },
        {
          question: "What should I check before buying a used hybrid car?",
          answer: `Inspect the engine, transmission, brakes, tyres and hybrid system. Review battery-health information, service records and remaining warranty, and conduct a PPSR search before purchasing.`,
        },
      ],
    },
    {
      label: "Hybrid Brands & Models",
      items: [
        {
          question: "What are the most popular hybrid car brands in Australia?",
          answer: `Well-known hybrid brands include Toyota, Hyundai, Kia, Honda, Lexus, Mitsubishi, BYD, MG and GWM. Compare available models by fuel economy, hybrid technology, reliability and price.`,
        },
        {
          question: "Where can I find Toyota hybrid cars for sale?",
          answer: `Browse <a href="/listings/toyota/">Toyota hybrid cars for sale</a>, including available Corolla, Camry, RAV4, Yaris Cross and Kluger models. Compare prices, condition and specifications.`,
        },
        {
          question: "Are Toyota Corolla Hybrid cars suitable for everyday driving?",
          answer: `Yes. The Toyota Corolla Hybrid offers fuel-efficient everyday driving in hatchback and sedan configurations. Browse <a href="/listings/toyota/corolla/">Toyota Corolla hybrids</a> to compare available models.`,
        },
        {
          question: "What makes Toyota RAV4 Hybrid cars popular?",
          answer: `The Toyota RAV4 Hybrid combines SUV practicality, family-friendly space and hybrid fuel efficiency. Explore <a href="/listings/toyota/rav4/">Toyota RAV4 hybrids for sale</a> to compare prices, features and drivetrains.`,
        },
        {
          question: "Where can I find BYD hybrid cars for sale?",
          answer: `Browse <a href="/listings/byd/">BYD hybrid cars for sale</a>, including available Sealion plug-in hybrid SUVs and Shark 6 utes. Compare electric range, fuel consumption and charging requirements.`,
        },
        {
          question: "Where can I find Hyundai and Kia hybrid cars for sale?",
          answer: `Explore <a href="/listings/hyundai/">Hyundai hybrids</a> and <a href="/listings/kia/">Kia hybrids</a>, including available Tucson, Santa Fe, Sportage and Sorento models. Compare fuel economy, seating and features.`,
        },
        {
          question: "Where can I find MG hybrid cars for sale?",
          answer: `Browse <a href="/listings/mg/">MG hybrid cars for sale</a>, including available MG3 Hybrid+ and hybrid SUV models. Compare affordability, fuel efficiency and specifications.`,
        },
        {
          question: "Are GWM and Chery hybrid cars worth considering?",
          answer: `GWM and Chery offer hybrid SUVs with different features and pricing. Compare <a href="/listings/gwm/">GWM hybrids</a> and <a href="/listings/chery/">Chery hybrids</a> by warranty, fuel economy and equipment.`,
        },
      ],
    },
    {
      label: "Hybrid Vehicle Types",
      items: [
        {
          question: "Where can I find hybrid SUVs for sale?",
          answer: `Browse <a href="/listings/suv-body-type/">hybrid SUVs for sale</a>, including available family, compact and luxury models. Compare passenger space, fuel economy, drivetrain and features.`,
        },
        {
          question: "Where can I find hybrid hatchbacks for sale?",
          answer: `Explore <a href="/listings/hatchback-body-type/">hybrid hatchbacks for sale</a>, including available Toyota Corolla, MG3 and Suzuki Swift models. Compare affordability, size and fuel consumption.`,
        },
        {
          question: "Which hybrid sedans offer good fuel economy?",
          answer: `The Toyota Camry Hybrid, Corolla Sedan Hybrid and Honda Accord e:HEV are worth comparing. Review official fuel consumption, passenger comfort and features before choosing.`,
        },
        {
          question: "Where can I find hybrid wagons for sale?",
          answer: `Browse <a href="/listings/wagon-body-type/">hybrid wagons for sale</a> and compare available models by cargo space, seating, fuel consumption and suitability for family travel.`,
        },
        {
          question: "Are hybrid utes available in Australia?",
          answer: `Yes. Models such as the BYD Shark 6 and Ford Ranger PHEV combine petrol engines with plug-in hybrid technology. Browse <a href="/listings/ute-body-type/">hybrid utes for sale</a>.`,
        },
        {
          question: "Which hybrid cars are suitable for larger families?",
          answer: `Hybrid SUVs such as the Toyota Kluger, Kia Sorento and Hyundai Santa Fe offer family-oriented configurations, including seven-seat variants. Compare seating, boot space, safety and fuel economy.`,
        },
      ],
    },
    {
      label: "Hybrid Technology & Powertrains",
      items: [
        {
          question: "What is the difference between HEV and PHEV hybrid cars?",
          answer: `HEVs are conventional hybrids that recharge through their engines and regenerative braking. PHEVs have larger rechargeable batteries and can be plugged in for electric-only driving.`,
        },
        {
          question: "What is the difference between mild and full hybrid cars?",
          answer: `Mild hybrids use electric assistance but generally cannot drive on electric power alone. Full hybrids can propel the vehicle electrically under suitable conditions.`,
        },
        {
          question: "How do self-charging hybrid cars recharge their batteries?",
          answer: `Conventional hybrids recharge through regenerative braking and energy supplied by their engines. They do not need external charging, but still use fuel.`,
        },
        {
          question: "How do plug-in hybrid cars work?",
          answer: `Plug-in hybrids combine an engine with a rechargeable battery and electric motor. They can drive on electricity for a limited distance before using the engine when needed.`,
        },
        {
          question: "What is regenerative braking in a hybrid car?",
          answer: `Regenerative braking captures some energy during deceleration and stores it in the battery. This energy can then assist the engine or power the vehicle's electric motor.`,
        },
        {
          question: "What is the difference between series and parallel hybrid systems?",
          answer: `Series hybrids primarily use the engine to generate electricity for the driving motor. Parallel hybrids can use both the engine and electric motor to drive the wheels.`,
        },
        {
          question: "Are AWD and 4WD hybrid cars available in Australia?",
          answer: `Yes. Hybrid models such as selected Toyota RAV4, Hyundai Santa Fe and Mitsubishi Outlander variants offer AWD or 4WD. Compare drivetrain specifications and intended driving conditions.`,
        },
        {
          question: "What is the difference between plug-in hybrids and fully electric cars?",
          answer: `Plug-in hybrids combine an engine with a rechargeable battery, while fully electric cars operate without a combustion engine. Explore <a href="https://www.electriccarsforsale.au/">electric cars for sale</a> to compare alternatives.`,
        },
      ],
    },
    {
      label: "Batteries, Costs & Ownership",
      items: [
        {
          question: "How long do hybrid car batteries last?",
          answer: `Hybrid batteries are designed to last many years, but their capacity and performance can decline over time. Battery lifespan depends on technology, temperature, usage and maintenance.`,
        },
        {
          question: "How do I check the hybrid battery condition before buying?",
          answer: `Review available battery diagnostic reports, warning lights, service records and remaining warranty coverage. Consider an independent hybrid-system inspection, particularly for older used vehicles.`,
        },
        {
          question: "Are hybrid cars cheaper to run than petrol cars?",
          answer: `Many hybrids use less fuel than comparable petrol cars, particularly in city traffic. Total savings depend on purchase price, fuel consumption, servicing, insurance and depreciation.`,
        },
        {
          question: "How much does it cost to charge a plug-in hybrid car?",
          answer: `Charging costs depend on battery capacity, electricity rates and charging method. Home charging is often less expensive than public charging, particularly with off-peak electricity.`,
        },
        {
          question: "Do hybrid cars require special servicing?",
          answer: `Hybrid cars require regular mechanical servicing, including brakes, tyres, fluids and cooling systems. Their high-voltage components should be inspected by appropriately trained technicians when required.`,
        },
        {
          question: "What are the ongoing costs of owning a hybrid car?",
          answer: `Ongoing expenses include fuel, registration, insurance, servicing, tyres, repairs and depreciation. Plug-in hybrids may also have electricity costs and charging equipment expenses.`,
        },
        {
          question: "Can I get finance or tax benefits when buying a hybrid car?",
          answer: `Vehicle finance may be available subject to eligibility. Tax incentives depend on current rules; plug-in hybrids generally no longer qualify for the Australian electric-car FBT exemption under new arrangements.`,
        },
      ],
    },
    {
      label: "Hybrid Cars for Sale by Location",
      items: [
        {
          question: "Where can I find hybrid cars for sale in Sydney?",
          answer: `Browse <a href="/listings/new-south-wales-state/sydney-region/">hybrid cars for sale in Sydney</a> on HybridCarsForSale.com.au. Compare new, used and demo vehicles from dealerships and private sellers.`,
        },
        {
          question: "Where can I find hybrid cars for sale in Melbourne?",
          answer: `Explore <a href="/listings/victoria-state/melbourne-region/">hybrid cars for sale in Melbourne</a> and compare available models by price, manufacturer, fuel type, condition and specifications.`,
        },
        {
          question: "Where can I find hybrid cars for sale in Brisbane?",
          answer: `Browse <a href="/listings/queensland-state/brisbane-region/">hybrid cars for sale in Brisbane</a> and compare available SUVs, hatchbacks and other hybrid vehicles.`,
        },
        {
          question: "Where can I find hybrid cars for sale in Perth?",
          answer: `Explore <a href="/listings/western-australia-state/perth-region/">hybrid cars for sale in Perth</a> and compare available models by make, price, fuel type and condition.`,
        },
        {
          question: "Where can I find hybrid cars for sale in Adelaide?",
          answer: `Browse <a href="/listings/south-australia-state/adelaide-region/">hybrid cars for sale in Adelaide</a> on HybridCarsForSale.com.au. Compare available vehicles from dealers and private sellers.`,
        },
        {
          question: "How can I find hybrid cars for sale near me?",
          answer: `Use the location filters on HybridCarsForSale.com.au to search by state, city or region. Narrow results by price, make, condition and fuel type.`,
        },
      ],
    },
    {
      label: "Selling a Hybrid Car",
      items: [
        {
          question: "How do I sell my hybrid car online in Australia?",
          answer: `You can <a href="${SELL}">sell your car online</a> through our unified automotive marketplace network. Create one advertisement and reach potential buyers across relevant websites.`,
        },
        {
          question: "How much does it cost to advertise a hybrid car?",
          answer: `Private sellers pay a one-time fee of $49 including GST through SellMyCarOnline.au. Your advertisement stays live until sold, with no monthly listing fees or sales commission.`,
        },
        {
          question: "Will my hybrid car be advertised across multiple marketplaces?",
          answer: `Yes. Eligible hybrid cars are automatically advertised across relevant automotive marketplaces within our network based on their body type, fuel type, drivetrain and other attributes.`,
        },
        {
          question: "What information should I include in a hybrid car advertisement?",
          answer: `Include the make, model, year, kilometres, condition, asking price, hybrid type and service history. Add battery warranty details, relevant charging specifications and clear photographs.`,
        },
        {
          question: "Does hybrid battery condition affect the resale value of my car?",
          answer: `Yes. Battery condition, remaining warranty, service history, age and kilometres can influence buyer confidence and resale value. Provide available battery-health information where possible.`,
        },
        {
          question: "Can private sellers and dealerships advertise hybrid cars?",
          answer: `Yes. Private sellers can advertise through SellMyCarOnline.au, while dealerships can <a href="${DEALER}">advertise eligible stock</a> across our unified automotive marketplace network.`,
        },
      ],
    },
    {
      label: "General & Buying",
      items: [
        {
          question: "Where can I find hybrid cars for sale in Australia?",
          answer: `Browse <a href="/listings/">new and used hybrid cars for sale</a> on HybridCarsForSale.com.au. Compare vehicles from dealerships and private sellers across Australia by price, make, model, fuel type and location.`,
        },
        {
          question: "What is a hybrid car and how does it work?",
          answer: `A hybrid car combines a petrol or diesel engine with an electric motor and battery. The systems work together to improve efficiency, depending on the vehicle's hybrid technology.`,
        },
        {
          question: "What are the benefits of owning a hybrid car?",
          answer: `Hybrid cars can reduce fuel consumption, particularly in stop-start traffic. They combine electric assistance with an engine, offering practical everyday driving and flexible long-distance travel.`,
        },
        {
          question: "Are hybrid cars more fuel-efficient than petrol cars?",
          answer: `Many hybrids use less fuel than comparable petrol-only vehicles, particularly in city driving. Actual savings depend on the model, driving conditions and type of hybrid system.`,
        },
        {
          question: "Are hybrid cars reliable for everyday driving?",
          answer: `Yes. Many hybrid vehicles are well suited to everyday driving. Reliability depends on the manufacturer, model, age, servicing and condition of the hybrid battery and mechanical components.`,
        },
        {
          question: "Are hybrid cars suitable for long-distance travel in Australia?",
          answer: `Yes. Hybrid cars can handle long-distance travel using their combustion engines and electric assistance. Compare fuel consumption, tank capacity, comfort and luggage space before choosing.`,
        },
        {
          question: "What should I consider before buying a hybrid car?",
          answer: `Consider your budget, fuel economy, hybrid system, battery warranty, seating and driving needs. For plug-in hybrids, also consider charging access and electric-only driving range.`,
        },
        {
          question: "How can I compare different hybrid cars for sale?",
          answer: `Compare hybrid cars by make, model, year, price, kilometres, fuel type, transmission, drivetrain, seating and features. Use the filters on HybridCarsForSale.com.au to narrow your options.`,
        },
      ],
    },
  ],
  vans: [
    {
      label: "New, Used & Prices",
      items: [
        {
          question: "Where can I find new vans for sale in Australia?",
          answer: `Browse <a href="/listings/new-condition/">new vans for sale</a> on VansForSale.au. Compare available models from Australian dealerships by make, price, cargo capacity, fuel type and location.`,
        },
        {
          question: "Where can I find used vans for sale in Australia?",
          answer: `Explore <a href="/listings/used-condition/">used vans for sale</a> across Australia. Compare second-hand commercial and passenger vans from dealerships and private sellers by price, condition and kilometres.`,
        },
        {
          question: "Is it better to buy a new or used van?",
          answer: `New vans offer current technology and applicable manufacturer warranties, while used vans generally cost less. Compare purchase price, mechanical condition, service history and anticipated business usage.`,
        },
        {
          question: "How much does a van cost in Australia?",
          answer: `Older used vans can cost under $10,000, while new commercial vans may exceed $80,000. Prices depend on brand, size, age, condition, cargo capacity and features.`,
        },
        {
          question: "Where can I find cheap vans under $10,000?",
          answer: `Browse <a href="/listings/under-10000/">vans under $10,000</a> on VansForSale.au. Compare affordable used models by age, kilometres, mechanical condition and service history.`,
        },
        {
          question: "Where can I find vans under $20,000?",
          answer: `Explore <a href="/listings/between-10000-20000/">vans between $10,000 and $20,000</a> or select a lower price range. Compare affordable cargo and delivery vans from different manufacturers.`,
        },
        {
          question: "What should I check before buying a used van?",
          answer: `Inspect the engine, transmission, suspension, brakes, tyres, cargo floor and bodywork. Check for accident damage, heavy loading or poor maintenance. Review service records and conduct a PPSR search.`,
        },
      ],
    },
    {
      label: "Van Brands & Models",
      items: [
        {
          question: "What are the most popular van brands in Australia?",
          answer: `Well-known van brands include Toyota, Ford, Volkswagen, Hyundai, Renault, LDV, Mercedes-Benz and Peugeot. Compare models based on cargo space, payload, reliability, servicing and budget.`,
        },
        {
          question: "Where can I find Toyota HiAce vans for sale?",
          answer: `Browse <a href="/listings/toyota/hiace/">Toyota HiAce vans for sale</a> on VansForSale.au. Compare available long-wheelbase, high-roof and other configurations by price, condition and specifications.`,
        },
        {
          question: "Where can I find Volkswagen vans for sale?",
          answer: `Explore <a href="/listings/volkswagen/">Volkswagen vans for sale</a>, including available Caddy, Transporter and Crafter models. Compare size, cargo capacity, fuel type and features.`,
        },
        {
          question: "Where can I find Ford Transit vans for sale?",
          answer: `Browse <a href="/listings/ford/transit/">Ford Transit vans for sale</a>, including available commercial configurations. Compare wheelbase, roof height, payload, transmission and price.`,
        },
        {
          question: "Where can I find Hyundai Staria Load vans for sale?",
          answer: `Explore <a href="/listings/hyundai/staria-load/">Hyundai Staria Load vans for sale</a>. Compare available models by cargo space, fuel type, seating, condition and price.`,
        },
        {
          question: "Where can I find Renault Trafic vans for sale?",
          answer: `Browse <a href="/listings/renault/trafic/">Renault Trafic vans for sale</a> on VansForSale.au. Compare available configurations by wheelbase, transmission, cargo capacity and condition.`,
        },
        {
          question: "Where can I find LDV Deliver 9 vans for sale?",
          answer: `Explore <a href="/listings/ldv/deliver-9/">LDV Deliver 9 vans for sale</a>, including available medium and long-wheelbase models. Compare roof height, payload, price and specifications.`,
        },
        {
          question: "Where can I find Mercedes-Benz vans for sale?",
          answer: `Browse <a href="/listings/mercedes-benz/">Mercedes-Benz vans for sale</a>, including available Sprinter and Vito models. Compare cargo configurations, comfort, features and running costs.`,
        },
      ],
    },
    {
      label: "Van Sizes & Specifications",
      items: [
        {
          question: "What is the difference between short, medium and long-wheelbase vans?",
          answer: `Wheelbase refers to the distance between the front and rear axles. Longer-wheelbase vans often provide more cargo space, while shorter models are generally easier to manoeuvre and park.`,
        },
        {
          question: "What is the difference between low-roof, medium-roof and high-roof vans?",
          answer: `Roof height affects internal clearance, storage and overall vehicle height. High-roof vans can provide standing room, while lower-roof models may be more suitable for height-restricted parking.`,
        },
        {
          question: "What is cargo volume in a van?",
          answer: `Cargo volume measures the available load-space capacity, usually in cubic metres. Compare cargo volume and internal dimensions to ensure your equipment, parcels or materials will fit.`,
        },
        {
          question: "What is payload capacity in a van?",
          answer: `Payload is the weight a van can legally carry beyond its specified unloaded weight, including passengers, cargo and fitted equipment. Always check the manufacturer's weight ratings.`,
        },
        {
          question: "What is the difference between payload and towing capacity?",
          answer: `Payload is the weight carried within or on the van, while towing capacity is the permitted trailer weight. Both are limited by the vehicle's specifications and applicable weight ratings.`,
        },
        {
          question: "What are the best small vans for city driving?",
          answer: `Compact vans such as the Volkswagen Caddy, Renault Kangoo and Peugeot Partner can suit city deliveries. Compare manoeuvrability, cargo volume, fuel efficiency and parking convenience.`,
        },
        {
          question: "Which large vans offer the most cargo space?",
          answer: `Large vans such as the Mercedes-Benz Sprinter, Volkswagen Crafter, Ford Transit and LDV Deliver 9 offer spacious configurations. Compare internal dimensions, wheelbase, roof height and payload.`,
        },
      ],
    },
    {
      label: "Commercial, Diesel & Electric Vans",
      items: [
        {
          question: "What is a panel van?",
          answer: `A panel van is an enclosed vehicle designed primarily for transporting goods and equipment. It typically has a dedicated cargo area and fewer passenger seats than a people mover.`,
        },
        {
          question: "Which vans are suitable for tradespeople?",
          answer: `Vans such as the Toyota HiAce, Ford Transit Custom, Hyundai Staria Load and Renault Trafic are worth comparing. Consider tool storage, payload, access doors and cargo security.`,
        },
        {
          question: "Which vans are best for delivery businesses?",
          answer: `The best delivery van depends on parcel volume, daily distance and loading requirements. Compare compact vans for urban deliveries and larger cargo vans for higher-volume transport.`,
        },
        {
          question: "Where can I find diesel vans for sale?",
          answer: `Browse <a href="/listings/diesel-fuel-type/">diesel vans for sale</a>, including available Toyota HiAce, Ford Transit, Volkswagen Crafter and other commercial models. Compare fuel consumption, payload and servicing costs.`,
        },
        {
          question: "Where can I find electric vans for sale?",
          answer: `Explore <a href="/listings/electric-fuel-type/">electric vans for sale</a>, including available Kia PV5 and Farizon models. Compare driving range, battery capacity, payload and charging requirements.`,
        },
        {
          question: "Are electric vans suitable for business deliveries?",
          answer: `Yes. Electric vans can suit businesses with predictable daily routes and reliable charging access. Compare real-world driving range when loaded, charging time, payload and total ownership costs.`,
        },
        {
          question: "Are passenger vans suitable for group transportation?",
          answer: `Yes. Passenger vans can offer multiple seating rows and additional luggage space. Check approved seating capacity, seatbelts, safety features and any applicable licensing or commercial transport requirements.`,
        },
      ],
    },
    {
      label: "Maintenance & Conversions",
      items: [
        {
          question: "How often should a commercial van be serviced?",
          answer: `Follow the manufacturer's servicing schedule and account for operating conditions. Vans used for deliveries, heavy loads or frequent stop-start driving may require additional maintenance checks.`,
        },
        {
          question: "What common problems should I check in a used commercial van?",
          answer: `Check for worn suspension, clutch or transmission problems, oil leaks, brake wear, body damage and cargo-floor deterioration. Heavy commercial use can accelerate wear on mechanical components.`,
        },
        {
          question: "What are the ongoing costs of owning a van?",
          answer: `Ongoing costs include registration, insurance, fuel or electricity, servicing, tyres, repairs and depreciation. Business owners should also consider downtime, commercial fit-outs and equipment replacement.`,
        },
        {
          question: "Which vans are suitable for campervan conversions?",
          answer: `Models such as the Toyota HiAce, Ford Transit, Mercedes-Benz Sprinter and Volkswagen Crafter are commonly considered. Compare interior dimensions, payload, roof height and conversion costs.`,
        },
        {
          question: "What is the difference between a commercial van and a campervan?",
          answer: `Commercial vans primarily transport goods or passengers, while campervans include accommodation and living facilities. Explore <a href="https://www.campervansforsale.au/">campervans for sale</a> if you're looking for a purpose-built touring vehicle.`,
        },
        {
          question: "What should I check before buying a modified or fitted-out van?",
          answer: `Inspect shelving, partitions, electrical installations and structural changes. Check that modifications are secure, properly documented and compliant with applicable vehicle regulations and weight limits.`,
        },
      ],
    },
    {
      label: "Vans for Sale by Location",
      items: [
        {
          question: "Where can I find vans for sale in Sydney?",
          answer: `Browse <a href="/listings/new-south-wales-state/sydney-region/">vans for sale in Sydney</a> on VansForSale.au. Compare new and used commercial, cargo and passenger vans from dealers and private sellers.`,
        },
        {
          question: "Where can I find vans for sale in Melbourne?",
          answer: `Explore <a href="/listings/victoria-state/melbourne-region/">vans for sale in Melbourne</a> and compare available models by price, make, wheelbase, cargo capacity and condition.`,
        },
        {
          question: "Where can I find vans for sale in Brisbane?",
          answer: `Browse <a href="/listings/queensland-state/brisbane-region/">vans for sale in Brisbane</a> and compare available delivery, commercial and passenger vans by price, make and specifications.`,
        },
        {
          question: "Where can I find vans for sale in Perth?",
          answer: `Explore <a href="/listings/western-australia-state/perth-region/">vans for sale in Perth</a> and compare available models by price, condition, fuel type and features.`,
        },
        {
          question: "Where can I find vans for sale in Adelaide?",
          answer: `Browse <a href="/listings/south-australia-state/adelaide-region/">vans for sale in Adelaide</a> on VansForSale.au. Compare available new and used vans from dealerships and private sellers.`,
        },
      ],
    },
    {
      label: "Selling a Van",
      items: [
        {
          question: "How do I sell my van online in Australia?",
          answer: `You can <a href="${SELL}">sell your vehicle online</a> through our unified automotive marketplace network. Create one advertisement and reach potential buyers across relevant websites.`,
        },
        {
          question: "How much does it cost to advertise a van?",
          answer: `Private sellers pay a one-time fee of $49 including GST through SellMyCarOnline.au for eligible vehicle listings. There are no monthly listing fees or commission on the sale.`,
        },
        {
          question: "Will my van be advertised across multiple marketplaces?",
          answer: `Yes. Eligible vans are automatically advertised across relevant automotive marketplaces within our network based on their body type, fuel type and other vehicle attributes.`,
        },
        {
          question: "What information should I include in a van advertisement?",
          answer: `Include the make, model, year, kilometres, condition, price, fuel type, wheelbase, roof height, cargo capacity and payload. Add clear photographs and available service history.`,
        },
        {
          question: "How do I determine the resale value of my van?",
          answer: `Compare similar vans by make, model, year, kilometres, condition and cargo specifications. Consider service history, previous commercial use, fitted equipment and current asking prices.`,
        },
        {
          question: "Can private sellers and dealerships advertise vans?",
          answer: `Yes. Private sellers can advertise eligible vans through SellMyCarOnline.au, while dealerships can <a href="${DEALER}">advertise stock</a> across relevant websites in our unified automotive marketplace network.`,
        },
      ],
    },
    {
      label: "General & Buying",
      items: [
        {
          question: "Where can I find vans for sale in Australia?",
          answer: `Browse <a href="/listings/">new and used vans for sale</a> on VansForSale.au. Compare commercial, cargo and passenger vans from dealerships and private sellers across Australia by price, make, model, location and specifications.`,
        },
        {
          question: "What types of vans are available in Australia?",
          answer: `Popular types include panel vans, cargo vans, delivery vans, compact vans, long-wheelbase vans and passenger vans. Each offers different cargo space, seating, payload capacity and practical features.`,
        },
        {
          question: "What is the difference between a cargo van and a passenger van?",
          answer: `Cargo vans prioritise space for transporting goods, tools and equipment, while passenger vans have additional seating and safety equipment for carrying people. Some models offer both configurations.`,
        },
        {
          question: "What is the difference between a van and a people mover?",
          answer: `Vans are often designed for carrying cargo or commercial use, while people movers prioritise passenger seating and comfort. Compare vans with <a href="https://www.peoplemoversforsale.com.au/">people movers for sale</a> to explore both options.`,
        },
        {
          question: "Are vans suitable for both personal and business use?",
          answer: `Yes. Vans can suit tradespeople, delivery businesses, mobile services and personal transport. Choose a model based on seating requirements, cargo space, running costs and intended use.`,
        },
        {
          question: "What should I consider before buying a van?",
          answer: `Consider your budget, cargo volume, payload, wheelbase, roof height, fuel type and running costs. For used vans, check service history, kilometres travelled and signs of heavy commercial use.`,
        },
        {
          question: "How can I compare different vans for sale?",
          answer: `Compare vans by make, model, year, price, kilometres, fuel type, transmission, wheelbase, roof height, cargo volume and payload. Use the filters on VansForSale.au to narrow your options.`,
        },
        {
          question: "How can I find vans for sale near me?",
          answer: `Use the location filters on VansForSale.au to browse vans in your state, city or region. Narrow your search by make, price, condition and specifications.`,
        },
      ],
    },
  ],
  peoplemovers: [
    {
      label: "New, Used & Prices",
      items: [
        {
          question: "Where can I find new people movers for sale in Australia?",
          answer: `Browse <a href="/listings/new-condition/">new people movers for sale</a> on PeopleMoversForSale.com.au. Compare available models from Australian dealerships by price, seating, fuel type and features.`,
        },
        {
          question: "Where can I find used people movers for sale?",
          answer: `Explore <a href="/listings/used-condition/">used people movers for sale</a> across Australia. Compare second-hand vehicles from dealerships and private sellers by price, age, condition and kilometres.`,
        },
        {
          question: "Is it better to buy a new or used people mover?",
          answer: `New people movers offer current features and applicable manufacturer warranties, while used models generally cost less. Compare reliability, interior condition, safety and running costs before deciding.`,
        },
        {
          question: "How much does a people mover cost in Australia?",
          answer: `Older used people movers may cost under $10,000, while new and premium luxury models can exceed $100,000. Prices depend on brand, age, seating, condition and features.`,
        },
        {
          question: "Where can I find affordable people movers under $20,000?",
          answer: `Browse <a href="/listings/between-10000-20000/">people movers between $10,000 and $20,000</a> or <a href="/listings/under-10000/">under $10,000</a>. Compare older Kia Carnival, Honda Odyssey and other models by condition and service history.`,
        },
        {
          question: "What should I check before buying a used people mover?",
          answer: `Inspect the engine, transmission, brakes, suspension, sliding doors, seats and air conditioning. Check interior wear, service records and registration, and conduct a PPSR search before purchasing.`,
        },
        {
          question: "Is it better to buy a people mover privately or from a dealership?",
          answer: `Dealerships generally provide stronger consumer protections, while private sellers may offer competitive prices. Compare condition, service history, price and applicable warranty coverage before purchasing.`,
        },
      ],
    },
    {
      label: "People Mover Brands & Models",
      items: [
        {
          question: "What are the most popular people mover brands in Australia?",
          answer: `Well-known brands include Kia, Toyota, Hyundai, Volkswagen, Honda, Nissan, LDV and Mercedes-Benz. Popular models include the Kia Carnival, Toyota HiAce, Hyundai Staria and Volkswagen Multivan.`,
        },
        {
          question: "Where can I find Toyota people movers for sale?",
          answer: `Browse <a href="/listings/toyota/">Toyota people movers for sale</a>, including available HiAce Commuter, Alphard, Vellfire, Tarago and Sienta models. Compare seating, comfort, prices and specifications.`,
        },
        {
          question: "Where can I find Kia Carnival people movers for sale?",
          answer: `Explore <a href="/listings/kia/carnival/">Kia Carnival people movers for sale</a>, including petrol, diesel and hybrid variants where available. Compare seven- and eight-seat configurations, features and prices.`,
        },
        {
          question: "Where can I find Hyundai Staria people movers for sale?",
          answer: `Browse <a href="/listings/hyundai/staria/">Hyundai Staria people movers for sale</a>. Compare available models by seating, passenger access, fuel type, comfort and safety technology.`,
        },
        {
          question: "Where can I find Volkswagen people movers for sale?",
          answer: `Explore <a href="/listings/volkswagen/">Volkswagen people movers for sale</a>, including available Multivan and Caddy passenger models. Compare flexible seating, sliding doors and luggage space.`,
        },
        {
          question: "Where can I find Honda Odyssey people movers for sale?",
          answer: `Browse <a href="/listings/honda/">Honda people movers for sale</a>, including available Odyssey models. Compare prices, seating arrangements, condition and family-friendly features.`,
        },
        {
          question: "Where can I find Nissan people movers for sale?",
          answer: `Explore <a href="/listings/nissan/">Nissan people movers for sale</a>, including available Serena and Elgrand models. Compare seating, petrol and hybrid options, and vehicle condition.`,
        },
        {
          question: "Where can I find LDV people movers for sale?",
          answer: `Browse <a href="/listings/ldv/">LDV people movers for sale</a>, including available G10 and passenger-configured Deliver 9 models. Compare seating capacity, dimensions and specifications.`,
        },
        {
          question: "Where can I find Mercedes-Benz people movers for sale?",
          answer: `Explore <a href="/listings/mercedes-benz/">Mercedes-Benz people movers for sale</a>, including available V-Class, Vito and passenger-configured Sprinter models. Compare luxury features, seating and transport requirements.`,
        },
      ],
    },
    {
      label: "Seating, Space & Comfort",
      items: [
        {
          question: "Where can I find 7-seater people movers for sale?",
          answer: `Browse <a href="/listings/7-seats/">7-seater people movers for sale</a>, including available family and luxury models. Compare passenger comfort, third-row access, boot space and features.`,
        },
        {
          question: "Where can I find 8-seater people movers for sale?",
          answer: `Explore <a href="/listings/8-seats/">8-seater people movers for sale</a>, including available Kia Carnival and Hyundai Staria models. Compare seating configurations, safety features and luggage capacity.`,
        },
        {
          question: "Should I buy a 7-seater or 8-seater people mover?",
          answer: `Choose seven seats if you prefer more flexible cabin arrangements or individual second-row seats. Eight-seat models offer additional passenger capacity, depending on their configuration.`,
        },
        {
          question: "Why are sliding doors useful in people movers?",
          answer: `Sliding doors make it easier for passengers to enter and exit in tight parking spaces. They can be particularly convenient when helping children into the vehicle.`,
        },
        {
          question: "What should I look for in third-row seating?",
          answer: `Check legroom, headroom, access, seatbelt fit and ventilation. Ensure the third row comfortably accommodates your intended passengers and still leaves sufficient luggage space.`,
        },
        {
          question: "Are people movers suitable for families with young children?",
          answer: `Yes. People movers can accommodate multiple children, but approved child-restraint anchor points and seating positions vary. Check child-seat compatibility and applicable restraint requirements.`,
        },
        {
          question: "Do people movers offer enough luggage space for family holidays?",
          answer: `Many offer flexible cargo arrangements, including folding or removable seats. Check boot capacity with all seats occupied, particularly when travelling with luggage, prams or sports equipment.`,
        },
        {
          question: "Are wheelchair-accessible people movers available in Australia?",
          answer: `Yes. Some people movers can be fitted with ramps, wheelchair restraints and accessible seating. Check conversion compliance, passenger capacity and accessibility requirements before buying.`,
        },
      ],
    },
    {
      label: "Hybrid, Electric & Commercial Use",
      items: [
        {
          question: "Are hybrid people movers available in Australia?",
          answer: `Yes. Hybrid variants include selected Kia Carnival, Hyundai Staria and Toyota Alphard models. Compare fuel consumption, seating, battery warranties and specifications before choosing.`,
        },
        {
          question: "What are the benefits of buying a hybrid people mover?",
          answer: `Hybrid people movers can reduce fuel consumption, particularly during stop-start driving. They combine electric assistance with a petrol engine, offering flexibility for family and long-distance travel.`,
        },
        {
          question: "Are electric people movers available in Australia?",
          answer: `Yes. Fully electric people movers are becoming available, including models such as the XPENG X9. Compare driving range, charging speed, seating capacity and purchase price.`,
        },
        {
          question: "Are plug-in hybrid people movers different from standard hybrids?",
          answer: `Yes. Plug-in hybrids use externally rechargeable batteries for electric-only driving, while conventional hybrids recharge through their engines and regenerative braking. Model availability varies.`,
        },
        {
          question: "Should I buy a petrol or diesel people mover?",
          answer: `Petrol models can suit everyday family driving, while diesel models may offer practical fuel economy for frequent long-distance travel. Compare servicing, fuel costs and vehicle specifications.`,
        },
        {
          question: "Are people movers suitable for airport transfers and shuttle services?",
          answer: `Yes. Passenger-configured people movers can suit airport transfers and group transport. Check luggage capacity, seating, licensing, insurance and commercial passenger transport requirements before purchasing.`,
        },
      ],
    },
    {
      label: "Inspections & Ownership",
      items: [
        {
          question: "What are the ongoing costs of owning a people mover?",
          answer: `Ongoing costs include registration, insurance, fuel or electricity, servicing, tyres, repairs and depreciation. Larger vehicles may also have higher parking and maintenance expenses.`,
        },
        {
          question: "How often should a people mover be serviced?",
          answer: `Follow the manufacturer's recommended servicing schedule. Regularly inspect brakes, tyres, air conditioning, sliding doors, seatbelts and other components, especially when carrying passengers frequently.`,
        },
        {
          question: "Can I get finance to buy a people mover?",
          answer: `Yes. Banks and vehicle lenders may offer finance for new and used people movers, subject to eligibility. Compare interest rates, fees, loan terms and repayments.`,
        },
        {
          question: "What licence do I need to drive a people mover in Australia?",
          answer: `A standard car licence generally covers vehicles up to 4.5 tonnes GVM carrying no more than 12 people, including the driver. Larger vehicles or commercial services may require additional licensing.`,
        },
        {
          question: "What should I check when test-driving a people mover?",
          answer: `Check steering, braking, transmission, visibility and ride comfort. Test the sliding doors, air conditioning, seating adjustments, reversing camera and any unusual mechanical noises.`,
        },
      ],
    },
    {
      label: "People Movers for Sale by Location",
      items: [
        {
          question: "Where can I find people movers for sale in Sydney?",
          answer: `Browse <a href="/listings/new-south-wales-state/sydney-region/">people movers for sale in Sydney</a> on PeopleMoversForSale.com.au. Compare new and used vehicles from dealers and private sellers.`,
        },
        {
          question: "Where can I find people movers for sale in Melbourne?",
          answer: `Explore <a href="/listings/victoria-state/melbourne-region/">people movers for sale in Melbourne</a> and compare available models by seating, price, make, condition and features.`,
        },
        {
          question: "Where can I find people movers for sale in Brisbane?",
          answer: `Browse <a href="/listings/queensland-state/brisbane-region/">people movers for sale in Brisbane</a> and compare available family and passenger vehicles by price, seating and specifications.`,
        },
        {
          question: "Where can I find people movers for sale in Perth?",
          answer: `Explore <a href="/listings/western-australia-state/perth-region/">people movers for sale in Perth</a> and compare available models by make, price, condition and features.`,
        },
        {
          question: "Where can I find people movers for sale in Newcastle?",
          answer: `Browse <a href="/listings/new-south-wales-state/newcastle-region/">people movers for sale in Newcastle</a> and compare available vehicles by seating capacity, price, make and condition.`,
        },
        {
          question: "How can I find people movers for sale near me?",
          answer: `Use the location filters on PeopleMoversForSale.com.au to browse vehicles by state, city or region. Narrow your search by price, make and seating.`,
        },
      ],
    },
    {
      label: "Selling a People Mover",
      items: [
        {
          question: "How do I sell my people mover online in Australia?",
          answer: `You can <a href="${SELL}">sell your car online</a> through our unified automotive marketplace network. Create one listing and advertise your eligible people mover across relevant websites.`,
        },
        {
          question: "How much does it cost to advertise a people mover?",
          answer: `Private sellers pay a one-time fee of $49 including GST through SellMyCarOnline.au. There are no monthly listing fees or commission on the sale.`,
        },
        {
          question: "How long will my people mover advertisement stay online?",
          answer: `Your private seller advertisement stays live until your vehicle is sold, with no recurring monthly listing charges.`,
        },
        {
          question: "Will my people mover be advertised across multiple marketplaces?",
          answer: `Yes. Eligible vehicles are automatically advertised across relevant automotive marketplaces within our network, based on their body type, fuel type and other vehicle attributes.`,
        },
        {
          question: "What information should I include in a people mover advertisement?",
          answer: `Include the make, model, year, kilometres, condition, price, seating capacity, fuel type and service history. Add photographs of all seating rows, sliding doors, luggage space and exterior.`,
        },
        {
          question: "Can private sellers and dealerships advertise people movers?",
          answer: `Yes. Private sellers can advertise eligible people movers through SellMyCarOnline.au, while dealerships can <a href="${DEALER}">advertise stock</a> across relevant marketplaces in our network.`,
        },
      ],
    },
    {
      label: "General & Buying",
      items: [
        {
          question: "Where can I find people movers for sale in Australia?",
          answer: `Browse <a href="/listings/">new and used people movers for sale</a> on PeopleMoversForSale.com.au. Compare vehicles from dealerships and private sellers across Australia by price, make, model, seating capacity and location.`,
        },
        {
          question: "What is a people mover?",
          answer: `A people mover is a vehicle designed to transport multiple passengers comfortably, usually with three seating rows. Many offer seven or eight seats, sliding doors and flexible luggage space.`,
        },
        {
          question: "What is the difference between a people mover and an SUV?",
          answer: `People movers generally prioritise passenger space, multi-row seating and easy access, often with sliding doors. SUVs offer different body styles and driving capabilities. Compare <a href="https://www.suvforsale.com.au/">SUVs for sale</a> to explore alternatives.`,
        },
        {
          question: "What are the benefits of owning a people mover?",
          answer: `People movers offer flexible seating, practical luggage space and easier passenger access. They're particularly useful for large families, school runs, holidays and group transportation.`,
        },
        {
          question: "Are people movers suitable for everyday family driving?",
          answer: `Yes. Models such as the Kia Carnival, Hyundai Staria and Volkswagen Multivan can suit everyday family travel. Compare parking convenience, seating, fuel consumption and safety features.`,
        },
        {
          question: "What should I consider before buying a people mover?",
          answer: `Consider seating capacity, third-row access, child-seat compatibility, boot space, safety features and running costs. For used vehicles, also check service history and overall condition.`,
        },
        {
          question: "How can I compare different people movers for sale?",
          answer: `Compare people movers by make, model, year, price, kilometres, fuel type, transmission, seating capacity and features. Use the filters on PeopleMoversForSale.com.au to narrow your options.`,
        },
      ],
    },
  ],
  wagons: [
    {
      label: "New, Used & Prices",
      items: [
        {
          question: "Where can I find new wagons for sale in Australia?",
          answer: `Browse <a href="/listings/new-condition/">new wagons for sale</a> on WagonsForSale.com.au. Compare available models from Australian dealerships by make, price, body size and specifications.`,
        },
        {
          question: "Where can I find used station wagons for sale?",
          answer: `Explore <a href="/listings/used-condition/">used wagons for sale</a> across Australia. Compare second-hand vehicles from dealerships and private sellers by price, age, kilometres and condition.`,
        },
        {
          question: "Is it better to buy a new or used wagon?",
          answer: `New wagons offer current features and applicable manufacturer warranties, while used models generally cost less. Compare purchase price, service history, reliability and ongoing expenses.`,
        },
        {
          question: "How much does a wagon cost in Australia?",
          answer: `Some older used wagons cost under $10,000, while premium luxury and performance models can exceed $100,000. Prices depend on brand, age, condition, kilometres and specifications.`,
        },
        {
          question: "Where can I find cheap wagons under $10,000?",
          answer: `Browse <a href="/listings/under-10000/">wagons under $10,000</a> on WagonsForSale.com.au. Compare affordable second-hand models by age, kilometres, mechanical condition and service history.`,
        },
        {
          question: "Where can I find affordable wagons under $20,000?",
          answer: `Explore <a href="/listings/between-10000-20000/">wagons between $10,000 and $20,000</a> or lower price ranges. Compare available family and touring wagons by condition, features and running costs.`,
        },
        {
          question: "Are second-hand station wagons worth buying?",
          answer: `Used wagons can offer practical cargo space and good value for families. Check mechanical condition, servicing, safety features and previous usage before choosing an older vehicle.`,
        },
      ],
    },
    {
      label: "Wagon Brands & Models",
      items: [
        {
          question: "What are the most popular station wagon models in Australia?",
          answer: `Well-known wagon models include the Subaru Outback, Skoda Octavia Wagon, Volkswagen Passat Wagon, Mazda6 Wagon, Holden Commodore Sportwagon and BMW 3 Series Touring.`,
        },
        {
          question: "Where can I find Subaru Outback wagons for sale?",
          answer: `Browse <a href="/listings/subaru/outback/">Subaru Outback wagons for sale</a> on WagonsForSale.com.au. Compare available AWD models by price, condition, year, features and specifications.`,
        },
        {
          question: "Where can I find Volkswagen Passat wagons for sale?",
          answer: `Explore <a href="/listings/volkswagen/passat/">Volkswagen Passat wagons for sale</a>. Compare available models by price, condition, cargo space, transmission and features.`,
        },
        {
          question: "Where can I find Mazda6 wagons for sale?",
          answer: `Browse <a href="/listings/mazda/mazda6/">Mazda6 wagons for sale</a>, including available petrol and diesel variants. Compare comfort, luggage space, condition and prices.`,
        },
        {
          question: "Where can I find Holden Commodore wagons for sale?",
          answer: `Explore <a href="/listings/holden/commodore/">Holden Commodore wagons for sale</a>, including available Sportwagon variants. Compare engine options, kilometres, condition and service history.`,
        },
        {
          question: "Where can I find Toyota wagons for sale?",
          answer: `Browse <a href="/listings/toyota/">Toyota wagons for sale</a> and compare available models by body style, size, price and condition. Check each vehicle's actual wagon classification.`,
        },
        {
          question: "Where can I find Mercedes-Benz wagons for sale?",
          answer: `Explore <a href="/listings/mercedes-benz/">Mercedes-Benz wagons for sale</a>, including available Estate models. Compare comfort, technology, cargo space and running costs.`,
        },
        {
          question: "Is the Skoda Octavia Wagon suitable for families?",
          answer: `The Skoda Octavia Wagon is known for its spacious boot and practical interior. Compare rear-seat comfort, fuel economy, safety technology and available specifications when choosing a model.`,
        },
        {
          question: "Which luxury and performance wagon brands should I compare?",
          answer: `BMW Touring, Audi Avant, Mercedes-Benz Estate and Volvo wagon models offer various luxury and performance options. Compare handling, comfort, cargo capacity, maintenance costs and equipment.`,
        },
      ],
    },
    {
      label: "Wagon Sizes & Practicality",
      items: [
        {
          question: "What sizes of station wagons are available in Australia?",
          answer: `Wagons are available in <a href="/listings/small-body-size/">small</a>, <a href="/listings/medium-body-size/">medium</a> and <a href="/listings/large-body-size/">large</a> categories. Compare dimensions, passenger space, boot capacity and manoeuvrability.`,
        },
        {
          question: "What is the difference between a hatchback and a station wagon?",
          answer: `Hatchbacks generally have shorter rear cargo areas, while wagons feature extended rooflines and longer luggage compartments. Compare <a href="https://www.hatchbacksforsale.com.au/">hatchbacks for sale</a> for more compact options.`,
        },
        {
          question: "What should I look for in a wagon with a spacious boot?",
          answer: `Check luggage volume, loading height, boot opening width and folding rear-seat arrangements. A flat load floor and practical storage compartments can improve everyday usability.`,
        },
        {
          question: "Which station wagons are suitable for family holidays?",
          answer: `Models such as the Subaru Outback, Skoda Octavia Wagon, Volkswagen Passat Wagon and Mazda6 Wagon are worth comparing for luggage capacity, comfort, safety and fuel efficiency.`,
        },
        {
          question: "Are small wagons suitable for city driving?",
          answer: `Yes. Smaller wagons can combine useful luggage space with easier parking and manoeuvrability than larger vehicles. Compare exterior dimensions, visibility, turning circle and fuel economy.`,
        },
        {
          question: "What are the benefits of folding rear seats in a wagon?",
          answer: `Folding rear seats increase available cargo length and flexibility for carrying luggage, furniture or sports equipment. Check whether the seats fold flat and suit your requirements.`,
        },
        {
          question: "Are station wagons suitable for long-distance road trips?",
          answer: `Yes. Wagons often provide comfortable seating, stable highway handling and generous luggage space. Consider fuel range, passenger comfort, safety technology and carrying capacity.`,
        },
      ],
    },
    {
      label: "Fuel Types, AWD & Performance",
      items: [
        {
          question: "Where can I find AWD wagons for sale?",
          answer: `Browse <a href="/listings/all-wheel-drive-drive-type/">AWD wagons for sale</a>, including available Subaru and other all-wheel-drive models. Compare traction, fuel economy, ground clearance and features.`,
        },
        {
          question: "What is the difference between AWD and 4WD wagons?",
          answer: `AWD systems commonly distribute power automatically between the wheels, while traditional 4WD systems may offer selectable modes and low-range gearing. Actual capabilities vary by vehicle.`,
        },
        {
          question: "Where can I find hybrid wagons for sale?",
          answer: `Explore <a href="/listings/hybrid-fuel-type/">hybrid wagons for sale</a> and compare available models by fuel consumption, battery technology, price and condition.`,
        },
        {
          question: "Are electric station wagons available in Australia?",
          answer: `Yes. Electric estates and wagons include models such as the Porsche Taycan Sport Turismo and BMW i5 Touring. Compare availability, driving range, charging and luggage capacity.`,
        },
        {
          question: "Are diesel wagons suitable for long-distance driving?",
          answer: `Diesel wagons can offer practical fuel economy and highway range, depending on the model. Compare servicing requirements, fuel consumption, emissions equipment and running costs.`,
        },
        {
          question: "What are the best performance wagons in Australia?",
          answer: `Performance-focused wagons include the Audi RS6 Avant, BMW M3 Touring, BMW M5 Touring and Mercedes-AMG Estate models. Compare power, handling, practicality and ownership costs.`,
        },
        {
          question: "Are AWD wagons suitable for gravel roads and regional travel?",
          answer: `Some AWD wagons can provide additional traction on gravel and slippery roads. Check ground clearance, tyres, suspension and manufacturer recommendations before travelling on rough terrain.`,
        },
      ],
    },
    {
      label: "Inspections & Ownership",
      items: [
        {
          question: "What should I check before buying a used station wagon?",
          answer: `Inspect the engine, transmission, suspension, brakes, tyres and bodywork. Check the cargo area, tailgate, service history and registration, and conduct a PPSR search before purchasing.`,
        },
        {
          question: "What should I inspect when buying a used Subaru wagon?",
          answer: `Check AWD drivetrain operation, tyre condition, suspension, engine servicing and transmission performance. Review maintenance records and investigate unusual noises or warning lights.`,
        },
        {
          question: "What should I check before buying an older Holden wagon?",
          answer: `Inspect the engine, transmission, suspension, cooling system and bodywork. Check for corrosion, previous towing use, accident damage and available service records.`,
        },
        {
          question: "What are the ongoing costs of owning a station wagon?",
          answer: `Ongoing costs include registration, insurance, fuel or electricity, servicing, tyres, repairs and depreciation. Luxury and performance wagons may have higher maintenance expenses.`,
        },
        {
          question: "Can I get finance to buy a new or used wagon?",
          answer: `Yes. Banks and vehicle lenders may offer finance for eligible new and used wagons. Compare interest rates, fees, loan terms and repayments before purchasing.`,
        },
      ],
    },
    {
      label: "Wagons for Sale by Location",
      items: [
        {
          question: "Where can I find wagons for sale in Sydney?",
          answer: `Browse <a href="/listings/new-south-wales-state/sydney-region/">wagons for sale in Sydney</a> on WagonsForSale.com.au. Compare available new and used vehicles from dealerships and private sellers.`,
        },
        {
          question: "Where can I find wagons for sale in Melbourne?",
          answer: `Explore <a href="/listings/victoria-state/melbourne-region/">wagons for sale in Melbourne</a> and compare available models by make, price, condition, drivetrain and specifications.`,
        },
        {
          question: "Where can I find wagons for sale in Brisbane?",
          answer: `Browse <a href="/listings/queensland-state/brisbane-region/">wagons for sale in Brisbane</a> and compare available family, touring and AWD models by price and condition.`,
        },
        {
          question: "Where can I find wagons for sale in Perth?",
          answer: `Explore <a href="/listings/western-australia-state/perth-region/">wagons for sale in Perth</a> and compare available vehicles by make, price, fuel type and features.`,
        },
        {
          question: "Where can I find wagons for sale in Adelaide?",
          answer: `Browse <a href="/listings/south-australia-state/adelaide-region/">wagons for sale in Adelaide</a> and compare available models from dealerships and private sellers.`,
        },
      ],
    },
    {
      label: "Selling a Wagon",
      items: [
        {
          question: "How do I sell my station wagon online in Australia?",
          answer: `You can <a href="${SELL}">sell your car online</a> through our unified automotive marketplace network. Create one advertisement and reach potential buyers across relevant websites.`,
        },
        {
          question: "How much does it cost to advertise a wagon?",
          answer: `Private sellers pay a one-time fee of $49 including GST through SellMyCarOnline.au. Your advertisement stays live until sold, with no monthly listing fees or sales commission.`,
        },
        {
          question: "Will my wagon be advertised across multiple marketplaces?",
          answer: `Yes. Eligible wagons are automatically advertised across relevant automotive marketplaces within our network, based on their body type, fuel type, drivetrain and other attributes.`,
        },
        {
          question: "What information should I include in a wagon advertisement?",
          answer: `Include the make, model, year, kilometres, condition, price, fuel type, transmission and features. Highlight boot space, seating flexibility, service history and clear photographs.`,
        },
        {
          question: "How do I determine the resale value of my wagon?",
          answer: `Compare similar wagons by make, model, year, kilometres, condition and features. Review current asking prices and consider service history, performance variants and modifications.`,
        },
        {
          question: "Can private sellers and dealerships advertise wagons?",
          answer: `Yes. Private sellers can advertise through SellMyCarOnline.au, while dealerships can <a href="${DEALER}">advertise eligible stock</a> across our unified automotive marketplace network.`,
        },
      ],
    },
    {
      label: "General & Buying",
      items: [
        {
          question: "Where can I find wagons for sale in Australia?",
          answer: `Browse <a href="/listings/">new and used wagons for sale</a> on WagonsForSale.com.au. Compare available station wagons from dealerships and private sellers across Australia by price, make, model, location and features.`,
        },
        {
          question: "What is the difference between a wagon and a station wagon?",
          answer: `Wagon and station wagon generally refer to the same body style, featuring an extended roofline, rear tailgate and flexible cargo space. European manufacturers sometimes use the term estate.`,
        },
        {
          question: "What is the difference between a wagon and a sedan?",
          answer: `Wagons generally offer an extended cargo area with a rear tailgate, while sedans have a separate boot. Compare <a href="https://www.sedansforsale.com.au/">sedans for sale</a> to explore both options.`,
        },
        {
          question: "Are station wagons more practical than SUVs?",
          answer: `Wagons often provide generous luggage space with car-like handling and a lower driving position. SUVs generally offer higher seating and ground clearance. The better choice depends on your needs.`,
        },
        {
          question: "Are station wagons suitable for Australian families?",
          answer: `Yes. Wagons can provide comfortable passenger seating, generous luggage space and practical storage for prams, sports equipment and holidays. Compare safety features, boot capacity and rear-seat comfort.`,
        },
        {
          question: "What are the benefits of owning a station wagon?",
          answer: `Station wagons combine passenger-car comfort with flexible cargo space. Many offer fuel-efficient engines, practical boot access, folding rear seats and comfortable long-distance driving.`,
        },
        {
          question: "What should I consider before buying a wagon?",
          answer: `Consider your budget, passenger space, boot capacity, fuel economy, safety features and running costs. For used wagons, check service history, mechanical condition and kilometres travelled.`,
        },
        {
          question: "How can I compare different wagons for sale?",
          answer: `Compare wagons by make, model, year, price, kilometres, body size, fuel type, transmission, drivetrain and features. Use the search filters on WagonsForSale.com.au to narrow your options.`,
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
