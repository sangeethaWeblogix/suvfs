// Renders the listings-page promo cards ("Sell my <vehicle>" and "Dealer sign up")
// for every car site, using each site's vehicle name and brand colour from
// src/config/sites.ts. Output: public/sites/<key>/sell-my-<slug>.jpg and
// public/sites/<key>/<slug>-dealer-advertising.jpg (1200×1722, shown at 600×861).
//
//   node scripts/generate-site-promos.mjs            # every site except suv
//   node scripts/generate-site-promos.mjs utes vans  # only these sites
//
// SUV keeps its original hand-made cards; pass "suv" explicitly to regenerate it.
// Needs Microsoft Edge or Google Chrome installed (headless screenshot) and sharp.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import sharp from "sharp";
import { SITES, promoPaths } from "../src/config/sites.ts";

const ROOT = resolve(import.meta.dirname, "..");
const W = 600;
const H = 861;
const SCALE = 2;

const BROWSERS = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];
const browser = BROWSERS.find((p) => existsSync(p));
if (!browser) throw new Error("No Edge/Chrome found for headless rendering");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

// Lucide-style stroke icons (24×24 viewBox).
const ICON = {
  tag: '<path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4z"/><circle cx="7.5" cy="7.5" r="1.3" fill="currentColor"/>',
  dollar: '<path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  calc: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v3M8 18h.01M12 18h.01"/>',
  megaphone: '<path d="m3 11 15-6v14L3 13z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/><path d="M21 9.5v5M22.5 7.5l-1 1M22.5 16.5l-1-1"/>',
  clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 11h6M9 15h6M9 19h4"/>',
  clipboardPen: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M10.4 12.6a2 2 0 0 1 3 3L8 21l-4 1 1-4z"/><path d="M16 4h2a2 2 0 0 1 2 2v5.5"/><path d="M4 13.5V6a2 2 0 0 1 2-2h2"/>',
  arrow: '<path d="M5 12h14M13 5l7 7-7 7"/>',
};
const icon = (name, size, stroke = 2) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${ICON[name]}</svg>`;

// Solid two-tone icons for the dealer feature tiles.
const SOLID = {
  chart: (c) => `<svg width="46" height="46" viewBox="0 0 48 48"><rect x="6" y="30" width="7" height="12" rx="1.5" fill="${c}"/><rect x="16" y="24" width="7" height="18" rx="1.5" fill="${c}"/><rect x="26" y="27" width="7" height="15" rx="1.5" fill="${c}"/><rect x="36" y="18" width="7" height="24" rx="1.5" fill="${c}"/><path d="M6 24 17 14l9 7 14-13" fill="none" stroke="${c}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M33 7h8v8" fill="none" stroke="${c}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  users: (c) => `<svg width="48" height="48" viewBox="0 0 48 48"><circle cx="17" cy="15" r="7" fill="${c}"/><circle cx="32" cy="15" r="7" fill="${c}"/><path d="M4 38c0-8 6-13 13-13s13 5 13 13z" fill="${c}"/><path d="M19 38c0-8 6-13 13-13s13 5 13 13z" fill="${c}"/></svg>`,
  tag: (c) => `<svg width="46" height="46" viewBox="0 0 48 48"><path d="M26 4h16a2 2 0 0 1 2 2v16a3 3 0 0 1-.9 2.1L24.6 42.6a3 3 0 0 1-4.2 0L5.4 27.6a3 3 0 0 1 0-4.2L23.9 4.9A3 3 0 0 1 26 4z" fill="${c}"/><circle cx="35" cy="13" r="3.2" fill="#fff"/></svg>`,
  shield: (c) => `<svg width="46" height="46" viewBox="0 0 48 48"><path d="M24 3 41 9v13c0 11-7 19-17 23C14 41 7 33 7 22V9z" fill="${c}"/><path d="m16 23 6 6 11-12" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

function page(site, body) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800&display=swap" rel="stylesheet">
<style>
  :root { --c: ${site.color}; --rgb: ${site.colorRgb}; --ink: #0d0c22; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: #fff; }
  body { font-family: Inter, "Segoe UI", Arial, sans-serif; color: var(--ink); position: relative; letter-spacing: -0.02em; }
  .bg { position: absolute; inset: 0; overflow: hidden; z-index: 0;
        background: linear-gradient(180deg, #fff 0%, #fbfbff 60%, #f6f5ff 100%); }
  .arc { position: absolute; border-radius: 50%; border: 46px solid rgba(var(--rgb), 0.05); }
  .dots { position: absolute; width: 96px; height: 96px;
          background-image: radial-gradient(rgba(var(--rgb), 0.35) 1.6px, transparent 1.7px);
          background-size: 16px 16px; }
  .wrap { position: absolute; inset: 0; z-index: 1; }
  .badge { position: absolute; left: 40px; top: 50px; height: 43px; padding: 0 22px 0 16px; border-radius: 8px;
           background: var(--c); color: #fff; display: flex; align-items: center; gap: 12px;
           font-size: 19px; font-weight: 600; letter-spacing: 0.01em; }
  .fit { white-space: nowrap; display: block; }
  .bar { width: 56px; height: 4px; border-radius: 2px; background: var(--c); }
  .accent { color: var(--c); }
  .cta { position: absolute; left: 30px; right: 30px; height: 88px; border-radius: 12px; background: var(--c);
         color: #fff; display: flex; align-items: center; padding: 0 30px 0 34px;
         box-shadow: 0 10px 24px rgba(var(--rgb), 0.28); }
  .cta .disc { width: 62px; height: 62px; border-radius: 50%; background: #fff; color: var(--c);
               display: flex; align-items: center; justify-content: center; flex: none; }
  .cta .label { flex: 1; text-align: center; font-size: 30px; font-weight: 600; letter-spacing: -0.01em; padding: 0 10px; }
  .card { background: #fff; border-radius: 12px; box-shadow: 0 6px 22px rgba(20, 20, 60, 0.08); }
</style></head><body>
<div class="bg">
  <div class="arc" style="width:620px;height:620px;right:-330px;top:-230px"></div>
  <div class="arc" style="width:420px;height:420px;right:-250px;top:300px"></div>
  <div class="arc" style="width:300px;height:300px;left:-230px;top:620px"></div>
</div>
<div class="wrap">${body}</div>
<script>
  // Shrink each [data-max] element until it fits its width; elements sharing a
  // data-group end up the same size (the smallest of the group).
  // Measure only after the web font has loaded.
  document.fonts.ready.then(() => {
  const groups = {};
  for (const el of document.querySelectorAll("[data-max]")) {
    const max = +el.dataset.max, min = +el.dataset.min || 10;
    let size = max;
    el.style.fontSize = size + "px";
    while (el.scrollWidth > el.clientWidth && size > min) { size -= 1; el.style.fontSize = size + "px"; }
    const g = el.dataset.group;
    if (g) groups[g] = Math.min(groups[g] ?? Infinity, size);
  }
  for (const el of document.querySelectorAll("[data-group]")) el.style.fontSize = groups[el.dataset.group] + "px";
  });
</script>
</body></html>`;
}

