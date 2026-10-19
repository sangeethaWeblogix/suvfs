"use client";
// Schema-driven filters for the car sites. The cars API describes each site's
// filter panel (GET /car-sites/{site}/ → filters_schema); this file renders it:
// toolbar buttons + their modals, active-filter chips and the sections inside
// the "All filters" modal. Make/Model keeps its dedicated UI in StateFilterBar,
// so that schema entry is skipped here. The per-site filter sets and their
// order follow "MasterCars – Recommended Filters by Site".
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { appendFilterParams, splitMulti } from "@/config/filterDefs";
import type { FilterState } from "./StateFilterBar";

/* ── Schema (shape returned by the API) ── */
export type SchemaItem =
  | { field: string; label: string; control: "make_model"; params: string[] }
  | { field: string; label: string; control: "range"; params: [string, string]; min: number; max: number; step: number; unit?: string; max_is_plus?: boolean }
  | { field: string; label: string; control: "multi"; param: string; options: (string | number)[]; values?: string[] }
  | { field: string; label: string; control: "min_dropdown"; param: string; options: number[]; unit?: string };

/** Fields with their own UI in StateFilterBar. */
const HANDLED_ELSEWHERE = new Set(["make_model"]);

const SiteSchemaContext = createContext<SchemaItem[]>([]);

export function SiteSchemaProvider({ schema, children }: { schema: SchemaItem[]; children: ReactNode }) {
  return <SiteSchemaContext.Provider value={schema}>{children}</SiteSchemaContext.Provider>;
}

/** The schema entries rendered by this file, in the site's panel order. */
export function useSiteFilterSchema(): SchemaItem[] {
  return useContext(SiteSchemaContext).filter((s) => !HANDLED_ELSEWHERE.has(s.control) && !HANDLED_ELSEWHERE.has(s.field));
}

/* ── Value helpers ── */
type Values = Record<string, unknown>;

export function keysOf(item: SchemaItem): string[] {
  return item.control === "range" || item.control === "make_model" ? item.params : [item.param];
}

const present = (v: unknown) => v !== undefined && v !== null && String(v).trim() !== "";

export function hasValue(item: SchemaItem, values: Values): boolean {
  return keysOf(item).some((k) => present(values[k]));
}

function multiOptions(item: Extract<SchemaItem, { control: "multi" }>) {
  return item.options.map((label, i) => ({ label: String(label), value: String(item.values?.[i] ?? label).toLowerCase() }));
}

function formatAmount(n: number, unit?: string): string {
  const num = n.toLocaleString("en-AU");
  if (!unit) return num;
  if (unit === "AUD") return `$${num}`;
  return `${num} ${unit.replace("m3", "m³")}`;
}

/** Dropdown steps between min and max, thinned out to at most ~30 entries. */
function rangeSteps(item: Extract<SchemaItem, { control: "range" }>): number[] {
  const span = item.max - item.min;
  let step = item.step || 1;
  for (const k of [1, 2, 2.5, 5, 10, 20, 25, 50, 100]) {
    if (span / (item.step * k) <= 30) { step = item.step * k; break; }
  }
  const out: number[] = [];
  for (let v = item.min; v <= item.max + 1e-9; v += step) out.push(Math.round(v * 100) / 100);
  if (out[out.length - 1] !== item.max) out.push(item.max);
  return out;
}

function rangeLabel(item: Extract<SchemaItem, { control: "range" }>, v: number): string {
  const text = formatAmount(v, item.unit);
  return item.max_is_plus && v === item.max ? `${text}+` : text;
}

/** Normalise temp values before applying: drop "from = min" and "to = max+" (they mean "any"). */
function normalise(item: SchemaItem, temp: Values): Values {
  const out: Values = {};
  for (const k of keysOf(item)) out[k] = present(temp[k]) ? temp[k] : undefined;
  if (item.control === "range") {
    const [fromKey, toKey] = item.params;
    if (Number(out[fromKey]) === item.min) out[fromKey] = undefined;
    if (item.max_is_plus && Number(out[toKey]) === item.max) out[toKey] = undefined;
  }
  return out;
}

/** Short text for an active filter (chips). */
export function describe(item: SchemaItem, values: Values): string {
  if (item.control === "multi") {
    const selected = splitMulti(values[item.param]).map((v) => v.toLowerCase());
    const labels = multiOptions(item).filter((o) => selected.includes(o.value)).map((o) => o.label);
    const text = (labels.length ? labels : selected).join(", ");
    return item.field === "condition" ? text : `${item.label}: ${text}`;
  }
  if (item.control === "min_dropdown") return `${item.label}: ${formatAmount(Number(values[item.param]), item.unit)}+`;
  if (item.control === "range") {
    const [fromKey, toKey] = item.params;
    const from = present(values[fromKey]) ? Number(values[fromKey]) : null;
    const to = present(values[toKey]) ? Number(values[toKey]) : null;
    const f = (n: number) => (item.field === "year" ? String(n) : formatAmount(n, item.unit));
    const text = from !== null && to !== null ? (from === to ? f(from) : `${f(from)} – ${f(to)}`) : from !== null ? `From ${f(from)}` : `Up to ${f(to!)}`;
    return item.field === "year" ? text : `${item.label}: ${text}`;
  }
  return item.label;
}

