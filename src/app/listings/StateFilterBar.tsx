"use client";
import "../components/filter.css";
import { useState, useEffect, useRef } from "react";
import SearchSuggestionSkeleton from "../components/Searchsuggestionskeleton ";
import { fetchLocations } from "@/api/location/api";
import { fetchHomeSearchList, fetchKeywordSuggestions } from "@/api/homeSearch/api";
import { buildCountScope, buildMakeCountScope } from "./paramsCountScope";
import { FILTER_PARAM_KEYS } from "@/config/filterDefs";
import {
  SiteFilterButtons, SiteFilterChips, SiteFilterSections,
  useSiteFilterSchema, hasValue, hasOwnButton, pickSiteFilterValues, siteFilterUpdates,
  type SchemaItem,
} from "./SiteFilters";

type KeywordItem = { label: string; url?: string };

type LocationSuggestion = {
  key: string;
  uri: string;
  address: string;
  short_address: string;
  postcode?: string | number;
};

export interface StateOption {
  value: string;
  name: string;
  regions?: { name: string; value: string }[];
}

export interface FilterState {
  make?: string;
  model?: string;
  state?: string;
  region?: string;
  suburb?: string;
  pincode?: string;
  from_price?: string | number;
  to_price?: string | number;
  condition?: string;
  from_year?: string | number;
  to_year?: string | number;
  keyword?: string;
  [key: string]: any;
}

interface Props {
  currentFilters: FilterState;
  onFilterChange: (f: FilterState) => void;
  onClearAll: () => void;
  /** Server-fetched (SSR) state list from /params-product-list. When present,
   * skips the redundant client-side mount fetch of /api/product-list/. */
  initialStates?: StateOption[];
  /** Server-fetched (SSR) make counts, scoped to initialFilters via the same
   * buildMakeCountScope as this component — skips the redundant client-side
   * mount fetch. Any filter change after mount still fetches live. */
  initialMakeCounts?: { name: string; slug: string; count: number }[];
}

/** make/model excluded on purpose (they're what group_by is counting) —
 * see buildMakeCountScope in paramsCountScope.ts (shared with page.tsx's SSR fetch). */
const buildMakeCountParams = (filters: FilterState): URLSearchParams => {
  const params = buildMakeCountScope(filters);
  params.set("group_by", "make");
  return params;
};

