// Runs before `next build` (npm "prebuild"). On Vercel, deletes every other
// site's public/sites/<key>/ folder from the build checkout, so e.g. the sedans
// deployment doesn't serve /sites/suv/... files. Never touches a local checkout.

import { existsSync, readdirSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";

if (process.env.VERCEL !== "1") process.exit(0);

const key = process.env.NEXT_PUBLIC_SITE_KEY || "suv"; // SUV's project has no key; code defaults to suv
const sitesDir = join(resolve(import.meta.dirname, ".."), "public/sites");

// If this site's own folder is missing, something is off: keep everything.
if (!existsSync(join(sitesDir, key))) {
  console.warn(`prune-other-sites: no public/sites/${key}/, leaving all site folders in place`);
  process.exit(0);
}

for (const entry of readdirSync(sitesDir, { withFileTypes: true })) {
  if (entry.isDirectory() && entry.name !== key) {
    rmSync(join(sitesDir, entry.name), { recursive: true, force: true });
    console.log(`prune-other-sites: removed public/sites/${entry.name}/`);
  }
}
