#!/usr/bin/env node
// Run one car site locally:  npm run site -- utes        (dev server)
//                            npm run site -- vans 3005   (custom port)
// Sets NEXT_PUBLIC_SITE_KEY + NEXT_PUBLIC_CFS_API_BASE for that site (these
// override .env.local; MPN_API_KEY etc. still come from .env.local) and uses a
// separate build folder (.next-<site>) so several sites can run side by side.
import { spawn } from "node:child_process";

const SITES = ["suv", "utes", "peoplemovers", "sedans", "hatchbacks", "wagons", "coupes", "convertibles", "vans", "4x4", "electric", "hybrid"];
const API = "https://admin-cars.marketplacenetwork.com.au/wp-json/mpn/v1/car-sites";

const [key = "suv", portArg] = process.argv.slice(2);
if (!SITES.includes(key)) {
  console.error(`Unknown site "${key}". Use one of: ${SITES.join(", ")}`);
  process.exit(1);
}
const port = portArg ?? String(3000 + SITES.indexOf(key));

const env = {
  ...process.env,
  NEXT_PUBLIC_SITE_KEY: key,
  NEXT_PUBLIC_CFS_API_BASE: `${API}/${key}`,
  NEXT_DIST_DIR: `.next-${key}`,
};

console.log(`▶ ${key} → http://localhost:${port}  (API ${env.NEXT_PUBLIC_CFS_API_BASE})`);
const child = spawn("npx", ["next", "dev", "-p", port], { env, stdio: "inherit", shell: true });
child.on("exit", (code) => process.exit(code ?? 0));
