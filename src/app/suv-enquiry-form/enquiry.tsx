"use client";

import Link from "next/link";

import React, { useState } from "react";
import { site } from "@/config/sites";

/** Site-specific "what type" question (see page.tsx); null hides the field. */
export type TypeQuestion = { question: string; options: string[] };

type FormState = {
  "your-name": string;
  "your-email": string;
  "your-phone": string;
  "you-postcode": string; // keep as-is since your CF7 works with this key
  "your-message": string;
  "vehicle-type": string;
  condition: string;
  budget: string;
};

export default function ContactSection({ typeQuestion }: { typeQuestion: TypeQuestion | null }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState<FormState>({
    "your-name": "",
    "your-email": "",
    "your-phone": "",
    "you-postcode": "",
    "your-message": "",
    "vehicle-type": "",
    condition: "",
    budget: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // clear field error on change
    if (errors[e.target.name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    }
  };

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};

    // Name validation (only letters, spaces allowed)
    if (!formData["your-name"].trim()) {
      next["your-name"] = "Name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(formData["your-name"])) {
      next["your-name"] = "Name must contain only letters.";
    }

    // Email validation
    if (!formData["your-email"].trim()) {
      next["your-email"] = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData["your-email"])) {
      next["your-email"] = "Enter a valid email.";
    }

    // Phone validation
    if (!formData["your-phone"].trim()) {
      next["your-phone"] = "Phone is required.";
    } else if (!/^[0-9\s+\-()]{7,20}$/.test(formData["your-phone"])) {
      next["your-phone"] = "Enter a valid phone number.";
    }

    // Postcode validation (exactly 4 digits)
    if (!formData["you-postcode"].trim()) {
      next["you-postcode"] = "Postcode is required.";
    } else if (!/^\d{4}$/.test(formData["you-postcode"])) {
      next["you-postcode"] = "Postcode must be 4 digits.";
    }

    // Vehicle type (only when this site asks it)
    if (typeQuestion && !formData["vehicle-type"].trim()) {
      next["vehicle-type"] = "Please choose an option.";
    }

    // Condition
    if (!formData["condition"].trim()) {
      next["condition"] = "Condition is required.";
    }

    // Requirements (the API requires it)
    if (!formData["your-message"].trim()) {
      next["your-message"] = "Please tell us what you're looking for.";
    }

    // Budget validation (only numbers)
    if (!formData["budget"].trim()) {
      next["budget"] = "Budget is required.";
    } else if (!/^\d+$/.test(formData["budget"])) {
      next["budget"] = "Budget must be a number.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (loading) return; // guard
    if (!validate()) {
      setMessage("⚠️ All fields are required.");
      return;
    }

    try {
      setLoading(true);

      // The enquiry API has no field for the type answer, so it goes at the
      // top of the requirements text the team receives.
      const type = formData["vehicle-type"];
      const payload = {
        name: formData["your-name"],
        phone: formData["your-phone"],
        email: formData["your-email"],
        postcode: formData["you-postcode"],
        condition: formData.condition,
        budget: formData.budget,
        requirements: type && typeQuestion
          ? `${typeQuestion.question} ${type}

${formData["your-message"]}`
          : formData["your-message"],
      };

      const res = await fetch("/api/caravan-enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Message sent successfully!");
        // clear form + errors
        setFormData({
          "your-name": "",
          "your-email": "",
          "your-phone": "",
          "you-postcode": "",
          "your-message": "",
          "vehicle-type": "",
          condition: "",
          budget: "",
        });
        setErrors({});
      } else {
        setMessage("❌ Error: " + (data.message || "Failed to send message."));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  const hasAnyError = Object.values(errors).some(Boolean);

  return (
    <>
      <section className="contact section-padding style-6">
        <div className="container">
          <div className="content">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="commun-card">
                  <form onSubmit={handleSubmit} className="form" method="post">
                    <div className="text-center header_form">
                      <h4>
                        Exclusive Offers From Select Quality {site.singular}{" "}
                        Manufacturers
                      </h4>
                    </div>
                    <p className="required_txt">
                      Fill out the form below, and we&apos;ll send you exclusive
                      deals for the best {site.nounPlural} in the market.
                    </p>
                    <div className="row">
                      {/* Name */}
                      <div className="col-lg-6">
                        <div className="form-group mb-20">
                          <input
                            type="text"
                            name="your-name"
                            className="form-control"
                            placeholder="Name*"
                            value={formData["your-name"]}
                            onChange={handleChange}
                            required
                          />
                          {errors["your-name"] && (
                            <small className="text-danger">
                              {errors["your-name"]}
                            </small>
                          )}
                        </div>
                      </div>

                      {/* Email */}
                      <div className="col-lg-6">
                        <div className="form-group mb-20">
                          <input
                            type="text"
                            name="your-email"
                            className="form-control"
                            placeholder="Email Address*"
                            value={formData["your-email"]}
                            onChange={handleChange}
                            required
                          />
                          {errors["your-email"] && (
                            <small className="text-danger">
                              {errors["your-email"]}
                            </small>
                          )}
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="col-lg-6">
                        <div className="form-group mb-20">
                          <input
                            type="text"
                            name="your-phone"
                            className="form-control"
                            placeholder="Phone Number*"
                            value={formData["your-phone"]}
                            onChange={handleChange}
                            required
                          />
                          {errors["your-phone"] && (
                            <small className="text-danger">
                              {errors["your-phone"]}
                            </small>
                          )}
                        </div>
                      </div>

                      {/* Postcode */}
                      <div className="col-lg-6">
                        <div className="form-group mb-20">
                          <input
                            type="text"
                            name="you-postcode"
                            className="form-control"
                            placeholder="Postcode*"
                            value={formData["you-postcode"]}
                            onChange={handleChange}
                            required
                          />
                          {errors["you-postcode"] && (
                            <small className="text-danger">
                              {errors["you-postcode"]}
                            </small>
                          )}
                        </div>
                      </div>

                      {/* Vehicle type — site-specific question (page.tsx) */}
                      {typeQuestion && (
                        <div className="col-lg-6">
                          <div className="form-group mb-20">
                            <select
                              name="vehicle-type"
                              className="form-control"
                              value={formData["vehicle-type"]}
                              onChange={handleChange}
                              required
                            >
                              <option value="">{typeQuestion.question}</option>
                              {typeQuestion.options.map((o) => (
                                <option key={o} value={o}>{o}</option>
                              ))}
                            </select>
                            {errors["vehicle-type"] && (
                              <small className="text-danger">
                                {errors["vehicle-type"]}
                              </small>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Condition */}
                      <div className={typeQuestion ? "col-lg-6" : "col-lg-12"}>
                        <div className="form-group mb-20">
                          <select
                            name="condition"
                            className="form-control"
                            value={formData.condition}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select Condition</option>
                            <option value="New">New</option>
                            
                            <option value="Used">Used</option>
                          </select>
                          {errors.condition && (
                            <small className="text-danger">
                              {errors.condition}
                            </small>
                          )}
                        </div>
                      </div>

                      {/* Budget */}
                      <div className="col-lg-12">
                        <div className="form-group mb-20">
                          <input
                            type="text"
                            name="budget"
                            className="form-control"
                            placeholder="What is your budget?*"
                            value={formData.budget}
                            onChange={handleChange}
                            required
                          />
                          {errors.budget && (
                            <small className="text-danger">
                              {errors.budget}
                            </small>
                          )}
                        </div>
                      </div>

                      {/* Requirements */}
                      <div className="col-lg-12">
                        <div className="form-group mb-20">
                          <textarea
                            name="your-message"
                            className="form-control"
                            placeholder={`Tell us what you're after: preferred make and model, year, kilometres, must-have features and anything else that matters to you. This helps us find the right ${site.noun} for you.*`}
                            value={formData["your-message"]}
                            onChange={handleChange}
                            required
                          />
                          {errors["your-message"] && (
                            <small className="text-danger">
                              {errors["your-message"]}
                            </small>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <p className="terms_text">
                          By clicking &apos;Submit&apos;, you agree to {site.singular}{" "}
                          Marketplace{" "}
                          <Link
                            href="/privacy-collection-statement/"
                            target="_blank"
                          >
                            Personal Information Collection Statement
                          </Link>
                          ,{" "}
                          <Link href="/privacy-policy/" target="_blank">
                            Privacy Policy
                          </Link>{" "}
                          and{" "}
                          <Link href="/terms-conditions/" target="_blank">
                            Terms and Conditions
                          </Link>
                          .
                        </p>
                      </div>

                      {/* Submit Button */}
                      <div className="col-lg-12 text-center">
                        <input
                          type="submit"
                          value={loading ? "Submitting..." : "SUBMIT"}
                          className="btn bg-blue4 fw-bold text-white text-light fs-12px"
                          disabled={loading}
                        />
                      </div>

                      {/* Message */}
                      {message && (
                        <div className="col-lg-12 mt-3 text-center">
                          <p
                            className={
                              hasAnyError ? "text-danger" : "text-success"
                            }
                          >
                            {message}
                          </p>
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
    </>
  );
}
