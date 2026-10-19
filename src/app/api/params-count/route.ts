import { NextRequest, NextResponse } from "next/server";

export const preferredRegion = "syd1";
import { normalizeCountItems } from "@/lib/countItems";

const MPN_API_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE;
const MPN_API_KEY = process.env.MPN_API_KEY;

/** Proxies the WP params-count API (make/model/state/region counts). */
export async function GET(request: NextRequest) {
  const paramsStr = request.nextUrl.searchParams.toString();
  const url = `${MPN_API_BASE}/params-count?${paramsStr}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
        ...(MPN_API_KEY && { "X-Secret-Key": MPN_API_KEY }),
      },
    });

    if (!response.ok) {
      console.error(
        `[params-count] WP API HTTP ${response.status} | params="${paramsStr}" | Check MPN_API_KEY.`
      );
      return NextResponse.json({}, { status: response.status });
    }

    const raw = await response.text();

    // Detect SiteGround / Cloudflare bot challenge
    if (raw.includes("sgcaptcha") || raw.trimStart().startsWith("<html")) {
      // Extract the blocked IP from SiteGround's challenge URL (y=ipc:IP:timestamp)
      const ipcMatch = raw.match(/ipc:([0-9.]+):/);
      const blockedIp = ipcMatch?.[1] ?? "unknown";
      console.error(
        `[params-count] BOT CHALLENGE blocked request | server_ip="${blockedIp}" | params="${paramsStr}" | This is your Vercel server IP — whitelist it in SiteGround.`
      );
      return NextResponse.json({}, { status: 503 });
    }

    const idx = raw.indexOf('{"');
    try {
      const data = JSON.parse(idx > 0 ? raw.substring(idx) : raw);
      if (Array.isArray(data?.data)) data.data = normalizeCountItems(data.data);
      console.log(`[params-count] WP API OK | params="${paramsStr}"`);
      return NextResponse.json(data);
    } catch {
      console.error(
        `[params-count] WP API unparseable body | params="${paramsStr}" | body_preview="${raw.slice(0, 200)}"`
      );
      return NextResponse.json({});
    }
  } catch (err) {
    console.error(
      `[params-count] WP API fetch failed | params="${paramsStr}" | error="${(err as Error).message}"`
    );
    return NextResponse.json({}, { status: 502 });
  }
}
