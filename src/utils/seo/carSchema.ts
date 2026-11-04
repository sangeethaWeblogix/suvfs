import { site } from "@/config/sites";
import { getLocationLabel } from "@/app/home-demo/locationUtils";
import { websiteLd, organizationLd, WEBSITE_ID } from "@/utils/seo/siteSchema";

// JSON-LD for a product (car) details page, built from the raw product detail
// API record: ItemPage + BreadcrumbList + Product, plus the shared WebSite and
// Organization. Fields the API leaves empty are omitted.

type RawProduct = Record<string, any>;

const DESCRIPTION_MAX = 300;

const str = (v: unknown) => (v == null || String(v).trim() === "" ? undefined : String(v).trim());
// make/model come back as taxonomy objects ({ name, slug }).
const nameOf = (v: unknown) =>
  typeof v === "object" && v !== null ? str((v as { name?: unknown }).name) : str(v);
const slugOf = (v: unknown) =>
  typeof v === "object" && v !== null ? str((v as { slug?: unknown }).slug) : undefined;
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const titleCase = (slug: string) => slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/** Leading number of a spec like "89,300 km" / "5 Seats" / "1.5 L" / "120 kW". */
function specNumber(raw: unknown): number | undefined {
  const m = str(raw)?.replace(/,/g, "").match(/\d+(\.\d+)?/);
  return m ? Number(m[0]) : undefined;
}

function shortText(raw: unknown): string | undefined {
  const text = str(raw)?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!text || text.length <= DESCRIPTION_MAX) return text;
  return text.slice(0, text.lastIndexOf(" ", DESCRIPTION_MAX)) + "…";
}

export function buildCarPageJsonLd(
  raw: RawProduct,
  seo: { title?: string; description?: string }
) {
  const pageUrl = `${site.url}/product/${raw.slug}/`;
  const vehicleId = `${pageUrl}#vehicle`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;

  const make = nameOf(raw.make);
  const makeSlug = slugOf(raw.make);
  const model = nameOf(raw.model);
  const modelSlug = slugOf(raw.model);
  // Titles are free text from the feed ("Byd Atto 3") — use the make's
  // canonical spelling so name and brand agree.
  const name = make
    ? String(raw.title).replace(new RegExp(`\\b${escapeRegExp(make)}\\b`, "i"), make)
    : String(raw.title);

  const isDealer = raw.seller_type === "dealer";
  const condition =
    String(raw.condition).toLowerCase() === "new"
      ? "https://schema.org/NewCondition"
      : "https://schema.org/UsedCondition";
  const rawPrice = str(raw.sale_price) ?? str(raw.regular_price);
  const price = rawPrice?.replace(/[^0-9.]/g, "");
  const images: string[] =
    (Array.isArray(raw.images_full) && raw.images_full.length ? raw.images_full : raw.r2_thumbnails) ?? [];

  const odometer = specNumber(raw.odometer);
  const seats = specNumber(raw.seats);
  const doors = specNumber(raw.doors);
  const displacement = specNumber(raw.engine_capacity);
  const power = specNumber(raw.engine_power);
  const drive = str(raw.drive_type ?? raw.drivetrain);
  const transmission = str(raw.transmission)?.replace(/\s*\(.*\)\s*$/, ""); // "Automatic (AT)" → "Automatic"

  // Car specs as Product additionalProperty (PropertyValue) entries.
  const spec = (name: string, value: string | number | undefined, unitCode?: string) =>
    value == null || value === "" ? null : { "@type": "PropertyValue", name, value, ...(unitCode && { unitCode }) };
  const vehicleSpecs = [
    spec("Year", str(raw.year)),
    spec("Variant", str(raw.variant)),
    spec("Body Type", str(raw.body_type)),
    spec("Odometer", odometer, "KMT"),
    spec("Fuel Type", str(raw.fuel_type)),
    spec("Transmission", transmission),
    spec("Drive Type", drive),
    spec("Engine Capacity", displacement, "LTR"),
    spec("Engine Power", power, "KWT"),
    spec("Seats", seats),
    spec("Doors", doors),
    // Private sellers: no VIN (same rule as before).
    isDealer ? spec("VIN", str(raw.vin)) : null,
  ].filter(Boolean);

  // Private sellers: suburb and state only — no postcode, VIN or seller name.
  const address = {
    "@type": "PostalAddress",
    ...(raw.suburb && { addressLocality: titleCase(raw.suburb) }),
    ...(raw.state && { addressRegion: getLocationLabel({ state: raw.state }) }),
    ...(isDealer && raw.pincode && { postalCode: String(raw.pincode) }),
    addressCountry: "AU",
  };

  const breadcrumbs = [
    { name: "Home", item: `${site.url}/` },
    { name: `${site.plural} for Sale`, item: `${site.url}/listings/` },
    ...(make && makeSlug ? [{ name: make, item: `${site.url}/listings/${makeSlug}/` }] : []),
    ...(make && makeSlug && model && modelSlug
      ? [{ name: model, item: `${site.url}/listings/${makeSlug}/${modelSlug}/` }]
      : []),
    { name },
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      websiteLd(),
      organizationLd(),
      {
        "@type": "ItemPage",
        "@id": pageUrl,
        url: pageUrl,
        name: seo.title || name,
        ...(seo.description && { description: seo.description }),
        inLanguage: "en-AU",
        isPartOf: { "@id": WEBSITE_ID },
        breadcrumb: { "@id": breadcrumbId },
        mainEntity: { "@id": vehicleId },
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          ...(b.item && { item: b.item }),
        })),
      },
      {
        // Product (was Vehicle): Ahrefs only accepts a literal "Product" type on
        // product pages. Vehicle-only properties (year, VIN, odometer, fuel, …)
        // aren't valid on Product, so they go in additionalProperty instead.
        "@type": "Product",
        "@id": vehicleId,
        name,
        ...(shortText(raw.description) && { description: shortText(raw.description) }),
        url: pageUrl,
        ...(images.length > 0 && { image: images }),
        ...(make && { brand: { "@type": "Brand", name: make } }),
        ...(model && { model }),
        ...(str(raw.body_type) && { category: str(raw.body_type) }),
        ...(str(raw.colour) && { color: str(raw.colour) }),
        itemCondition: condition,
        ...(vehicleSpecs.length > 0 && { additionalProperty: vehicleSpecs }),
        offers: {
          "@type": "Offer",
          url: pageUrl,
          ...(price && { price }),
          priceCurrency: "AUD",
          availability:
            raw.in_stock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
          itemCondition: condition,
          ...(isDealer && str(raw.dealer)
            ? { seller: { "@type": "Organization", name: str(raw.dealer), address } }
            : { availableAtOrFrom: { "@type": "Place", address } }),
        },
      },
    ],
  };
}