function sellCard(site) {
  const features = [
    ["tag", "No<br>subscription<br>fees"],
    ["dollar", "No<br>commission"],
    ["calc", "No<br>ongoing<br>costs"],
    ["megaphone", "Ad live<br>until sold"],
  ];
  return page(site, `
  <div class="dots" style="right:34px;top:22px;height:80px"></div>
  <div class="badge">${icon("tag", 24, 2.2)}PRIVATE SELLER</div>
  <div style="position:absolute;left:38px;right:30px;top:118px;font-weight:700;line-height:1.12;letter-spacing:-0.035em">
    <span class="fit" data-max="66" data-group="h">Sell Your ${esc(site.singular)}</span>
    <span class="fit accent" data-max="66" data-group="h">As a Private Seller</span>
  </div>
  <div class="bar" style="position:absolute;left:40px;top:274px"></div>
  <div class="fit" style="position:absolute;left:40px;right:40px;top:300px;font-weight:500" data-max="22">List your ${esc(site.noun)} for just</div>
  <div style="position:absolute;left:36px;top:322px;display:flex;align-items:flex-end;gap:10px">
    <span class="accent" style="font-size:118px;font-weight:800;letter-spacing:-0.05em;line-height:1.05">$49</span>
    <span class="accent" style="font-size:19px;font-weight:600;padding-bottom:24px">(Inc. GST)</span>
  </div>
  <div style="position:absolute;left:40px;top:450px;font-size:22px;font-weight:500">One-time listing fee</div>
  <div style="position:absolute;left:30px;right:30px;top:497px;height:205px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
    ${features.map(([ic, text]) => `
    <div class="card" style="display:flex;flex-direction:column;align-items:center;padding-top:20px">
      <div class="accent" style="width:72px;height:72px;border-radius:50%;border:2px solid var(--c);display:flex;align-items:center;justify-content:center">${icon(ic, 36, 1.8)}</div>
      <div style="flex:1;display:flex;align-items:center;text-align:center;font-size:18px;font-weight:500;line-height:1.2;letter-spacing:-0.01em;padding:6px 4px 0">${text}</div>
      <div class="bar" style="width:44px;height:3px;margin:8px 0 18px"></div>
    </div>`).join("")}
  </div>
  <div class="cta" style="top:730px">
    <div class="disc">${icon("clipboard", 32, 1.9)}</div>
    <span class="label fit" data-max="30" data-min="20">List Your ${esc(site.singular)} Now</span>
    ${icon("arrow", 34, 2.4)}
  </div>`);
}

