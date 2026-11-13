"use client";

import { useState } from "react";
import type { FaqCategory } from "./homeFaqData";
import "./homeFaq.css";

/** Tabbed FAQ accordion. Every tab and answer is in the HTML (inactive ones
 * hidden) so search engines read all of them, matching the FAQPage schema. */
export default function HomeFaq({ categories }: { categories: FaqCategory[] }) {
  const [active, setActive] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const selectTab = (i: number) => {
    setActive(i);
    setOpenIndex(0);
  };

  return (
    <section className="hfaq-section">
      <div className="container">
        <h2 className="hfaq-title">Frequently Asked Questions</h2>

        <div className="hfaq-tabs" role="tablist" aria-label="FAQ categories">
          {categories.map((cat, i) => (
            <button
              key={cat.label}
              id={`hfaq-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-controls={`hfaq-panel-${i}`}
              className={`hfaq-tab${active === i ? " hfaq-tab--active" : ""}`}
              onClick={() => selectTab(i)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {categories.map((cat, i) => (
          <div
            key={cat.label}
            id={`hfaq-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`hfaq-tab-${i}`}
            className="hfaq-panel"
            hidden={active !== i}
          >
            <div className="hfaq-panel-head">
              <h3 className="hfaq-panel-title">{cat.label}</h3>
              <span className="hfaq-panel-count">{cat.items.length} questions</span>
            </div>

            <div className="hfaq-list">
              {cat.items.map((item, j) => {
                const isOpen = active === i && openIndex === j;
                const answerId = `hfaq-answer-${i}-${j}`;
                return (
                  <div key={item.question} className={`hfaq-item${isOpen ? " hfaq-item--open" : ""}`}>
                    <button
                      type="button"
                      className="hfaq-question"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => setOpenIndex(isOpen ? null : j)}
                    >
                      <span>{item.question}</span>
                      <i className={`bi ${isOpen ? "bi-chevron-up" : "bi-chevron-down"}`} aria-hidden="true" />
                    </button>
                    <div
                      id={answerId}
                      className="hfaq-answer"
                      hidden={!isOpen}
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