/* ── Live facet counts (GET /api/site-filters → /car-sites/{site}/filters) ── */
type Facets = Record<string, any>;

export function useSiteFacets(filters: FilterState): Facets {
  const [facets, setFacets] = useState<Facets>({});
  const params = new URLSearchParams();
  for (const k of ["state", "condition", "make", "model", "from_price", "to_price"]) {
    if (present(filters[k])) params.set(k, String(filters[k]).toLowerCase());
  }
  appendFilterParams(params, filters);
  const qs = params.toString();
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/site-filters/?${qs}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : {}))
      .then((json) => { if (!controller.signal.aborted) setFacets(json ?? {}); })
      .catch((e) => { if (e.name !== "AbortError") console.error("[SiteFilters] facets", e); });
    return () => controller.abort();
  }, [qs]);
  return facets;
}

const FACET_KEY: Record<string, string> = { condition: "conditions", year: "years" };

function countFor(facets: Facets, item: SchemaItem, value: string, label: string): number | undefined {
  if (item.control === "min_dropdown") return facets?.buckets?.[item.field]?.[value];
  const bucket = facets?.[FACET_KEY[item.field] ?? item.field];
  if (!bucket || typeof bucket !== "object" || "min" in bucket) return undefined;
  // "8+" seats is counted under "8" by the API.
  return bucket[value] ?? bucket[label] ?? bucket[label.toLowerCase()] ?? bucket[value.replace(/\+$/, "")];
}

/** Dual-thumb range slider over `steps`; the ends mean "Any". */
function RangeSlider({ item, from, to, onChange }: {
  item: Extract<SchemaItem, { control: "range" }>; from: number | null; to: number | null;
  onChange: (from: number | null, to: number | null) => void;
}) {
  const steps = rangeSteps(item);
  const last = steps.length - 1;
  const indexOf = (v: number | null, fallback: number) => {
    if (v === null) return fallback;
    const i = steps.findIndex((s) => s >= v);
    return i === -1 ? last : i;
  };
  const lo = indexOf(from, 0);
  const hi = indexOf(to, last);
  const label = (v: number) => (item.field === "year" ? String(v) : rangeLabel(item, v));
  const pct = (i: number) => (last ? (i / last) * 100 : 0);
  const set = (nextLo: number, nextHi: number) =>
    onChange(nextLo === 0 ? null : steps[nextLo], nextHi === last ? null : steps[nextHi]);

  return (
    <div className="cfs-range">
      <div className="cfs-range-values">
        <span>{label(steps[lo])}</span>
        <span>{label(steps[hi])}</span>
      </div>
      <div className="cfs-range-track-wrap">
        <div className="cfs-range-track" style={{
          background: `linear-gradient(to right,#ddd ${pct(lo)}%,var(--brand) ${pct(lo)}%,var(--brand) ${pct(hi)}%,#ddd ${pct(hi)}%)`,
        }} />
        <input type="range" className="cfs-range-input" min={0} max={last} step={1} value={lo}
          aria-label={`Minimum ${item.label}`}
          style={{ zIndex: lo === last ? 4 : 3 }}
          onChange={(e) => set(Math.min(Number(e.target.value), hi), hi)} />
        <input type="range" className="cfs-range-input" min={0} max={last} step={1} value={hi}
          aria-label={`Maximum ${item.label}`}
          onChange={(e) => set(lo, Math.max(Number(e.target.value), lo))} />
      </div>
    </div>
  );
}

/* ── One filter's controls (shared by the button modals and the All-filters modal) ── */
function FilterControl({ item, values, onChange, facets }: {
  item: SchemaItem; values: Values; onChange: (patch: Values) => void; facets: Facets;
}) {
  if (item.control === "multi") {
    const selected = splitMulti(values[item.param]).map((v) => v.toLowerCase());
    const toggle = (value: string) => {
      const next = selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value];
      onChange({ [item.param]: next.length ? next.join(",") : undefined });
    };
    return (
      <ul className="loc-state-list">
        {multiOptions(item).map((o) => {
          const isOn = selected.includes(o.value);
          const count = countFor(facets, item, o.value, o.label);
          return (
            <li key={o.value} className="loc-state-item" onClick={() => toggle(o.value)}>
              <span className={`loc-checkbox${isOn ? " checked" : ""}`}>
                {isOn && <i className="bi bi-check" style={{ color: "#fff", fontSize: 14, lineHeight: 1 }} />}
              </span>
              <span className="loc-state-name">{o.label}</span>
              {count !== undefined && <span className="loc-state-count" style={{ marginLeft: "auto", color: "#888", fontSize: 13 }}>{count}</span>}
            </li>
          );
        })}
      </ul>
    );
  }

  if (item.control === "min_dropdown") {
    return (
      <select className="cfs-select-input form-select" value={present(values[item.param]) ? String(values[item.param]) : ""}
        onChange={(e) => onChange({ [item.param]: e.target.value || undefined })}>
        <option value="">Any</option>
        {item.options.map((n) => {
          const count = countFor(facets, item, String(n), String(n));
          return <option key={n} value={n}>{formatAmount(n, item.unit)}+{count !== undefined ? ` (${count})` : ""}</option>;
        })}
      </select>
    );
  }

  if (item.control === "range") {
    const [fromKey, toKey] = item.params;
    const from = present(values[fromKey]) ? Number(values[fromKey]) : null;
    const to = present(values[toKey]) ? Number(values[toKey]) : null;
    return (
      <RangeSlider item={item} from={from} to={to}
        onChange={(f, t) => onChange({ [fromKey]: f ?? undefined, [toKey]: t ?? undefined })} />
    );
  }
  return null;
}

