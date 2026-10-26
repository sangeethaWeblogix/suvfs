import { site } from "./sites";

/** The kinds of vehicle each site carries, phrased from its own filters
 * (body size / cab / seats, drivetrain or wheelbase, fuel type — backend
 * sites.json). Used in "Browse our complete range of …, including …" copy. */
const SITE_RANGE: Record<string, string> = {
  suv: "small, medium and large SUVs, AWD and 4WD SUVs, and petrol, diesel and hybrid SUVs",
  utes: "single, extra and dual cab utes, 4x4 and 2WD utes, and diesel and petrol utes",
  peoplemovers: "7-seat and 8-seat people movers, from compact family models to large people movers",
  sedans: "small, medium and large sedans, automatic and manual sedans, and petrol and hybrid sedans",
  hatchbacks: "micro, small and medium hatchbacks, automatic and manual hatchbacks, and petrol, hybrid and electric hatchbacks",
  wagons: "front-wheel drive, AWD and 4WD wagons, and petrol, diesel and hybrid wagons",
  coupes: "2-seat and 4-seat coupes, automatic and manual coupes, and high-performance coupes",
  convertibles: "2-seat and 4-seat convertibles, and automatic and manual convertibles",
  vans: "medium and long wheelbase vans, cargo and passenger vans, and diesel and electric vans",
  "4x4": "4x4 SUVs, utes, wagons and vans, and diesel and petrol 4x4s",
  "4wd": "4WD SUVs, wagons and people movers, 7 and 8 seat 4WDs, and 4WDs that tow 2,000 kg or more",
  awd: "all-wheel-drive SUVs, wagons, hatchbacks and performance cars, including petrol, hybrid and electric AWD vehicles",
  electric: "electric SUVs, hatchbacks, sedans and vans, with a range of battery sizes and driving ranges",
  hybrid: "hybrid and plug-in hybrid cars, including hybrid SUVs, hatchbacks, sedans, wagons and utes",
};

export const siteRange: string = SITE_RANGE[site.key] ?? `new and used ${site.nounPlural}`;
