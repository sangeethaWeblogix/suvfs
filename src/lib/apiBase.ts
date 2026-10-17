// Backend URLs — all derived from NEXT_PUBLIC_CFS_API_BASE in .env.
// e.g. https://admin-cars.marketplacenetwork.com.au/wp-json/mpn/v1/car-sites/suv
export const API_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE ?? "";

// WordPress site root of the same backend (e.g. https://admin-cars.marketplacenetwork.com.au),
// used for other WP namespaces: ads-manager banners, contact-form-7.
export const WP_ORIGIN = API_BASE ? new URL(API_BASE).origin : "";
