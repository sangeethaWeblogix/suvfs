/* Google Tag Manager container per car site (all in the GTM account "CFS", 6267764389).
   Each container sends to that site's own GA4 property (IDs noted per line).
   A site without an entry loads no GTM. Never use GTM-N3362FGQ here — that is the CFS container. */
export const GTM_IDS: Record<string, string> = {
  suv: "GTM-P6QRD8DM",           // G-SGC8CN97Q9
  utes: "GTM-NSQB3GBB",          // G-ZDEVZ75B0J
  peoplemovers: "GTM-5FCJKLZF",  // G-10FDQZSHHZ
  sedans: "GTM-PG8CTTDN",        // G-7PDVTC9FXV
  hatchbacks: "GTM-NXVT43X2",    // G-REBFPRFJNQ
  wagons: "GTM-5HND9XM5",        // G-4PHSN9SM2S
  coupes: "GTM-MJ9DV4C2",        // G-GR9TT0G301
  convertibles: "GTM-PGB6XMKQ",  // G-223XXQBJC2
  vans: "GTM-W8CP4SPP",          // G-6M7SBV1KQK
  "4x4": "GTM-NVXV5PTH",         // G-MCBHLLZKG7
  "4wd": "GTM-K87H8RW6",         // G-07SZ5VM2H3
  awd: "GTM-5MW77QV2",           // G-13KK6YGYXJ
  electric: "GTM-KFM2QHPG",      // G-YC47TGH6SK
  hybrid: "GTM-PTSCWX77",        // G-BHSVZSRZG3
};

/** This site's container ID, or undefined (no GTM). Only a valid "GTM-XXXX" ID is returned. */
export function getGtmId(siteKey: string): string | undefined {
  const id = GTM_IDS[siteKey];
  return id && /^GTM-[A-Z0-9]+$/.test(id) ? id : undefined;
}
