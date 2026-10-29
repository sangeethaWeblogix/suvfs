import { site } from "@/config/sites";

// The site's WebSite + Organization JSON-LD nodes. Every page that describes
// the site or names it as publisher/provider uses these, so the shared @id's
// always carry the same definition.

export const WEBSITE_ID = `${site.url}/#website`;
export const ORGANIZATION_ID = `${site.url}/#organization`;

export function websiteLd() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${site.url}/`,
    name: site.brand,
    inLanguage: "en-AU",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function organizationLd() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: site.brand,
    legalName: "Marketplace Network Pty Ltd",
    taxID: "ABN 70 694 987 052",
    url: `${site.url}/`,
    logo: { "@type": "ImageObject", url: `${site.url}${site.schemaLogo}` },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: `${site.url}/contact/`,
      availableLanguage: "en",
      areaServed: "AU",
    },
  };
}
