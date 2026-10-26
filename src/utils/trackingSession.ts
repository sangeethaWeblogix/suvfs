// Per-tab visitor session id for click/impression tracking — the same
// "blr_session" key the banner tracking uses (ads-manager convention), so the
// backend can dedupe repeat impressions and count unique visitors per session
// instead of per IP. "" when sessionStorage is blocked; the backend then falls
// back to the IP.
export function getTrackingSessionId(): string {
  try {
    let sid = sessionStorage.getItem("blr_session");
    if (!sid) {
      sid = "sess_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem("blr_session", sid);
    }
    return sid;
  } catch {
    return "";
  }
}