function dealerCard(site) {
  const tiles = [
    ["chart", "Increase Your Visibility", `Get noticed by more ${site.noun} buyers`],
    ["users", "Get More Qualified Leads", "Connect with serious buyers in your area"],
    ["tag", "Promote Your Stock", `Showcase your ${site.nounPlural} and special offers`],
    ["shield", "Trusted By Thousands of Buyers", "Join a marketplace buyers know and trust"],
  ];
  return page(site, `
  <div class="dots" style="right:44px;top:40px"></div>
  <div class="dots" style="left:-10px;bottom:24px;width:64px;height:64px"></div>
  <div class="badge" style="top:42px;height:48px">${SOLID.users("#fff").replace('width="48" height="48"', 'width="30" height="30"')}DEALERS</div>
  <div style="position:absolute;left:36px;right:30px;top:108px;font-size:76px;font-weight:700;line-height:1.02;letter-spacing:-0.045em">
    <div>Grow Your</div><div>Business</div><div class="accent">Dealer Sign Up</div>
  </div>
  <div class="bar" style="position:absolute;left:38px;top:352px"></div>
  <div style="position:absolute;left:38px;right:30px;top:382px;font-weight:500;line-height:1.25;letter-spacing:-0.02em">
    <span class="fit" data-max="29" data-group="j">Join Australia’s fast-growing</span>
    <span class="fit" data-max="29" data-group="j">${esc(site.noun)} dealer marketplace.</span>
  </div>
  <div style="position:absolute;left:28px;right:28px;top:476px;height:236px;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:12px">
    ${tiles.map(([ic, title, desc]) => `
    <div class="card" style="display:flex;align-items:center;gap:10px;padding:0 10px 0 12px">
      <div style="width:66px;height:66px;border-radius:50%;background:rgba(var(--rgb),0.08);display:flex;align-items:center;justify-content:center;flex:none;transform:scale(0.9)">${SOLID[ic](site.color)}</div>
      <div style="border-left:1px solid #e6e6ef;padding-left:11px">
        <div style="font-size:13.5px;font-weight:600;line-height:1.3;letter-spacing:-0.01em">${esc(title)}</div>
        <div style="font-size:12px;color:#4b4b63;line-height:1.4;margin-top:5px;letter-spacing:0">${esc(desc)}</div>
      </div>
    </div>`).join("")}
  </div>
  <div class="cta" style="top:735px;height:88px">
    <div class="disc">${icon("clipboardPen", 32, 1.9)}</div>
    <span class="label">Dealer Sign Up Now</span>
    ${icon("arrow", 34, 2.4)}
  </div>`);
}

function render(html, outFile, tmp) {
  const htmlFile = join(tmp, "card.html");
  const pngFile = join(tmp, "card.png");
  writeFileSync(htmlFile, html);
  execFileSync(browser, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
    `--user-data-dir=${join(tmp, "profile")}`,
    `--window-size=${W},${H}`, `--force-device-scale-factor=${SCALE}`,
    "--virtual-time-budget=4000",
    `--screenshot=${pngFile}`, `file:///${htmlFile.replace(/\\/g, "/")}`,
  ], { stdio: "ignore" });
  return sharp(pngFile).resize(W * SCALE, H * SCALE).jpeg({ quality: 86, mozjpeg: true }).toFile(outFile);
}

const keys = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SITES).filter((k) => k !== "suv");
const tmp = mkdtempSync(join(tmpdir(), "site-promos-"));
try {
  for (const key of keys) {
    const site = SITES[key];
    if (!site) throw new Error(`Unknown site key: ${key}`);
    const paths = promoPaths(site);
    mkdirSync(join(ROOT, "public/sites", key), { recursive: true });
    await render(sellCard(site), join(ROOT, "public", paths.sell), tmp);
    await render(dealerCard(site), join(ROOT, "public", paths.dealer), tmp);
    console.log(`${key}: ${paths.sell}, ${paths.dealer}`);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
