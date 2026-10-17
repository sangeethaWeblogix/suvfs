"use client";
// TEMPORARY: fills odometer / transmission / fuel_type / seats for listing
// cards while the /pool API does not return them. Cards calling this within
// 50ms are batched into a single /api/listing-specs request. Remove once
// /pool includes these fields.
import { useEffect, useState } from "react";

export type ListingSpecs = { odometer?: string; transmission?: string; fuel_type?: string; seats?: string };

const BATCH_MS = 50;
const MAX_PER_REQUEST = 30;

const cache = new Map<string, ListingSpecs | null>();
const waiters = new Map<string, Array<(s: ListingSpecs | null) => void>>();
let queue = new Set<string>();
let timer: ReturnType<typeof setTimeout> | null = null;

function flush() {
  const slugs = [...queue];
  queue = new Set();
  timer = null;
  for (let i = 0; i < slugs.length; i += MAX_PER_REQUEST) {
    const chunk = slugs.slice(i, i + MAX_PER_REQUEST);
    fetch(`/api/listing-specs/?slugs=${chunk.map(encodeURIComponent).join(",")}`)
      .then((r) => (r.ok ? r.json() : { specs: {} }))
      .catch(() => ({ specs: {} }))
      .then((json) => {
        for (const slug of chunk) {
          const specs: ListingSpecs | null = json?.specs?.[slug] ?? null;
          cache.set(slug, specs);
          waiters.get(slug)?.forEach((cb) => cb(specs));
          waiters.delete(slug);
        }
      });
  }
}

function request(slug: string, cb: (s: ListingSpecs | null) => void) {
  if (cache.has(slug)) { cb(cache.get(slug) ?? null); return; }
  const pending = waiters.get(slug);
  if (pending) { pending.push(cb); return; }
  waiters.set(slug, [cb]);
  queue.add(slug);
  if (!timer) timer = setTimeout(flush, BATCH_MS);
}

/** Returns the card specs for `slug`, fetched only when the listing itself has none. */
export function useListingSpecs(slug: string | undefined, hasSpecs: boolean): ListingSpecs | null {
  const [specs, setSpecs] = useState<ListingSpecs | null>(() => (slug ? cache.get(slug) ?? null : null));
  useEffect(() => {
    if (!slug || hasSpecs) return;
    let alive = true;
    request(slug, (s) => { if (alive) setSpecs(s); });
    return () => { alive = false; };
  }, [slug, hasSpecs]);
  return specs;
}
