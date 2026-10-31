import { statsUrl } from "@/lib/apiBase";

const API_KEY = process.env.MPN_API_KEY;

export async function POST(req: Request) {
  try {
    const { slug } = await req.json();
    if (!slug) return Response.json({ success: false });

    await fetch(statsUrl("impression", `slug=${encodeURIComponent(slug)}`), {
      method: "POST",
      headers: {
        ...(API_KEY && { "X-Secret-Key": API_KEY }),
      },
    });

    return Response.json({ success: true });
  } catch (_e) {
    return Response.json({ success: false });
  }
}
