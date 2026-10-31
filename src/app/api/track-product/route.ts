import { NextResponse } from "next/server";
import { statsUrl } from "@/lib/apiBase";
const API_KEY = process.env.MPN_API_KEY;

export async function POST(req: Request) {
  try {
    const { slug, session_id } = await req.json();
    if (!slug) return NextResponse.json({ success: false });
    const query = `slug=${encodeURIComponent(slug)}${session_id ? `&session_id=${encodeURIComponent(String(session_id))}` : ""}`;

    // Without this, WP sees the outbound request coming from our own server
    // (this route calls WP server-side) and records OUR server's IP/location
    // as the visitor's — e.g. an AWS Sydney IP for every single click, no
    // matter where the real visitor is. Forward the real visitor's IP/UA so
    // WP's click/impression logging attributes them correctly.
    const visitorIp =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "";
    const userAgent = req.headers.get("user-agent") || "";

    const headers = {
      ...(API_KEY && { "X-Secret-Key": API_KEY }),
      ...(visitorIp && { "X-Forwarded-For": visitorIp, "X-Real-IP": visitorIp }),
      ...(userAgent && { "User-Agent": userAgent }),
    };

    await Promise.all([
      fetch(statsUrl("click", query), { method: "POST", headers }),
      fetch(statsUrl("impression", query), { method: "POST", headers }),
    ]);

    return NextResponse.json({ success: true });
  } catch (_e) {
    return NextResponse.json({ error: true });
  }
}
