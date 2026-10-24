// Renders each car site's SEO images from its logo (src/config/sites.ts → logo):
//   public/sites/<key>/og-image.png  1200×630 social share preview (Facebook, LinkedIn, X…)
//   public/sites/<key>/logo.png      raster logo for schema.org Organization (Google wants PNG/JPG, not SVG)
//   public/sites/<key>/avatar.png    400×400 initials tile (same look as the favicon), used as the author avatar
//
//   node scripts/generate-site-seo-images.mjs            # every site
//   node scripts/generate-site-seo-images.mjs utes vans  # only these sites
//
// Re-run after replacing a site's logo.svg.

import { join, resolve } from "node:path";
import sharp from "sharp";
import { SITES } from "../src/config/sites.ts";

const ROOT = resolve(import.meta.dirname, "..");

// Initials shown on each site's favicon; the avatar repeats them.
const INITIALS = {
  suv: "SFS", utes: "UFS", peoplemovers: "PFS", sedans: "SCS", hatchbacks: "HCS", wagons: "WCS",
  coupes: "CCS", convertibles: "CCFS", vans: "VFS", "4x4": "4X4", "4wd": "4WD", electric: "ECS", hybrid: "HCFS",
};
const keys = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SITES);

for (const key of keys) {
  const site = SITES[key];
  if (!site) throw new Error(`Unknown site key: ${key}`);
  const logoFile = join(ROOT, "public", site.logo);
  const out = (name) => join(ROOT, "public/sites", key, name);

  // Schema logo: the logo itself, 600px wide, transparent background.
  await sharp(logoFile, { density: 300 }).resize({ width: 600 }).png().toFile(out("logo.png"));

  // Share preview: logo centred on white, brand-colour strip along the bottom.
  const logo = await sharp(logoFile, { density: 300 }).resize({ width: 880, height: 300, fit: "inside" }).png().toBuffer();
  const { width, height } = await sharp(logo).metadata();
  const strip = Buffer.from(`<svg width="1200" height="18"><rect width="1200" height="18" fill="${site.color}"/></svg>`);
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#ffffff" } })
    .composite([
      { input: logo, left: Math.round((1200 - width) / 2), top: Math.round((612 - height) / 2) },
      { input: strip, left: 0, top: 612 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(out("og-image.png"));

  // Author avatar: initials on the brand colour, like the favicon.
  const initials = INITIALS[key] ?? key.slice(0, 3).toUpperCase();
  const fontSize = initials.length > 3 ? 112 : 138;
  const avatar = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
    <rect width="400" height="400" fill="${site.color}"/>
    <text x="200" y="200" dy="0.36em" text-anchor="middle" fill="#fff" font-family="Poppins, Montserrat, 'Segoe UI', Arial, sans-serif"
      font-weight="800" font-size="${fontSize}" letter-spacing="-2">${initials}</text>
  </svg>`);
  await sharp(avatar).png().toFile(out("avatar.png"));

  console.log(`${key}: og-image.png, logo.png, avatar.png (${initials})`);
}
