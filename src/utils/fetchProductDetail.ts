import { cache } from "react";

function toTitleCase(slug: string): string {
  return slug.split(/[-_]/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function normalizeMpnProduct(raw: any) {
  const toRegion = (val: string) =>
    val ? { value: val, slug: val.toLowerCase().replace(/\s+/g, "-"), label: val } : undefined;

  // Plain values -> display text; objects (e.g. make { name, slug }) are kept for link building.
  const text = (v: any) =>
    v == null || v === "" ? null : typeof v === "boolean" ? (v ? "Yes" : "No") : typeof v === "object" ? v : String(v);

  // Every vehicle spec the API sends (SKU, dealer, suburb and postcode intentionally left out).
  // Rows with no value are dropped, so each listing shows only what it has.
  const specs = [
    { label: "Make",                     value: text(raw.make) },
    { label: "Model",                    value: text(raw.model) },
    { label: "Years",                    value: text(raw.year) },
    { label: "Conditions",               value: text(raw.condition) },
    { label: "Variant",                  value: text(raw.variant) },
    { label: "Series",                   value: text(raw.series) },
    { label: "Body Type",                value: text(raw.body_type) },
    { label: "Body Size",                value: text(raw.body_size) },
    { label: "Seats",                    value: text(raw.seats) },
    { label: "Doors",                    value: text(raw.doors) },
    { label: "Colour",                   value: text(raw.colour) },
    { label: "Odometer",                 value: text(raw.odometer) },
    { label: "Engine Capacity",          value: text(raw.engine_capacity) },
    { label: "Engine Power",             value: text(raw.engine_power) },
    { label: "Engine Make",              value: text(raw.engine_make) },
    { label: "Cylinders",                value: text(raw.cylinders) },
    { label: "Fuel Type",                value: text(raw.fuel_type) },
    { label: "Fuel Consumption",         value: text(raw.fuel_consumption) },
    { label: "Transmission",             value: text(raw.transmission) },
    { label: "Drive Type",               value: text(raw.drive_type) },
    { label: "Drivetrain",               value: text(raw.drivetrain) },
    { label: "Suspension",               value: text(raw.suspension) },
    { label: "Brakes",                   value: text(raw.brakes) },
    { label: "Tyre Size",                value: text(raw.tyre_size) },
    { label: "Length",                   value: text(raw.length) },
    { label: "Width",                    value: text(raw.width) },
    { label: "Height",                   value: text(raw.height) },
    { label: "Wheelbase",                value: text(raw.wheelbase) },
    { label: "Roof Height",              value: text(raw.roof_height) },
    { label: "GVM",                      value: text(raw.gvm) },
    { label: "GCM",                      value: text(raw.gcm) },
    { label: "Tare Mass",                value: text(raw.tare_mass) },
    { label: "Payload",                  value: text(raw.payload_weight) },
    { label: "Braked Towing Capacity",   value: text(raw.braked_towing_capacity) },
    { label: "Unbraked Towing Capacity", value: text(raw.unbraked_towing_capacity) },
    { label: "Cargo Volume",             value: text(raw.cargo_volume) },
    { label: "Load Area Length",         value: text(raw.load_area_length) },
    { label: "Cab Type",                 value: text(raw.cab_type) },
    { label: "Tray Type",                value: text(raw.tray_type) },
    { label: "Battery Capacity",         value: text(raw.battery_capacity) },
    { label: "Driving Range",            value: text(raw.driving_range) },
    { label: "Fridge",                   value: text(raw.fridge) },
    { label: "GPS",                      value: text(raw.gps) },
    { label: "Toilet",                   value: text(raw.toilet) },
    { label: "Shower",                   value: text(raw.shower) },
    { label: "VIN",                      value: text(raw.vin) },
    { label: "Registration Expiry",      value: text(raw.registration_expiry) },
    { label: "Service History",          value: text(raw.service_history) },
    { label: "Warranty",                 value: text(raw.warranty) },
    { label: "Location",                 value: raw.state ? toTitleCase(raw.state) : null },
  ].filter((s) => s.value != null && s.value !== "");

  const cats = Array.isArray(raw.category)
    ? raw.category.map((c: any) => {
        const name = typeof c === "string" ? c : (c?.name ?? c?.label ?? c?.value ?? "");
        return { name, label: name, value: name, slug: typeof c === "object" ? c?.slug : undefined };
      })
    : [];

  return {
    data: {
      product_details: {
        id: raw.source_id || String(raw.id),
        slug: raw.slug,
        name: raw.title,
        title: raw.title,
        sku: raw.sku,
        description: raw.description,
        image_url: Array.isArray(raw.images_full) ? raw.images_full : [],
        image: Array.isArray(raw.images_full) ? raw.images_full : [],
        regular_price: raw.regular_price,
        sale_price: raw.sale_price,
        seller_type: raw.seller_type,
        region: raw.region ? toRegion(raw.region) : undefined,
        suburb: raw.suburb ? toRegion(raw.suburb) : undefined,
        location: raw.location,
        categories: cats,
        attribute_urls: specs,
      },
    },
    seo: {
      metatitle: raw.seo_title || "",
      metadescription: raw.seo_description || "",
    },
  };
}

// React cache() dedupes identical slug calls within a single request, so the
// root layout's JSON-LD lookup and the page's own render share one network call.
export const fetchProductDetail = cache(async (slug: string) => {
  const MPN_BASE = process.env.MPN_API_BASE;
  const CFS_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE;
  const API_KEY  = process.env.MPN_API_KEY;

  // 1. Try new MPN API first
  if (MPN_BASE) {
    try {
      const res = await fetch(
        `${MPN_BASE}/${encodeURIComponent(slug)}`,
        {
          cache: "no-store",
          headers: {
            Accept: "application/json",
            ...(API_KEY && { "X-Secret-Key": API_KEY }),
          },
        }
      );
      if (res.ok) {
        const raw = await res.json();
        if (raw?.slug) return normalizeMpnProduct(raw);
      }
    } catch {
      // fall through to CFS fallback
    }
  }

  // 2. Fallback to old CFS API
  try {
    const res = await fetch(
      `${CFS_BASE}/product-detail-new/?slug=${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          ...(API_KEY && { "X-Secret-Key": API_KEY }),
        },
      }
    );
    if (!res.ok) return null;
    const raw = await res.text();
    const idx = raw.indexOf('{"');
    const parsed = JSON.parse(idx >= 0 ? raw.substring(idx) : raw);
    if (parsed?.slug) return normalizeMpnProduct(parsed);
    return parsed;
  } catch {
    return null;
  }
});
