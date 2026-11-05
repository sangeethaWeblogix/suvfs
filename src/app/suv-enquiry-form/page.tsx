import Enquiry from "./enquiry";
import "./enquiry.css";
import { site } from "@/config/sites";
import { fetchSiteSchema } from "@/lib/siteSchema";
import { CONDITION_FIELD, PURCHASE_FIELDS, getEnquiryForm, resolveFields } from "@/config/enquiryForms";

// The form's per-site questions live in src/config/enquiryForms.ts; questions
// tied to a backend attribute take that attribute's terms from the site's
// filters_schema (cached for an hour by fetchSiteSchema).
export default async function Home() {
  const schema = await fetchSiteSchema();
  const form = getEnquiryForm(site.key);
  return (
    <Enquiry
      fields={resolveFields(form.fields, schema)}
      condition={resolveFields([CONDITION_FIELD], schema)[0]}
      purchase={resolveFields(PURCHASE_FIELDS, schema)}
      budgetSteps={form.budgetSteps}
      messageHint={form.messageHint}
    />
  );
}