const CloseIcon = ({ onClick }: { onClick: () => void }) => (
  <button className="filter-close" onClick={onClick} aria-label="Close">
    <i className="bi bi-x-lg" style={{ fontSize: 18 }} />
  </button>
);

/* ── Toolbar buttons + one modal per filter ── */
export function SiteFilterButtons({ filters, onApply }: { filters: FilterState; onApply: (updates: Values) => void }) {
  const schema = useSiteFilterSchema();
  const facets = useSiteFacets(filters);
  const [open, setOpen] = useState<SchemaItem | null>(null);
  const [temp, setTemp] = useState<Values>({});

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const openItem = (item: SchemaItem) => {
    setTemp(Object.fromEntries(keysOf(item).map((k) => [k, filters[k]])));
    setOpen(item);
  };
  const apply = (values: Values) => { onApply(normalise(open!, values)); setOpen(null); };
  const tempActive = open ? hasValue(open, temp) : false;

  return (
    <>
      {schema.map((item) => {
        const active = hasValue(item, filters);
        return (
          <button key={item.field} className={`tag${active ? " active" : ""}`} onClick={() => openItem(item)}>
            {item.label}
            {active && <span className="active_filter"><i className="bi bi-circle-fill" /></span>}
          </button>
        );
      })}

      {/* Portalled: the buttons sit inside the scrolling toolbar, which would clip a fixed overlay. */}
      {open && createPortal(
        <div className="filter-overlay">
          <div className="filter-modal">
            <div className="filter-header"><h3>{open.label}</h3><CloseIcon onClick={() => setOpen(null)} /></div>
            <div className="filter-body">
              <div className="filter-item">
                <FilterControl item={open} values={temp} facets={facets} onChange={(patch) => setTemp((t) => ({ ...t, ...patch }))} />
              </div>
            </div>
            <div className="filter-footer">
              <button className="clear" onClick={() => apply({})}
                style={{ opacity: tempActive ? 1 : 0.4, cursor: tempActive ? "pointer" : "not-allowed" }}>Clear filters</button>
              <button className={`search${tempActive ? " active" : ""}`} onClick={() => apply(temp)}>Search</button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

/* ── Active chips ── */
export function SiteFilterChips({ filters, onRemove, onOpen }: {
  filters: FilterState; onRemove: (updates: Values) => void; onOpen: () => void;
}) {
  const schema = useSiteFilterSchema();
  return (
    <>
      {schema.filter((item) => hasValue(item, filters)).map((item) => (
        <span key={item.field} className="active-chip">
          <span className="chip-label" onClick={onOpen}>{describe(item, filters)}</span>
          <span className="chip-close" onClick={() => onRemove(Object.fromEntries(keysOf(item).map((k) => [k, undefined])))}>×</span>
        </span>
      ))}
    </>
  );
}

/** Values for every schema filter, read from `filters` (seeds the All-filters modal). */
export function pickSiteFilterValues(schema: SchemaItem[], filters: FilterState): Values {
  return Object.fromEntries(schema.flatMap(keysOf).map((k) => [k, filters[k]]));
}

/** Normalised updates for every schema filter (All-filters "Search"). */
export function siteFilterUpdates(schema: SchemaItem[], temp: Values): Values {
  return Object.assign({}, ...schema.map((item) => normalise(item, temp)));
}

/* ── Sections inside the All-filters modal ── */
export function SiteFilterSections({ filters, values, onChange }: {
  filters: FilterState; values: Values; onChange: (patch: Values) => void;
}) {
  const schema = useSiteFilterSchema();
  const facets = useSiteFacets(filters);
  return (
    <>
      {schema.map((item) => (
        <div key={item.field} className="filter-item">
          <h4>{item.label}</h4>
          <FilterControl item={item} values={values} facets={facets} onChange={onChange} />
        </div>
      ))}
    </>
  );
}
