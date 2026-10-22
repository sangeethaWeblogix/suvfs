import Enquiry, { type TypeQuestion } from "./enquiry";
import { site } from "@/config/sites";
import { fetchSiteSchema } from "@/lib/siteSchema";
import "./enquiry.css";

/** The "What type of … are you looking for?" question per site: one of the
 * site's own multi-select filters (backend sites.json), options from its schema. */
const TYPE_FIELD: Record<string, string> = {
  suv: "body_size",
  utes: "cab_type",
  peoplemovers: "seats",
  sedans: "body_size",
  hatchbacks: "body_size",
  wagons: "body_size",
  coupes: "seats",
  convertibles: "seats",
  vans: "wheelbase",
  "4x4": "body_type",
  electric: "body_type",
  hybrid: "body_type",
};

const QUESTION: Record<string, string> = {
  body_size: `What size of ${site.noun} are you looking for?`,
  cab_type: "What cab type are you looking for?",
  seats: "How many seats do you need?",
  wheelbase: "What wheelbase are you looking for?",
  body_type: "What body type are you looking for?",
};

export default async function Home() {
  const field = TYPE_FIELD[site.key];
  const item = (await fetchSiteSchema()).find((s) => s.field === field);
  const typeQuestion: TypeQuestion | null =
    item && item.control === "multi" && item.options.length > 0
      ? {
          question: QUESTION[field],
          options: item.options.map((o) => (field === "seats" ? `${o} seats` : String(o))),
        }
      : null;
  return <Enquiry typeQuestion={typeQuestion} />;
}
