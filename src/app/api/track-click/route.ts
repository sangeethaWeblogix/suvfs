import { statsUrl } from "@/lib/apiBase";

const API_KEY = process.env.MPN_API_KEY;

export async function POST(req: Request) {
  try {
    const { slug, session_id } = await req.json();
    if (!slug) return Response.json({ success: false });
    const sessionParam = session_id ? `&session_id=${encodeURIComponent(String(session_id))}` : "";

    // Forward the real visitor's IP/UA — without this WP records our own
    // server's IP/location instead of the actual visitor's (same fix as
    // /api/track-product/ and /api/track-impressions/).
    const visitorIp =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "";
    const userAgent = req.headers.get("user-agent") || "";

    await fetch(statsUrl("click", `slug=${encodeURIComponent(slug)}${sessionParam}`), {
      method: "POST",
      headers: {
        ...(API_KEY && { "X-Secret-Key": API_KEY }),
        ...(visitorIp && { "X-Forwarded-For": visitorIp, "X-Real-IP": visitorIp }),
        ...(userAgent && { "User-Agent": userAgent }),
      },
    });

    return Response.json({ success: true });
  } catch (_e) {
    return Response.json({ success: false });
  }
}
