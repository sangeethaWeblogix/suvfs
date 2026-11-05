"use client";

import Link from "next/link";
import React, { useState } from "react";
import { site } from "@/config/sites";
import { budgetOptions, type ResolvedSelect } from "@/config/enquiryForms";

// One form for every site; the site's own questions come from config/enquiryForms.ts,
// resolved against the backend attributes in page.tsx. One answer per question.
type Props = {
  fields: ResolvedSelect[];
  condition: ResolvedSelect;
  purchase: ResolvedSelect[];
  budgetSteps: number[];
  messageHint: string;
};

type Values = Record<string, string>;
type Errors = Record<string, string | undefined>;

const EMPTY: Values = {
  name: "",
  email: "",
  phone: "",
  postcode: "",
  condition: "",
  budget: "",
  make: "",
  model: "",
  message: "",
};

/** Australian landline or mobile, with or without +61 / spaces / brackets. */
const AU_PHONE = /^(?:\+?61|0)[2-478]\d{8}$/;
/** Letters (any language), spaces, apostrophes, hyphens, full stops: "Siobhán O'Brien-Smith". */
const NAME = /^\p{L}[\p{L}\s'.-]*$/u;

type Detail = {
  key: string;
  label: string;
  value: string;
  group: "vehicle" | "purchase";
  /** Backend attribute and term slug, when the question maps to one. */
  attr?: string;
  slug?: string;
};

function detailOf(f: ResolvedSelect, value: string, group: Detail["group"]): Detail {
  const slug = f.choices.find((c) => c.label === value)?.slug;
  return {
    key: f.name,
    label: f.label.replace(/\?$/, ""),
    value,
    group,
    ...(f.attr && slug && { attr: f.attr, slug }),
  };
}

/**
 * The site's answers as structured `details` (saved in their own column by
 * admin-cars). Vehicle answers may show publicly on the home "Recent Buyer
 * Requests"; purchase answers (timeframe, payment, trade-in) stay admin-only.
 */
function buildDetails(values: Values, fields: ResolvedSelect[], purchase: ResolvedSelect[]): Detail[] {
  const out: Detail[] = [];
  for (const f of fields) {
    if (values[f.name]) out.push(detailOf(f, values[f.name], "vehicle"));
  }
  const makeModel = [values.make.trim(), values.model.trim()].filter(Boolean).join(" ");
  if (makeModel) out.push({ key: "makeModel", label: "Preferred make/model", value: makeModel, group: "vehicle" });
  for (const f of purchase) {
    if (values[f.name]) out.push(detailOf(f, values[f.name], "purchase"));
  }
  return out;
}

/**
 * Everything as text, for a backend without `details` support: it stores
 * this as requirements. A current backend stores `notes` there instead.
 */
function requirementsText(details: Detail[], notes: string): string {
  const lines = details.map((d) => `${d.label}: ${d.value}`).join("\n");
  return notes ? `${lines}\n\n${notes}` : lines;
}

function SelectField({
  field,
  value,
  error,
  onChange,
  wide,
}: {
  field: ResolvedSelect;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  wide?: boolean;
}) {
  const id = `enq-${field.name}`;
  return (
    <div className={wide ? "col-lg-12" : "col-lg-6"}>
      <div className="form-group mb-20">
        <label htmlFor={id} className="enq-label">
          {field.label}
          {field.required ? " *" : <>{" "}<span className="enq-optional">(optional)</span></>}
        </label>
        <select
          id={id}
          name={field.name}
          className="form-control"
          value={value}
          onChange={onChange}
          required={field.required}
          aria-invalid={!!error}
        >
          <option value="">{field.placeholder ?? (field.required ? "Select…" : "Any")}</option>
          {field.choices.map((c) => (
            <option key={c.label} value={c.label}>
              {c.label}
            </option>
          ))}
        </select>
        {error && <small className="text-danger">{error}</small>}
      </div>
    </div>
  );
}

export default function ContactSection({ fields, condition, purchase, budgetSteps, messageHint }: Props) {
  const BUDGETS = budgetOptions(budgetSteps);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next: Errors = {};
    const name = values.name.trim();
    if (!name) next.name = "Please enter your name.";
    else if (!NAME.test(name)) next.name = "Please use letters only.";

    const email = values.email.trim();
    if (!email) next.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Please enter a valid email address.";

    const phone = values.phone.replace(/[\s()-]/g, "");
    if (!phone) next.phone = "Please enter your phone number.";
    else if (!AU_PHONE.test(phone)) next.phone = "Please enter an Australian number, e.g. 0412 345 678.";

    if (!values.postcode.trim()) next.postcode = "Please enter your postcode.";
    else if (!/^\d{4}$/.test(values.postcode.trim())) next.postcode = "Postcode must be 4 digits.";

    for (const f of fields) {
      if (f.required && !values[f.name]) next[f.name] = "Please choose an option.";
    }
    if (!values.condition) next.condition = "Please choose a condition.";
    if (!values.budget) next.budget = "Please choose your maximum budget.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setSent(false);
    if (loading) return;
    if (!validate()) {
      setMessage("Please check the highlighted fields.");
      return;
    }

    try {
      setLoading(true);
      const details = buildDetails(values, fields, purchase);
      const notes = values.message.trim();
      const payload = {
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        postcode: values.postcode.trim(),
        condition: values.condition,
        budget: values.budget,
        requirements: requirementsText(details, notes),
        details,
        notes,
      };

      const res = await fetch("/api/caravan-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSent(true);
        setMessage(
          `Thanks! We've received your requirements and will be in touch with matching ${site.nounPlural}.`
        );
        setValues(EMPTY);
        setErrors({});
      } else {
        setMessage(data.message || "Sorry, we couldn't send your enquiry. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const textInput = (
    name: string,
    placeholder: string,
    opts: { type?: string; inputMode?: "numeric" | "tel" | "email"; autoComplete?: string; maxLength?: number } = {}
  ) => (
    <div className="col-lg-6">
      <div className="form-group mb-20">
        <input
          type={opts.type ?? "text"}
          name={name}
          className="form-control"
          placeholder={placeholder}
          aria-label={placeholder.replace(" *", "")}
          value={values[name]}
          onChange={handleChange}
          inputMode={opts.inputMode}
          autoComplete={opts.autoComplete}
          maxLength={opts.maxLength}
          aria-invalid={!!errors[name]}
        />
        {errors[name] && <small className="text-danger">{errors[name]}</small>}
      </div>
    </div>
  );

  // Site questions fill a 2-column grid; an odd one out goes full width.
  const prefFields = [...fields, condition];

  return (
    <section className="contact section-padding style-6 enq">
      <div className="container">
        <div className="content">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="commun-card">
                <form onSubmit={handleSubmit} className="form" method="post" noValidate>
                  <div className="text-center header_form">
                    <h4>Find the Right {site.singular} for You</h4>
                    <p>
                      Tell us what you&apos;re looking for and we&apos;ll help connect you with
                      relevant {site.noun} options from participating sellers.
                    </p>
                  </div>

                  <h5 className="enq-section">Your contact details</h5>
                  <div className="row">
                    {textInput("name", "Full name *", { autoComplete: "name", maxLength: 80 })}
                    {textInput("email", "Email address *", { type: "email", inputMode: "email", autoComplete: "email" })}
                    {textInput("phone", "Phone number *", { type: "tel", inputMode: "tel", autoComplete: "tel" })}
                    {textInput("postcode", "Postcode *", { inputMode: "numeric", autoComplete: "postal-code", maxLength: 4 })}
                  </div>

                  <hr className="enq-divider" />

                  <h5 className="enq-section">Your vehicle preferences</h5>
                  <div className="row">
                    {prefFields.map((f, i) => (
                      <SelectField
                        key={f.name}
                        field={f}
                        value={values[f.name] ?? ""}
                        error={errors[f.name]}
                        onChange={handleChange}
                        wide={i === prefFields.length - 1 && prefFields.length % 2 === 1}
                      />
                    ))}

                    {/* Budget */}
                    <div className="col-lg-12">
                      <div className="form-group mb-20">
                        <label htmlFor="enq-budget" className="enq-label">
                          Your maximum budget *
                        </label>
                        <select
                          id="enq-budget"
                          name="budget"
                          className="form-control"
                          value={values.budget}
                          onChange={handleChange}
                          aria-invalid={!!errors.budget}
                        >
                          <option value="">Select budget</option>
                          {BUDGETS.map((b) => (
                            <option key={b.value} value={b.value}>
                              {b.label}
                            </option>
                          ))}
                        </select>
                        {errors.budget && <small className="text-danger">{errors.budget}</small>}
                      </div>
                    </div>

                    {/* Make / model */}
                    <div className="col-lg-6">
                      <div className="form-group mb-20">
                        <label htmlFor="enq-make" className="enq-label">
                          Preferred make <span className="enq-optional">(optional)</span>
                        </label>
                        <input id="enq-make" name="make" className="form-control" placeholder="Any make" value={values.make} onChange={handleChange} maxLength={40} />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group mb-20">
                        <label htmlFor="enq-model" className="enq-label">
                          Preferred model <span className="enq-optional">(optional)</span>
                        </label>
                        <input id="enq-model" name="model" className="form-control" placeholder="Any model" value={values.model} onChange={handleChange} maxLength={60} />
                      </div>
                    </div>
                  </div>

                  <hr className="enq-divider" />

                  <h5 className="enq-section">About your purchase <span className="enq-optional">(optional)</span></h5>
                  <div className="row">
                    {purchase.map((f) => (
                      <div key={f.name} className="col-lg-4">
                        <div className="form-group mb-20">
                          <label htmlFor={`enq-${f.name}`} className="enq-label">
                            {f.label}
                          </label>
                          <select id={`enq-${f.name}`} name={f.name} className="form-control" value={values[f.name] ?? ""} onChange={handleChange}>
                            <option value="">Select</option>
                            {f.choices.map((c) => (
                              <option key={c.label} value={c.label}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}

                    {/* Additional requirements */}
                    <div className="col-lg-12">
                      <div className="form-group mb-20">
                        <label htmlFor="enq-message" className="enq-label">
                          Additional requirements <span className="enq-optional">(optional)</span>
                        </label>
                        <textarea
                          id="enq-message"
                          name="message"
                          className="form-control"
                          placeholder={messageHint}
                          value={values.message}
                          onChange={handleChange}
                          maxLength={1500}
                        />
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <p className="terms_text">
                        By submitting, you agree to our{" "}
                        <Link href="/terms-conditions/" target="_blank">Terms</Link> and acknowledge our{" "}
                        <Link href="/privacy-policy/" target="_blank">Privacy Policy</Link> and{" "}
                        <Link href="/privacy-collection-statement/" target="_blank">Collection Statement</Link>.
                        Your enquiry details may be shared with relevant participating sellers as described
                        in the Collection Statement.
                      </p>
                    </div>

                    <div className="col-lg-12 text-center">
                      <input
                        type="submit"
                        value={loading ? "Submitting..." : `FIND MY ${site.singular.toUpperCase()}`}
                        className="btn bg-blue4 fw-bold text-white text-light fs-12px"
                        disabled={loading}
                      />
                    </div>

                    {message && (
                      <div className="col-lg-12 mt-3 text-center" role="status" aria-live="polite">
                        <p className={sent ? "text-success" : "text-danger"}>{message}</p>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