export default function StateFilterBar({
  currentFilters, onFilterChange, onClearAll,
  initialStates,
  initialMakeCounts,
}: Props) {
  // One string for every car-site filter value, for effect dependency lists.
  const siteFilterKey = FILTER_PARAM_KEYS.map((k) => String(currentFilters[k] ?? "")).join("|");
  // This site's filter set (body size, fuel, odometer, …) from the cars API.
  const siteSchema = useSiteFilterSchema();

  /* ── Data ── */
  const [states,     setStates]     = useState<StateOption[]>(initialStates ?? []);

  // Guards the make count effect below so it skips its one redundant client
  // refetch on mount (SSR already fetched that exact scope). Must track "is
  // this the effect's first run", NOT "does currentFilters currently match the
  // mount-time filters" — the latter re-triggers the skip whenever the user
  // clears filters back to the same values the page loaded with (e.g. Clear
  // All on the plain /listings/ page), silently discarding a needed refetch
  // and leaving makeCounts stuck on whatever narrower scope was last fetched.
  const makeCountsFirstRunRef = useRef(true);

  useEffect(() => {
    // The state list doesn't depend on currentFilters — safe to skip entirely
    // whenever the server already supplied it. (Makes and models come from
    // the live params-count fetches below.)
    if (initialStates) return;
    fetch("/api/product-list/")
      .then(r => r.ok ? r.json() : null)
      .then((res: any) => { if (res?.data) setStates(res.data.states || []); })
      .catch(() => {});
  }, [initialStates]);

  /* ── Suburb search ── */
  const RADIUS_OPTIONS = [25, 50, 100, 250, 500, 1000] as const;
  const [tempSuburbRadius,         setTempSuburbRadius]         = useState<number>(RADIUS_OPTIONS[0]);
  const [tempSuburbSuggestion,     setTempSuburbSuggestion]     = useState<LocationSuggestion | null>(null);
  const [tempSuburbInput,          setTempSuburbInput]          = useState("");
  const [suburbLocationSuggestions,setSuburbLocationSuggestions]= useState<LocationSuggestion[]>([]);
  const [showSuburbSuggestions,    setShowSuburbSuggestions]    = useState(false);
  const [suburbLocLoading,         setSuburbLocLoading]         = useState(false);
  const suburbReqIdRef    = useRef(0);
  const suburbDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Make / Model ── */
  const [tempMake,      setTempMake]      = useState<string | null>(null);
  const [tempModel,     setTempModel]     = useState<string | null>(null);
  const [makeSearch,    setMakeSearch]    = useState("");
  const [modelSearch,   setModelSearch]   = useState("");
  const [makeSubView,   setMakeSubView]   = useState<"makes" | "models">("makes");
  const [makeCounts,       setMakeCounts]       = useState<{name: string; slug: string; count: number}[]>(initialMakeCounts ?? []);
  const [modelCounts,      setModelCounts]      = useState<{name: string; slug: string; count: number}[]>([]);
  const [stateCounts,      setStateCounts]      = useState<{slug: string; count: number}[]>([]);
  const [regionCountsByState, setRegionCountsByState] = useState<Record<string, {name: string; slug: string; count: number}[]>>({});
  const [modelCountLoading, setModelCountLoading] = useState(false);
  const [lastModelName,    setLastModelName]    = useState<string | null>(null);

  // Old already-indexed URLs (e.g. /listings/apache-caravans-category/) carry
  // the make slug in a discontinued format ("apache-caravans") from before a
  // backend migration dropped the "-caravans"/"-campers" suffix from most make
  // slugs. WP's params-count endpoint only matches the current slug exactly,
  // so an old-format value silently returns empty data. Try the raw value
  // first (covers current URLs, and the handful of makes whose real slug still
  // ends that way), and only fall back to a stripped version if that misses.
  const resolveMakeSlug = (raw: string): string => {
    if (makeCounts.some(m => m.slug === raw)) return raw;
    const stripped = raw.replace(/-(caravans|campers)$/i, "");
    if (stripped !== raw && makeCounts.some(m => m.slug === stripped)) return stripped;
    return raw;
  };

  // Live make counts — same /api/params-count/ endpoint FilterSlider uses,
  // re-fetched whenever any other active filter changes so the make list
  // narrows to what's actually available (not just the full static make list).
  useEffect(() => {
    const isFirstRun = makeCountsFirstRunRef.current;
    makeCountsFirstRunRef.current = false;
    if (initialMakeCounts && isFirstRun) return;
    const controller = new AbortController();
    const params = buildMakeCountParams(currentFilters);
    fetch(`/api/params-count/?${params.toString()}`, { signal: controller.signal })
      .then(r => r.json())
      .then(json => { if (!controller.signal.aborted) setMakeCounts(json.data || []); })
      .catch(e => { if (e.name !== "AbortError") console.error(e); });
    return () => controller.abort();
  }, [
    currentFilters.condition, currentFilters.state, currentFilters.region,
    currentFilters.suburb, currentFilters.pincode, currentFilters.from_price, currentFilters.to_price,
    currentFilters.from_year, currentFilters.to_year,
    currentFilters.keyword, siteFilterKey,
  ]);

  // Live state counts — only used when a make filter is active (e.g. /listings/jayco/).
  // Calls /api/params-count/?make={make}&group_by=state so the state list narrows
  // to only the states that actually have listings for that make.
  useEffect(() => {
    if (!currentFilters.make) { setStateCounts([]); return; }
    const controller = new AbortController();
    // State counts for this make — location is what's being counted, so drop it.
    const params = buildCountScope(
      { ...currentFilters, state: undefined, region: undefined, suburb: undefined, pincode: undefined },
      resolveMakeSlug(currentFilters.make),
    );
    params.set("group_by", "state");
    fetch(`/api/params-count/?${params.toString()}`, { signal: controller.signal })
      .then(r => r.json())
      .then(json => { if (!controller.signal.aborted) setStateCounts(json.data || []); })
      .catch(e => { if (e.name !== "AbortError") console.error(e); });
    return () => controller.abort();
  }, [
    currentFilters.make, currentFilters.condition,
    currentFilters.from_price, currentFilters.to_price,
    currentFilters.from_year, currentFilters.to_year,
    currentFilters.keyword, siteFilterKey,
  ]);

  // After state counts arrive, pre-fetch region counts for every state returned.
  // This fires automatically whenever stateCounts changes (i.e. whenever make or
  // other filters change), so the region dropdown is already populated when the
  // user drills into a state — no extra fetch needed on click.
  useEffect(() => {
    if (!stateCounts.length || !currentFilters.make) {
      setRegionCountsByState({});
      return;
    }
    const controllers: AbortController[] = [];
    stateCounts.forEach((sc) => {
      if (!sc.slug) return;
      const ctrl = new AbortController();
      controllers.push(ctrl);
      const params = buildCountScope(
        { ...currentFilters, state: sc.slug.toLowerCase(), region: undefined, suburb: undefined, pincode: undefined },
        resolveMakeSlug(currentFilters.make!).toLowerCase(),
      );
      params.set("group_by", "region");
      fetch(`/api/params-count/?${params}`, { signal: ctrl.signal })
        .then(r => r.json())
        .then(json => {
          if (!ctrl.signal.aborted) {
            setRegionCountsByState(prev => ({ ...prev, [sc.slug]: json.data ?? [] }));
          }
        })
        .catch(e => { if (e.name !== "AbortError") console.error("[StateFilterBar] region prefetch failed", e); });
    });
    return () => controllers.forEach(c => c.abort());
  }, [stateCounts]);

  // Live model counts — scoped to whichever make is currently selected in the modal.
  useEffect(() => {
    if (!tempMake) { setModelCounts([]); return; }
    const controller = new AbortController();
    setModelCountLoading(true);
    const params = buildMakeCountParams(currentFilters);
    params.set("make", resolveMakeSlug(tempMake));
    params.delete("group_by");
    params.set("group_by", "model");
    fetch(`/api/params-count/?${params.toString()}`, { signal: controller.signal })
      .then(r => r.json())
      .then(json => {
        if (controller.signal.aborted) return;
        const data = json.data || [];
        setModelCounts(data);
        setModelCountLoading(false);
        const matched = data.find((m: any) => m.slug === currentFilters.model);
        if (matched) setLastModelName(matched.name);
      })
      .catch(e => { if (e.name !== "AbortError") { console.error(e); setModelCountLoading(false); } });
    return () => controller.abort();
  }, [tempMake]);

  /* ── Temp filter values ── */
  const [tempState,        setTempState]        = useState<string | null>(null);
  const [tempRegion,       setTempRegion]       = useState<string | null>(null);
  const [tempRegionRaw,    setTempRegionRaw]    = useState<string | null>(null);
  const [tempSiteValues,   setTempSiteValues]   = useState<Record<string, unknown>>({});
  const [tempKeyword,      setTempKeyword]      = useState<string>("");
  const [removingChip,     setRemovingChip]     = useState<string | null>(null);
  const [clearingAll,      setClearingAll]      = useState(false);

  const [locationSubView, setLocationSubView] = useState<"states" | "regions">("states");

  const [openModal, setOpenModal] = useState<"location"|"make"|"allFilters"|null>(null);

  /* ── Active chip → its filter: own toolbar modal if it has one, else the
   * All-filters modal scrolled to that filter's section. ── */
  const [siteFilterRequest, setSiteFilterRequest] = useState<string | null>(null);
  const [allFiltersFocus,   setAllFiltersFocus]   = useState<string | null>(null);
  useEffect(() => {
    if (openModal !== "allFilters" || !allFiltersFocus) return;
    document.querySelector(`.filter-modal [data-filter-field="${allFiltersFocus}"]`)?.scrollIntoView({ block: "start" });
    setAllFiltersFocus(null);
  }, [openModal, allFiltersFocus]);

  /* ── Keyword search suggestions — same /api/home-search/ endpoint the
   * production filter modal uses: base/popular list on focus, live typed
   * suggestions (debounced) once the query is 2+ chars. ── */
  const [showKeywordSuggestions, setShowKeywordSuggestions] = useState(false);
  const [baseKeywords,           setBaseKeywords]           = useState<KeywordItem[]>([]);
  const [baseLoading,            setBaseLoading]            = useState(false);
  const [keywordSuggestions,     setKeywordSuggestions]     = useState<KeywordItem[]>([]);
  const [keywordLoading,         setKeywordLoading]         = useState(false);

  useEffect(() => {
    if (openModal !== "allFilters") return;
    setBaseLoading(true);
    fetchHomeSearchList()
      .then((list) => {
        const items: KeywordItem[] = list.map((x) => ({
          label: (x.name ?? "").trim(),
          url: x.url ?? "",
        })).filter((i) => i.label);
        const uniq = Array.from(new Map(items.map((i) => [i.label, i])).values());
        setBaseKeywords(uniq);
      })
      .catch(() => setBaseKeywords([]))
      .finally(() => setBaseLoading(false));
  }, [openModal]);

  useEffect(() => {
    if (openModal !== "allFilters") return;
    const q = tempKeyword.trim();
    if (q.length < 2) { setKeywordSuggestions([]); setKeywordLoading(false); return; }

    const ctrl = new AbortController();
    setKeywordLoading(true);
    const t = setTimeout(async () => {
      try {
        const list = await fetchKeywordSuggestions(q, ctrl.signal);
        const items: KeywordItem[] = list.map((x) => ({ label: x.keyword.trim(), url: x.url }));
        setKeywordSuggestions(Array.from(new Map(items.map((i) => [i.label, i])).values()));
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setKeywordSuggestions([]);
      } finally {
        setKeywordLoading(false);
      }
    }, 300);

    return () => { ctrl.abort(); clearTimeout(t); };
  }, [tempKeyword, openModal]);

  useEffect(() => {
    document.body.style.overflow = openModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [openModal]);

  useEffect(() => { setRemovingChip(null); }, [currentFilters]);

  /* ── Helpers ── */
  const toTitleCase = (s: string) => s.replace(/\b\w/g, c => c.toUpperCase());

  // WP's model list has no separate display name — `value`/`name` is just the
  // raw slug ("altea-402-ph-sport"). toTitleCase alone only capitalizes each
  // hyphen-segment ("Altea-402-Ph-Sport"); this also swaps hyphens for spaces.
  const formatModelName = (s: string) =>
    s.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  const AUS_ABBR: Record<string, string> = {
    VICTORIA:"VIC","NEW SOUTH WALES":"NSW",QUEENSLAND:"QLD","SOUTH AUSTRALIA":"SA",
    "WESTERN AUSTRALIA":"WA",TASMANIA:"TAS","NORTHERN TERRITORY":"NT","AUSTRALIAN CAPITAL TERRITORY":"ACT",
  };

  const formatLocationInput = (s: string) =>
    s.replace(/_/g," ").replace(/\s*-\s*/g,"  ").replace(/\s{3,}/g,"  ").trim()
     .replace(/\b\w/g, c => c.toUpperCase());

  const formatted = (s: string) => s.replace(/ - /g,"  ").replace(/\s+/g," ");

  // API suggestions return `address` as a hyphenated slug fragment for the state
  // (e.g. "Fyshwick Australian-capital-territory 2609") — clean it into a proper
  // full state name ("Fyshwick Australian Capital Territory 2609") instead of
  // using `short_address`, which abbreviates the state (e.g. "ACT").
  const formatAddressLabel = (s?: string) =>
    s ? s.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : s;

  const getValidRegionName = (stateName: string|null|undefined, regionName: string|null|undefined, allStates: StateOption[]) => {
    if (!stateName || !regionName) return undefined;
    const st = allStates.find(s => s.name.toLowerCase() === stateName.toLowerCase() || s.value.toLowerCase() === stateName.toLowerCase());
    if (!st?.regions?.length) return undefined;
    return st.regions.find(r => r.name.toLowerCase() === regionName.toLowerCase() || r.value.toLowerCase() === regionName.toLowerCase())?.name;
  };

  // All regions for the currently-viewed state from the static list
  const allRegionsForState = states.find(s => s.name.toLowerCase() === tempState?.toLowerCase())?.regions ?? [];
  // When a make is active, narrow to only regions that have listings for that make
  // (using the pre-fetched regionCountsByState data). Falls back to the full list
  // while the prefetch is in-flight or when no make is selected.
  const activeRegionCounts = tempState ? regionCountsByState[tempState.toLowerCase()] : undefined;
  const filteredRegions = (currentFilters.make && activeRegionCounts)
    ? allRegionsForState.filter(r => activeRegionCounts.some(rc => rc.slug === r.value && rc.count > 0))
    : allRegionsForState;

  // When a make filter is active, narrow the state list to only states with
  // count > 0 for that make. Falls back to the full list when no make is set
  // (global /listings/ page) or before the first API response arrives.
  const visibleStates = stateCounts.length > 0
    ? states.filter(s => stateCounts.some(sc => sc.slug === s.value && sc.count > 0))
    : states;

  // Applied state/region first in the Location modal lists, like the make/model lists.
  const isApplied = (o: { name: string; value: string }, applied?: string) =>
    !!applied && (o.name.toLowerCase() === applied.toLowerCase() || o.value.toLowerCase() === applied.toLowerCase());
  const pinFirst = <T,>(list: T[], pinned: (x: T) => boolean): T[] =>
    [...list.filter(pinned), ...list.filter(x => !pinned(x))];
  const locationStates  = pinFirst(visibleStates, s => isApplied(s, currentFilters.state));
  const locationRegions = pinFirst(filteredRegions, r => isApplied(r, currentFilters.region));

  // Moves the applied make/model to the top of its list (only when not searching).
  const pinToTop = <T extends { slug: string }>(list: T[], slug?: string): T[] => {
    const i = slug ? list.findIndex(x => x.slug === slug) : -1;
    return i > 0 ? [list[i], ...list.slice(0, i), ...list.slice(i + 1)] : list;
  };

  const makeSource = [...makeCounts].sort((a, b) => a.name.localeCompare(b.name));
  const filteredMakes = makeSearch
    ? (() => {
        const q = makeSearch.toLowerCase();
        return makeSource
          .filter(m => m.name.toLowerCase().includes(q))
          .sort((a, b) => {
            const an = a.name.toLowerCase(), bn = b.name.toLowerCase();
            const rank = (n: string) => n.startsWith(q) ? 0 : n.includes(` ${q}`) ? 1 : 2;
            return rank(an) - rank(bn) || an.localeCompare(bn);
          });
      })()
    : pinToTop(makeSource, currentFilters.make);
  const modelSource = modelCounts;
  const filteredModels = modelSearch
    ? (() => {
        const q = modelSearch.toLowerCase();
        return modelSource
          .filter(m => m.name.toLowerCase().includes(q))
          .sort((a, b) => {
            const an = a.name.toLowerCase(), bn = b.name.toLowerCase();
            const rank = (n: string) => n.startsWith(q) ? 0 : n.includes(` ${q}`) ? 1 : 2;
            return rank(an) - rank(bn);
          });
      })()
    : pinToTop(modelSource, tempMake === currentFilters.make ? currentFilters.model : undefined);

  /* ── Core update fn ── */
  const updateFiltersAndURL = (updates: Partial<FilterState>) => {
    const merged: FilterState = { ...currentFilters, ...updates };
    Object.keys(merged).forEach(k => { if (merged[k] === undefined || merged[k] === null) delete merged[k]; });
    onFilterChange(merged);
  };

  const removeChip = (key: string, updates: Partial<FilterState>) => {
    setRemovingChip(key);
    updateFiltersAndURL(updates);
  };

  const handleClearAll = () => {
    setClearingAll(true);
    onClearAll();
    setTimeout(() => setClearingAll(false), 300);
  };

  /* ── Make ── */
  // Chips open straight into the model list of the applied make; the Make button opens the make list.
  const handleMakeOpen = (view: "makes" | "models" = "makes") => { setTempMake(currentFilters.make ?? null); setTempModel(currentFilters.model ?? null); setMakeSearch(""); setModelSearch(""); setMakeSubView(view === "models" && currentFilters.make ? "models" : "makes"); setOpenModal("make"); };
  const handleMakeSearch = () => { updateFiltersAndURL({ make: tempMake ?? undefined, model: tempModel ?? undefined }); setOpenModal(null); };
  const handleMakeClear  = () => { setTempMake(null); setTempModel(null); updateFiltersAndURL({ make: undefined, model: undefined }); setOpenModal(null); };
  const handleModelViewOpen = (makeSlug?: string) => {
    const target = makeSlug ?? tempMake;
    if (!target) return;
    if (makeSlug && makeSlug !== tempMake) { setTempMake(makeSlug); setTempModel(null); }
    setModelSearch("");
    setMakeSubView("models");
  };

  /* ── Location ── */
  // State/region chips open straight into the applied state's region list; the Location button opens the state list.
  const handleLocationOpen = (view: "states" | "regions" = "states") => {
    const f = currentFilters;
    const matchedState = states.find(s => s.name?.toLowerCase() === (f.state ?? "").toLowerCase() || s.value?.toLowerCase() === (f.state ?? "").toLowerCase());
    setTempState(matchedState?.name ?? f.state ?? null);
    const matchedRegion = matchedState?.regions?.find(r => r.name?.toLowerCase() === (f.region ?? "").toLowerCase() || r.value?.toLowerCase() === (f.region ?? "").toLowerCase());
    if (matchedRegion) { setTempRegion(matchedRegion.name); setTempRegionRaw(null); }
    else if (f.region) { setTempRegion(null); setTempRegionRaw(f.region); }
    else { setTempRegion(null); setTempRegionRaw(null); }
    if (f.suburb && f.state) {
      const abbr = AUS_ABBR[f.state.toUpperCase()] ?? f.state.toUpperCase();
      const shortAddr = [toTitleCase(f.suburb), abbr, f.pincode].filter(Boolean).join(" ");
      const fullAddr  = [toTitleCase(f.suburb), f.state.replace(/\b\w/g, c => c.toUpperCase()), f.pincode].filter(Boolean).join(" ");
      const stateSlug  = f.state.toLowerCase().replace(/\s+/g,"-") + "-state";
      const regionSlug = f.region ? f.region.toLowerCase().replace(/\s+/g,"-") + "-region" : "unknown-region";
      const suburbSlug = f.suburb.toLowerCase().replace(/\s+/g,"-") + "-suburb";
      const uri = [stateSlug, regionSlug, suburbSlug, f.pincode].filter(Boolean).join("/");
      setTempSuburbSuggestion({ key:"hydrated", uri, address:fullAddr, short_address:shortAddr });
      setTempSuburbInput("");
    } else { setTempSuburbInput(""); setTempSuburbSuggestion(null); }
    setSuburbLocationSuggestions([]);
    setShowSuburbSuggestions(false);
    setTempSuburbRadius(f.radius_kms ? Number(f.radius_kms) : RADIUS_OPTIONS[0]);
    setLocationSubView(view === "regions" && matchedState?.regions?.length ? "regions" : "states");
    setOpenModal("location");
  };
  const handleLocationSearch = () => { updateFiltersAndURL({ state: tempState?.toLowerCase() ?? undefined, region: tempRegion?.toLowerCase() ?? tempRegionRaw?.toLowerCase() ?? undefined, suburb: undefined, pincode: undefined }); setOpenModal(null); };
  const handleLocationClear  = () => { setTempState(null); setTempRegion(null); setTempRegionRaw(null); setTempSuburbInput(""); setTempSuburbSuggestion(null); updateFiltersAndURL({ state:undefined, region:undefined, suburb:undefined, pincode:undefined, radius_kms:undefined }); setOpenModal(null); };
  const handleRegionViewOpen = (stateName?: string) => {
    const target = stateName ?? tempState;
    if (!target) return;
    if (stateName) { setTempState(stateName); if (stateName.toLowerCase() !== (tempState ?? "").toLowerCase()) setTempRegion(null); }
    setLocationSubView("regions");
  };

  /* ── All Filters (combined modal) ── */
  const handleAllFiltersOpen = (focusField?: string) => {
    setAllFiltersFocus(focusField ?? null);
    setTempSiteValues(pickSiteFilterValues(siteSchema, currentFilters));
    setTempMake(currentFilters.make ?? null);
    setTempModel(currentFilters.model ?? null);
    setMakeSearch("");
    setTempKeyword(currentFilters.keyword ?? "");
    if (currentFilters.suburb && currentFilters.state) {
      const abbr = AUS_ABBR[currentFilters.state.toUpperCase()] ?? currentFilters.state.toUpperCase();
      const shortAddr = [toTitleCase(currentFilters.suburb), abbr, currentFilters.pincode].filter(Boolean).join(" ");
      const fullAddr  = [toTitleCase(currentFilters.suburb), currentFilters.state.replace(/\b\w/g, c => c.toUpperCase()), currentFilters.pincode].filter(Boolean).join(" ");
      const stateSlug  = currentFilters.state.toLowerCase().replace(/\s+/g,"-") + "-state";
      const regionSlug = currentFilters.region ? currentFilters.region.toLowerCase().replace(/\s+/g,"-") + "-region" : "unknown-region";
      const suburbSlug = currentFilters.suburb.toLowerCase().replace(/\s+/g,"-") + "-suburb";
      const uri = [stateSlug, regionSlug, suburbSlug, currentFilters.pincode].filter(Boolean).join("/");
      setTempSuburbSuggestion({ key:"hydrated", uri, address:fullAddr, short_address:shortAddr });
      setTempSuburbInput("");
    } else {
      setTempSuburbInput(""); setTempSuburbSuggestion(null);
    }
    setSuburbLocationSuggestions([]); setShowSuburbSuggestions(false);
    setTempSuburbRadius(currentFilters.radius_kms ? Number(currentFilters.radius_kms) : RADIUS_OPTIONS[0]);
    const matchedState = states.find(s => s.name?.toLowerCase() === (currentFilters.state ?? "").toLowerCase() || s.value?.toLowerCase() === (currentFilters.state ?? "").toLowerCase());
    setTempState(matchedState?.name ?? currentFilters.state ?? null);
    const matchedRegion = matchedState?.regions?.find(r => r.name?.toLowerCase() === (currentFilters.region ?? "").toLowerCase() || r.value?.toLowerCase() === (currentFilters.region ?? "").toLowerCase());
    setTempRegion(matchedRegion?.name ?? currentFilters.region ?? null);
    setOpenModal("allFilters");
  };
  const handleAllFiltersSearch = () => {
    let suburbName: string | undefined;
    let pincodeValue: string | undefined;
    let stateOverride: string | undefined;
    let regionOverride: string | undefined;
    if (tempSuburbSuggestion) {
      const parts = tempSuburbSuggestion.uri.split("/").filter(Boolean);
      const suburbPart = parts.find((p: string) => p.endsWith("-suburb"));
      suburbName  = suburbPart?.replace(/-suburb$/, "").replace(/-/g, " ");
      pincodeValue = parts.find((p: string) => /^\d{4}$/.test(p));
      stateOverride  = parts[0]?.replace(/-state$/, "").replace(/-/g, " ");
      regionOverride = parts[1]?.replace(/-region$/, "").replace(/-/g, " ");
    }
    const updates: Partial<FilterState> = {
      ...siteFilterUpdates(siteSchema, tempSiteValues),
      make:              tempMake ?? undefined,
      model:             tempModel ?? undefined,
      state:             (stateOverride ?? tempState)?.toLowerCase() ?? undefined,
      region:            (regionOverride ?? tempRegion)?.toLowerCase() ?? undefined,
      suburb:            suburbName ?? undefined,
      pincode:           pincodeValue ?? undefined,
      // Omit radius_kms for the default 25km so it doesn't clutter the URL
      // with a redundant "?radius_kms=25" — only a non-default radius needs it.
      radius_kms:        (suburbName && tempSuburbRadius !== RADIUS_OPTIONS[0]) ? tempSuburbRadius : undefined,
      keyword:           tempKeyword || undefined,
    };
    updateFiltersAndURL(updates);
    setOpenModal(null);
  };
  const handleAllFiltersClear = () => { onClearAll(); setOpenModal(null); };

  const handleSiteChipOpen = (item: SchemaItem) => {
    if (hasOwnButton(item)) setSiteFilterRequest(item.field);
    else handleAllFiltersOpen(item.field);
  };

  /* ── Active filter count (for Filters badge) ── */
  const activeSiteFilterCount = siteSchema.filter(item => hasValue(item, currentFilters)).length;
  const activeFilterCount = [
    currentFilters.state || currentFilters.region || currentFilters.suburb,
    currentFilters.make,
  ].filter(Boolean).length + activeSiteFilterCount;

  const hasLocationChange =
    (tempState?.toLowerCase() ?? null) !== (currentFilters.state?.toLowerCase() ?? null) ||
    (tempRegion?.toLowerCase() ?? null) !== (currentFilters.region?.toLowerCase() ?? null);

  /* ── Close button ── */
  const closeBtn = (
    <button className="filter-close" onClick={() => setOpenModal(null)}>
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 64 64">
        <path d="M 16 14 C 15.488 14 14.976938 14.194937 14.585938 14.585938 C 13.804937 15.366937 13.804937 16.633063 14.585938 17.414062 L 29.171875 32 L 14.585938 46.585938 C 13.804938 47.366938 13.804937 48.633063 14.585938 49.414062 C 14.976937 49.805062 15.488 50 16 50 C 16.512 50 17.023062 49.805062 17.414062 49.414062 L 32 34.828125 L 46.585938 49.414062 C 47.366938 50.195063 48.633063 50.195062 49.414062 49.414062 C 50.195063 48.633062 50.195062 47.366937 49.414062 46.585938 L 34.828125 32 L 49.414062 17.414062 C 50.195063 16.633063 50.195062 15.366938 49.414062 14.585938 C 48.633062 13.804938 47.366937 13.804938 46.585938 14.585938 L 32 29.171875 L 17.414062 14.585938 C 17.023062 14.194938 16.512 14 16 14 z"></path>
      </svg>
    </button>
  );

  return (
    <>
      {/* ── Filter bar ── */}
      <div className="lsd-filter-section">
        <div className="container">
          <div className="search-bar">
            {/* Filters button — matches /listings/ design */}
            <button className="filter-btn" onClick={() => handleAllFiltersOpen()}>
              {activeFilterCount > 0 ? (
                <span>{activeFilterCount}</span>
              ) : (
                <span><i className="bi bi-filter" /></span>
              )}{" "}
              Filters
            </button>

            {/* Pills */}
            <div className="filter-row" style={{ flex: 1, marginBottom: 0 }}>
              <div className="slider-wrapper">
                <div className="filter-swiper">
                  <button className={`tag${(currentFilters.state || currentFilters.region || currentFilters.suburb) ? " active" : ""}`} onClick={() => handleLocationOpen()}>
                    Location
                    {(currentFilters.state || currentFilters.region || currentFilters.suburb) && <span className="active_filter"><i className="bi bi-circle-fill" /></span>}
                  </button>

                  <button className={`tag${currentFilters.make ? " active" : ""}`} onClick={() => handleMakeOpen()}>
                    Make, Model
                    {currentFilters.make && <span className="active_filter"><i className="bi bi-circle-fill" /></span>}
                  </button>

                  {/* The rest of this site's filter set, in the API's order */}
                  <SiteFilterButtons filters={currentFilters} onApply={updateFiltersAndURL}
                    openRequest={siteFilterRequest} onOpenRequestHandled={() => setSiteFilterRequest(null)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Active chips row ── */}
      {(currentFilters.state || currentFilters.region || currentFilters.suburb ||
        currentFilters.make || currentFilters.model || currentFilters.keyword ||
        activeSiteFilterCount > 0) && (
        <div className="container">
          <div className="active-chips-row">
            {currentFilters.make && (
              <span className={`active-chip${removingChip === "make" ? " chip-removing" : ""}`}>
                <span className="chip-label" onClick={() => handleMakeOpen("models")}>
                  {toTitleCase(
                    makeCounts.find(m => m.slug === currentFilters.make)?.name ??
                      currentFilters.make,
                  )}
                </span>
                <span className="chip-close" onClick={() => removeChip("make", { make: undefined, model: undefined })}>×</span>
              </span>
            )}
            {currentFilters.model && (
              <span className={`active-chip${removingChip === "model" ? " chip-removing" : ""}`}>
                <span className="chip-label" onClick={() => handleMakeOpen("models")}>
                  {formatModelName(
                    lastModelName ??
                      modelCounts.find(m => m.slug === currentFilters.model)?.name ??
                      currentFilters.model,
                  )}
                </span>
                <span className="chip-close" onClick={() => removeChip("model", { model: undefined })}>×</span>
              </span>
            )}
            {currentFilters.state && (
              <span className={`active-chip${removingChip === "state" ? " chip-removing" : ""}`}>
                <span className="chip-label" onClick={() => handleLocationOpen("regions")}>{toTitleCase(currentFilters.state)}</span>
                <span className="chip-close" onClick={() => removeChip("state", { state:undefined, region:undefined, suburb:undefined, pincode:undefined, radius_kms:undefined })}>×</span>
              </span>
            )}
            {currentFilters.region && (
              <span className={`active-chip${removingChip === "region" ? " chip-removing" : ""}`}>
                <span className="chip-label" onClick={() => handleLocationOpen("regions")}>{toTitleCase(currentFilters.region)}</span>
                <span className="chip-close" onClick={() => removeChip("region", { region:undefined, suburb:undefined, pincode:undefined, radius_kms:undefined })}>×</span>
              </span>
            )}
            {currentFilters.suburb && (
              <span className={`active-chip${removingChip === "suburb" ? " chip-removing" : ""}`}>
                <span className="chip-label" onClick={() => handleLocationOpen()}>{toTitleCase(currentFilters.suburb)}</span>
                <span className="chip-close" onClick={() => removeChip("suburb", { suburb:undefined, pincode:undefined, radius_kms:undefined })}>×</span>
              </span>
            )}
            <SiteFilterChips filters={currentFilters} onRemove={updateFiltersAndURL} onOpen={handleSiteChipOpen} />
            {currentFilters.keyword && (
              <span className={`active-chip${removingChip === "keyword" ? " chip-removing" : ""}`}>
                <span className="chip-label" onClick={() => handleAllFiltersOpen()}>
                  {toTitleCase(currentFilters.keyword)}
                </span>
                <span className="chip-close" onClick={() => removeChip("keyword", { keyword: undefined })}>×</span>
              </span>
            )}
            <button className="chip-clear-all" disabled={clearingAll} onClick={handleClearAll}>
              {clearingAll ? "Clearing…" : "Clear all"}
            </button>
          </div>
        </div>
      )}

      {/* ── All Filters Combined Modal ── */}
      {openModal === "allFilters" && (
        <div className="filter-overlay">
          <div className="filter-modal">
            <div className="filter-header"><h3>Filters</h3>{closeBtn}</div>
            <div className="filter-body">

              {/* Location */}
              <div className="filter-item pt-0">
                <h4>Location</h4>
                <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                  <div style={{ flex:1, minWidth:130 }}>
                    <label style={{ fontSize:13, color:"#555", display:"block", marginBottom:6 }}>State</label>
                    <select className="cfs-select-input form-select" value={tempState ?? ""}
                      onChange={e => { setTempState(e.target.value || null); setTempRegion(null); }}>
                      <option value="">Any</option>
                      {visibleStates.map(s => (
                        <option key={s.value} value={s.name}>
                          {AUS_ABBR[s.name.toUpperCase()] ?? s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex:1, minWidth:130 }}>
                    <label style={{ fontSize:13, color:"#555", display:"block", marginBottom:6 }}>Region</label>
                    <select className="cfs-select-input form-select"
                      disabled={!tempState || filteredRegions.length === 0}
                      value={tempRegion ?? ""}
                      onChange={e => setTempRegion(e.target.value || null)}>
                      <option value="">Any</option>
                      {filteredRegions.map(r => (
                        <option key={r.value} value={r.name}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Suburb / Postcode */}
              <div className="filter-item">
                <h4>Suburb/Postcode</h4>
                <div style={{ position:"relative" }}>
                  <div className="loc-search-wrap">
                    <i className="bi bi-search loc-search-icon" />
                    <input
                      className="loc-search-input"
                      placeholder="Search suburb, postcode, state, region"
                      value={tempSuburbSuggestion && !tempSuburbInput ? formatAddressLabel(tempSuburbSuggestion.address) : formatted(tempSuburbInput)}
                      onFocus={() => { if (!tempSuburbSuggestion) setShowSuburbSuggestions(true); }}
                      onChange={e => {
                        setShowSuburbSuggestions(true);
                        setTempSuburbSuggestion(null);
                        const raw = e.target.value;
                        setTempSuburbInput(raw);
                        const fmt = /^\d+$/.test(raw) ? raw : formatLocationInput(raw);
                        if (fmt.length < 1) { setSuburbLocationSuggestions([]); return; }
                        if (suburbDebounceRef.current) clearTimeout(suburbDebounceRef.current);
                        suburbDebounceRef.current = setTimeout(() => {
                          const rid = ++suburbReqIdRef.current;
                          setSuburbLocLoading(true);
                          fetchLocations(fmt.split(" ")[0]).then((data: any) => {
                            if (rid !== suburbReqIdRef.current) return;
                            const sv = fmt.toLowerCase();
                            setSuburbLocationSuggestions(data.filter((x: any) =>
                              x.short_address?.toLowerCase().includes(sv) ||
                              x.address?.toLowerCase().includes(sv) ||
                              (x.postcode && x.postcode.toString().includes(sv))
                            ));
                            setSuburbLocLoading(false);
                          }).catch(() => setSuburbLocLoading(false));
                        }, 300);
                      }}
                      onBlur={() => setTimeout(() => setShowSuburbSuggestions(false), 150)}
                    />
                    {tempSuburbSuggestion && (
                      <button type="button"
                        style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#888", fontSize:20, lineHeight:1 }}
                        onMouseDown={e => { e.preventDefault(); setTempSuburbSuggestion(null); setTempSuburbInput(""); }}>×</button>
                    )}
                  </div>
                  {showSuburbSuggestions && suburbLocLoading && tempSuburbInput && (
                    <ul className="location-suggestions">
                      {[1,2,3].map(i => <li key={i} className="suggestion-skeleton"><div className="skeleton-line" /></li>)}
                    </ul>
                  )}
                  {showSuburbSuggestions && !suburbLocLoading && tempSuburbInput && suburbLocationSuggestions.length === 0 && (
                    <p style={{ fontSize:13, color:"#888", margin:0, paddingLeft:4 }}>No results found</p>
                  )}
                  {showSuburbSuggestions && !suburbLocLoading && suburbLocationSuggestions.length > 0 && (
                    <ul className="location-suggestions">
                      {suburbLocationSuggestions.map((item: any, idx: number) => (
                        <li key={idx}
                          className={`suggestion-item${tempSuburbSuggestion?.short_address === item.short_address ? " selected" : ""}`}
                          onMouseDown={e => {
                            e.preventDefault();
                            setTempSuburbSuggestion(item);
                            setTempSuburbInput("");
                            setSuburbLocationSuggestions([]);
                            setShowSuburbSuggestions(false);
                          }}
                        >{formatAddressLabel(item.address)}</li>
                      ))}
                    </ul>
                  )}
                  {tempSuburbSuggestion && tempSuburbSuggestion.uri.split("/").filter(Boolean).length >= 3 && (
                    <div style={{ marginTop:14 }}>
                      <div className="cfs-radius-label">Search surrounding area</div>
                      <div className="cfs-radius-wrap">
                        {(() => {
                          const idx = Math.max(0, RADIUS_OPTIONS.indexOf(tempSuburbRadius as (typeof RADIUS_OPTIONS)[number]));
                          const pct = (idx / (RADIUS_OPTIONS.length - 1)) * 100;
                          return (
                            <>
                              <div className="cfs-radius-tooltip" style={{ left:`calc(${pct}% + ${18 - 0.36*pct}px)` }}>{tempSuburbRadius}km</div>
                              <div className="cfs-radius-track-wrap">
                                <input type="range" className="cfs-radius-slider" min={0} max={RADIUS_OPTIONS.length-1} step={1} value={idx}
                                  style={{ background:`linear-gradient(to right,var(--brand) 0%,var(--brand) ${pct}%,#ddd ${pct}%,#ddd 100%)` }}
                                  onChange={e => setTempSuburbRadius(RADIUS_OPTIONS[parseInt(e.target.value,10)])} aria-label="Search radius" />
                                {RADIUS_OPTIONS.map((km,i) => {
                                  const tp = (i/(RADIUS_OPTIONS.length-1))*100;
                                  return <span key={i} className={`cfs-radius-tick${i<idx?" active":i===idx?" current":""}`} style={{ left:`calc(${tp}% + ${9-0.18*tp}px)` }} title={`${km}km`} />;
                                })}
                              </div>
                              <div className="cfs-radius-range"><span>{RADIUS_OPTIONS[0]}km</span><span>{RADIUS_OPTIONS[RADIUS_OPTIONS.length-1].toLocaleString()}km</span></div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Make & Model */}
              <div className="filter-item">
                <h4>Make &amp; Model</h4>
                <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                  <div style={{ flex:1, minWidth:130 }}>
                    <label style={{ fontSize:13, color:"#555", display:"block", marginBottom:6 }}>Make</label>
                    <select className="cfs-select-input form-select" value={tempMake ?? ""}
                      onChange={e => { setTempMake(e.target.value || null); setTempModel(null); }}>
                      <option value="">Any</option>
                      {makeSource.map(m => <option key={m.slug} value={m.slug}>{m.name}</option>)}
                    </select>
                  </div>
                  <div style={{ flex:1, minWidth:130 }}>
                    <label style={{ fontSize:13, color:"#555", display:"block", marginBottom:6 }}>Model</label>
                    <select className="cfs-select-input form-select"
                      disabled={!tempMake || modelSource.length === 0}
                      value={tempModel ?? ""}
                      onChange={e => setTempModel(e.target.value || null)}>
                      <option value="">Any</option>
                      {modelSource.map(mod => (
                        <option key={mod.slug} value={mod.slug}>{formatModelName(mod.name)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* This site's filter set (body size, price, year, condition, odometer, …) */}
              <SiteFilterSections filters={currentFilters} values={tempSiteValues}
                onChange={(patch) => setTempSiteValues((v) => ({ ...v, ...patch }))} />

              {/* Keyword — temporarily hidden, re-enable by flipping this to true */}
              {false && (
              <div className="filter-item">
                <h4>Search by Keyword</h4>
                <div style={{ position:"relative" }}>
                  <div className="loc-search-wrap">
                    <i className="bi bi-search loc-search-icon" />
                    <input
                      className="loc-search-input"
                      placeholder="e.g. ensuite, solar, slide-out..."
                      autoComplete="off"
                      value={tempKeyword}
                      onFocus={() => setShowKeywordSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowKeywordSuggestions(false), 200)}
                      onChange={e => setTempKeyword(e.target.value)}
                    />
                  </div>

                  {showKeywordSuggestions && tempKeyword.trim().length < 2 && (
                    baseLoading ? (
                      <div className="location-suggestions"><SearchSuggestionSkeleton count={4} label="Popular searches" /></div>
                    ) : baseKeywords.length > 0 ? (
                      <ul className="location-suggestions">
                        {baseKeywords.map((item, idx) => (
                          <li key={`${item.label}-${idx}`} className="suggestion-item"
                            onMouseDown={e => { e.preventDefault(); setTempKeyword(item.label); setShowKeywordSuggestions(false); }}
                          >{item.label}</li>
                        ))}
                      </ul>
                    ) : null
                  )}

                  {showKeywordSuggestions && tempKeyword.trim().length >= 2 && (
                    keywordLoading ? (
                      <div className="location-suggestions"><SearchSuggestionSkeleton count={4} label="Suggested searches" /></div>
                    ) : keywordSuggestions.length > 0 ? (
                      <ul className="location-suggestions">
                        {keywordSuggestions.map((item, idx) => (
                          <li key={`${item.label}-${idx}`} className="suggestion-item"
                            onMouseDown={e => { e.preventDefault(); setTempKeyword(item.label); setShowKeywordSuggestions(false); }}
                          >{item.label}</li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ fontSize:13, color:"#888", margin:0, paddingLeft:4 }}>No results found</p>
                    )
                  )}
                </div>
              </div>
              )}

            </div>
            <div className="filter-footer">
              <button className="clear" onClick={handleAllFiltersClear}>Clear filters</button>
              <button className="search active" onClick={handleAllFiltersSearch}>Search</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Location Modal ── */}
      {openModal === "location" && (
        <div className="filter-overlay">
          <div className="filter-modal">
            <div className="filter-header" style={{ position:"relative" }}>
              {locationSubView === "regions" ? (
                <>
                  <button className="loc-back-btn" onClick={() => setLocationSubView("states")}>
                    <i className="bi bi-chevron-left" /> Location
                  </button>
                  <h3 style={{ position:"absolute", left:"50%", transform:"translateX(-50%)", margin:0 }}>Region</h3>
                </>
              ) : (
                <h3>Location</h3>
              )}
              {closeBtn}
            </div>
            <div className="filter-body">
              {locationSubView === "states" ? (
                <>
                  {/* Suburb search */}
                  <div className="loc-search-wrap">
                    <div style={{ position:"relative" }}>
                      <i className="bi bi-search loc-search-icon" />
                      <input
                        type="text" className="loc-search-input" autoComplete="off"
                        placeholder="Search suburb, postcode, state, region"
                        value={formatted(tempSuburbInput)}
                        onFocus={() => setShowSuburbSuggestions(true)}
                        onChange={e => {
                          setShowSuburbSuggestions(true);
                          setTempSuburbSuggestion(null);
                          const raw = e.target.value;
                          setTempSuburbInput(raw);
                          const fmt = /^\d+$/.test(raw) ? raw : formatLocationInput(raw);
                          if (fmt.length < 1) { setSuburbLocationSuggestions([]); return; }
                          if (suburbDebounceRef.current) clearTimeout(suburbDebounceRef.current);
                          suburbDebounceRef.current = setTimeout(() => {
                            const rid = ++suburbReqIdRef.current;
                            setSuburbLocLoading(true);
                            fetchLocations(fmt.split(" ")[0]).then((data: any) => {
                              if (rid !== suburbReqIdRef.current) return;
                              const sv = fmt.toLowerCase();
                              setSuburbLocationSuggestions(data.filter((x: any) =>
                                x.short_address?.toLowerCase().includes(sv) ||
                                x.address?.toLowerCase().includes(sv) ||
                                (x.postcode && x.postcode.toString().includes(sv))
                              ));
                              setSuburbLocLoading(false);
                            }).catch(() => setSuburbLocLoading(false));
                          }, 300);
                        }}
                        onBlur={() => setTimeout(() => setShowSuburbSuggestions(false), 150)}
                      />
                    </div>
                    {showSuburbSuggestions && suburbLocLoading && tempSuburbInput && (
                      <ul className="location-suggestions">
                        {[1,2,3].map(i => <li key={i} className="suggestion-skeleton"><div className="skeleton-line" /></li>)}
                      </ul>
                    )}
                    {showSuburbSuggestions && !suburbLocLoading && tempSuburbInput && suburbLocationSuggestions.length === 0 && (
                      <p className="suggestions-no-results" style={{ paddingLeft:12 }}>No results found</p>
                    )}
                    {showSuburbSuggestions && !suburbLocLoading && suburbLocationSuggestions.length > 0 && (
                      <ul className="location-suggestions">
                        {suburbLocationSuggestions.map((item: any, idx: number) => (
                          <li key={idx}
                            className={`suggestion-item${tempSuburbSuggestion?.short_address === item.short_address ? " selected" : ""}`}
                            onMouseDown={e => {
                              e.preventDefault();
                              setTempSuburbSuggestion(item);
                              setTempSuburbInput("");
                              setSuburbLocationSuggestions([]);
                              setShowSuburbSuggestions(false);
                            }}
                          >{formatAddressLabel(item.address)}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Selected suburb chip + radius */}
                  {tempSuburbSuggestion && !tempSuburbInput && (
                    <div style={{ marginBottom:12 }}>
                      <div className="filter-chip">
                        <span>{formatAddressLabel(tempSuburbSuggestion.address)}</span>
                        <button type="button" className="filter-chip-close" onMouseDown={e => { e.preventDefault(); setTempSuburbSuggestion(null); setTempSuburbInput(""); }} aria-label="Remove location">×</button>
                      </div>
                      {tempSuburbSuggestion.uri.split("/").filter(Boolean).length >= 3 && (
                        <div style={{ marginTop:14 }}>
                          <div className="cfs-radius-label">Search surrounding area</div>
                          <div className="cfs-radius-wrap">
                            {(() => {
                              const idx = Math.max(0, RADIUS_OPTIONS.indexOf(tempSuburbRadius as (typeof RADIUS_OPTIONS)[number]));
                              const pct = (idx / (RADIUS_OPTIONS.length - 1)) * 100;
                              return (
                                <>
                                  <div className="cfs-radius-tooltip" style={{ left:`calc(${pct}% + ${18 - 0.36*pct}px)` }}>{tempSuburbRadius}km</div>
                                  <div className="cfs-radius-track-wrap">
                                    <input type="range" className="cfs-radius-slider" min={0} max={RADIUS_OPTIONS.length-1} step={1} value={idx}
                                      style={{ background:`linear-gradient(to right,var(--brand) 0%,var(--brand) ${pct}%,#ddd ${pct}%,#ddd 100%)` }}
                                      onChange={e => setTempSuburbRadius(RADIUS_OPTIONS[parseInt(e.target.value,10)])} aria-label="Search radius" />
                                    {RADIUS_OPTIONS.map((km,i) => {
                                      const tp = (i/(RADIUS_OPTIONS.length-1))*100;
                                      return <span key={i} className={`cfs-radius-tick${i<idx?" active":i===idx?" current":""}`} style={{ left:`calc(${tp}% + ${9-0.18*tp}px)` }} title={`${km}km`} />;
                                    })}
                                  </div>
                                  <div className="cfs-radius-range"><span>{RADIUS_OPTIONS[0]}km</span><span>{RADIUS_OPTIONS[RADIUS_OPTIONS.length-1].toLocaleString()}km</span></div>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* State list */}
                  <ul className="loc-state-list" style={{ display: tempSuburbSuggestion ? "none" : undefined }}>
                    {locationStates.map(s => {
                      const abbr = AUS_ABBR[s.name.toUpperCase()] ?? s.name.substring(0,3).toUpperCase();
                      const isSelected = tempState?.toLowerCase() === s.name.toLowerCase();
                      return (
                        <li key={s.name} className={`loc-state-item${isSelected ? " selected" : ""}`} onClick={() => { setTempState(isSelected ? null : s.name); setTempRegion(null); }}>
                          <span className={`loc-checkbox${isSelected ? " checked" : ""}`}>
                            {isSelected && <i className="bi bi-check" style={{ color:"#fff", fontSize:14, lineHeight:1 }} />}
                          </span>
                          <span className="loc-state-name">{abbr}</span>
                          {isSelected ? (
                            <button className="loc-region-pill" onClick={e => { e.stopPropagation(); handleRegionViewOpen(s.name); }}>
                              Region <i className="bi bi-chevron-right" />
                            </button>
                          ) : (
                            <button className="loc-arrow-btn" onClick={e => { e.stopPropagation(); handleRegionViewOpen(s.name); }} aria-label={`View regions in ${abbr}`}>
                              <i className="bi bi-chevron-right" />
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : (
                <>
                  <div className="loc-region-heading">Region of {tempState}</div>
                  <ul className="loc-state-list">
                    {locationRegions.map(r => {
                      const isSelected = tempRegion?.toLowerCase() === r.name.toLowerCase();
                      return (
                        // Picking a region replaces an applied suburb (Search would otherwise re-apply the suburb).
                        <li key={r.name} className={`loc-state-item${isSelected ? " selected" : ""}`} onClick={() => { setTempRegion(isSelected ? null : r.name); setTempRegionRaw(null); setTempSuburbSuggestion(null); }}>
                          <span className={`loc-checkbox${isSelected ? " checked" : ""}`}>
                            {isSelected && <i className="bi bi-check" style={{ color:"#fff", fontSize:14, lineHeight:1 }} />}
                          </span>
                          <span className="loc-state-name">{r.name}</span>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </div>
            <div className="filter-footer">
              <button className="clear" onClick={handleLocationClear} style={{ opacity:(tempState||currentFilters.suburb)?1:0.4, cursor:(tempState||currentFilters.suburb)?"pointer":"not-allowed" }}>Clear</button>
              <button className={`search${(hasLocationChange||tempSuburbSuggestion)?" active":""}`}
                onClick={() => {
                  if (tempSuburbSuggestion) {
                    const parts = tempSuburbSuggestion.uri.split("/").filter(Boolean);
                    const stateSlug  = parts[0]||"";
                    const regionSlug = parts[1]||"";
                    const suburbSlug = parts[2]||"";
                    let   pincode    = parts[3]||"";
                    const state  = stateSlug.replace(/-state$/,"").replace(/-/g," ").trim();
                    const region = regionSlug.replace(/-region$/,"").replace(/-/g," ").trim();
                    const spMatch = suburbSlug.match(/^([a-z0-9-]+)-(\d{4})-suburb$/i);
                    let suburb: string;
                    if (spMatch) { suburb = spMatch[1].replace(/-/g," ").trim(); if (!pincode) pincode = spMatch[2]; }
                    else { suburb = suburbSlug.replace(/-suburb$/,"").replace(/-/g," ").trim(); }
                    if (!/^\d{4}$/.test(pincode)) { const m = tempSuburbSuggestion.address.match(/\b\d{4}\b/); if (m) pincode = m[0]; }
                    const validRegion = getValidRegionName(state, region, states);
                    updateFiltersAndURL({ suburb:suburb.toLowerCase(), pincode:pincode||undefined, state, region:validRegion||region, radius_kms: tempSuburbRadius !== RADIUS_OPTIONS[0] ? tempSuburbRadius : undefined });
                  } else {
                    handleLocationSearch();
                  }
                  setOpenModal(null);
                }}
              >Search</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Make & Model Modal ── */}
      {openModal === "make" && (
        <div className="filter-overlay">
          <div className="filter-modal">
            <div className="filter-header" style={{ position:"relative" }}>
              {makeSubView === "models" ? (
                <>
                  <button className="loc-back-btn" onClick={() => setMakeSubView("makes")}><i className="bi bi-chevron-left" /> Make</button>
                  <h3 style={{ position:"absolute", left:"50%", transform:"translateX(-50%)", margin:0 }}>Model</h3>
                </>
              ) : <h3>Make &amp; Model</h3>}
              {closeBtn}
            </div>
            <div className="filter-search-bar">
              {makeSubView === "models" && (
                <div className="loc-region-heading" style={{ marginBottom:8, borderBottom:"none", paddingBottom:0 }}>
                  {makeSource.find(m => m.slug === tempMake)?.name ?? tempMake}
                </div>
              )}
              <div className="loc-search-wrap" style={{ marginBottom:0 }}>
                <i className="bi bi-search loc-search-icon" />
                <input className="loc-search-input" type="text"
                  placeholder={makeSubView === "makes" ? "Search make" : "Search model"}
                  value={makeSubView === "makes" ? makeSearch : modelSearch}
                  onChange={e => makeSubView === "makes" ? setMakeSearch(e.target.value) : setModelSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="filter-body">
              {makeSubView === "makes" ? (
                <ul className="loc-state-list">
                  {filteredMakes.map(m => {
                    const isSelected = tempMake === m.slug;
                    return (
                      <li key={m.slug} className={`loc-state-item${isSelected ? " selected" : ""}`}
                        onClick={() => { if (isSelected) { setTempMake(null); setTempModel(null); } else { setTempMake(m.slug); setTempModel(null); } }}>
                        <span className={`loc-checkbox${isSelected ? " checked" : ""}`}>
                          {isSelected && <i className="bi bi-check" style={{ color:"#fff", fontSize:14, lineHeight:1 }} />}
                        </span>
                        <span className="loc-state-name">{m.name}</span>
                        {isSelected ? (
                          <button className="loc-region-pill" onClick={e => { e.stopPropagation(); handleModelViewOpen(m.slug); }}>Model <i className="bi bi-chevron-right" /></button>
                        ) : (
                          <button className="loc-arrow-btn" onClick={e => { e.stopPropagation(); setTempMake(m.slug); setTempModel(null); handleModelViewOpen(m.slug); }} aria-label={`View models for ${m.name}`}><i className="bi bi-chevron-right" /></button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <ul className="loc-state-list">
                  {modelCountLoading ? (
                    <li className="loc-state-item" style={{ justifyContent:"center", color:"#888" }}>Loading...</li>
                  ) : filteredModels.length === 0 ? (
                    <li className="loc-state-item" style={{ color:"#888" }}>No models found</li>
                  ) : (
                    filteredModels.map(mod => {
                      const isSelected = tempModel === mod.slug;
                      return (
                        <li key={mod.slug} className={`loc-state-item${isSelected ? " selected" : ""}`} onClick={() => setTempModel(isSelected ? null : mod.slug)}>
                          <span className={`loc-checkbox${isSelected ? " checked" : ""}`}>
                            {isSelected && <i className="bi bi-check" style={{ color:"#fff", fontSize:14, lineHeight:1 }} />}
                          </span>
                          <span className="loc-state-name">{formatModelName(mod.name || mod.slug)}</span>
                        </li>
                      );
                    })
                  )}
                </ul>
              )}
            </div>
            <div className="filter-footer">
              <button className="clear" onClick={handleMakeClear} style={{ opacity:tempMake?1:0.4, cursor:tempMake?"pointer":"not-allowed" }}>Clear filters</button>
              <button className={`search${tempMake?" active":""}`} onClick={handleMakeSearch}>Search</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
