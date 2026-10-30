import { site } from "@/config/sites";
import { getLocationLabel } from "@/app/home-demo/locationUtils";
import { websiteLd, organizationLd, WEBSITE_ID } from "@/utils/seo/siteSchema";

// JSON-LD for a product (car) details page, built from the raw product detail
// API record: ItemPage + BreadcrumbList + Vehicle, plus the shared WebSite and
// Organization. Fields the API leaves empty are omitted.

type RawProduct = Record<string, any>;

const DRIVE_WHEEL_CONFIG: Record<string, string> = {
  FWD: "https://schema.org/FrontWheelDriveConfiguration",
  RWD: "https://schema.org/RearWheelDriveConfiguration",
  AWD: "https://schema.org/AllWheelDriveConfiguration",
  "4WD": "https://schema.org/FourWheelDriveConfiguration",
  "4X4": "https://schema.org/FourWheelDriveConfiguration",
};

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
  const driveConfig = drive ? DRIVE_WHEEL_CONFIG[drive.toUpperCase()] : undefined;
  const transmission = str(raw.transmission)?.replace(/\s*\(.*\)\s*$/, ""); // "Automatic (AT)" → "Automatic"

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
        // Vehicle, not Car: Google's Rich Results Test gives a Vehicle both
        // product snippets and merchant listings, but a Car (even typed
        // ["Product", "Car"]) only product snippets. Every property used here
        // is a Vehicle property.
        "@type": "Vehicle",
        "@id": vehicleId,
        name,
        ...(shortText(raw.description) && { description: shortText(raw.description) }),
        url: pageUrl,
        ...(images.length > 0 && { image: images }),
        ...(make && { brand: { "@type": "Brand", name: make } }),
        ...(model && { model }),
        ...(str(raw.variant) && { vehicleConfiguration: str(raw.variant) }),
        ...(str(raw.year) && { vehicleModelDate: str(raw.year) }),
        ...(str(raw.body_type) && { bodyType: str(raw.body_type) }),
        ...(str(raw.colour) && { color: str(raw.colour) }),
        ...(doors && { numberOfDoors: doors }),
        ...(seats && { vehicleSeatingCapacity: seats }),
        ...(isDealer && str(raw.vin) && { vehicleIdentificationNumber: str(raw.vin) }),
        itemCondition: condition,
        ...(odometer != null && {
          mileageFromOdometer: { "@type": "QuantitativeValue", value: odometer, unitCode: "KMT" },
        }),
        ...(str(raw.fuel_type) && { fuelType: str(raw.fuel_type) }),
        ...(transmission && { vehicleTransmission: transmission }),
        ...(driveConfig && { driveWheelConfiguration: driveConfig }),
        ...((displacement || power) && {
          vehicleEngine: {
            "@type": "EngineSpecification",
            ...(displacement && {
              engineDisplacement: { "@type": "QuantitativeValue", value: displacement, unitCode: "LTR" },
            }),
            ...(power && { enginePower: { "@type": "QuantitativeValue", value: power, unitCode: "KWT" } }),
          },
        }),
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
