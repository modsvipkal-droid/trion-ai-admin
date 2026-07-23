import { insertVisit } from "@/lib/db";
import { sanitizeString } from "@/lib/validate";
import { createRateLimiter } from "@/lib/rateLimit";

const trackLimiter = createRateLimiter({ windowMs: 1000, max: 5, name: "track" });

export default async function handler(req, res) {
  const { limited } = trackLimiter(req, res);
  if (limited) {
    return res.status(429).json({ success: false });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { path: pagePath, referrer, userAgent, isNew } = req.body || {};

    const safePath = sanitizeString(pagePath, 200) || "/";

    let device = "Desktop";
    const ua = sanitizeString(userAgent || "", 500);
    if (/Mobi|Android|iPhone|iPad/i.test(ua)) {
      device = /Tablet|iPad/i.test(ua) ? "Tablet" : "Mobile";
    }

    let browser = "Chrome";
    if (/Firefox/i.test(ua)) browser = "Firefox";
    else if (/SamsungBrowser/i.test(ua)) browser = "Samsung Internet";
    else if (/Opera|OPR/i.test(ua)) browser = "Opera";
    else if (/Edge|Edg/i.test(ua)) browser = "Edge";
    else if (/Android/i.test(ua) && /Version/i.test(ua)) browser = "Android Webview";
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
    else if (/Chrome/i.test(ua)) browser = "Chrome";

    const country = req.headers["x-vercel-ip-country"] || "Unknown";

    let channel = "Direct";
    let source = "Direct";
    const safeReferrer = sanitizeString(referrer || "", 500);
    if (safeReferrer) {
      try {
        const refUrl = new URL(safeReferrer);
        const host = refUrl.hostname.toLowerCase();
        if (host.includes("google.com")) {
          if (host.includes("accounts.google")) { channel = "Referral"; source = "Google accounts"; }
          else { channel = "Organic Search"; source = "Google"; }
        } else if (host.includes("duckduckgo.com")) { channel = "Organic Search"; source = "DuckDuckGo"; }
        else if (host.includes("instagram.com")) { channel = "Social Media"; source = "Instagram"; }
        else if (host.includes("facebook.com")) { channel = "Social Media"; source = "Facebook"; }
        else { channel = "Referral"; source = refUrl.hostname; }
      } catch { channel = "Referral"; source = safeReferrer; }
    }

    const visit = {
      timestamp: Date.now(),
      path: safePath,
      device,
      browser,
      country,
      isNew: !!isNew,
      channel,
      source,
    };

    await insertVisit(visit);

    return res.status(200).json({ success: true });
  } catch {
    return res.status(200).json({ success: true });
  }
}
