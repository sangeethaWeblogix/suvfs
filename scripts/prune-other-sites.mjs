// Runs before `next build` (npm "prebuild"). On Vercel, deletes every other
// site's public/sites/<key>/ files from the build checkout, so e.g. the sedans
// deployment doesn't serve /sites/suv/... files. Each other site's logo.svg is
// kept: the footer "Our Marketplace Network" strip shows every site's logo.
// Never touches a local checkout.

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

const KEEP = new Set(["logo.svg"]);

for (const entry of readdirSync(sitesDir, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name === key) continue;
  const dir = join(sitesDir, entry.name);
  for (const file of readdirSync(dir)) {
    if (!KEEP.has(file)) rmSync(join(dir, file), { recursive: true, force: true });
  }
  console.log(`prune-other-sites: pruned public/sites/${entry.name}/ (kept logo.svg)`);
}
