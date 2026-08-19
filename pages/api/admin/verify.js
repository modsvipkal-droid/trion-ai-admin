import { createRateLimiter } from "@/lib/rateLimit";
import { logSecurityEvent } from "@/lib/securityLog";
import { validateAdminPassword, createAdminToken, isAdminSessionValid } from "@/lib/adminAuth";

const verifyLimiter = createRateLimiter({ windowMs: 60000, max: 10, name: "admin-verify" });

export default function handler(req, res) {
  const { limited } = verifyLimiter(req, res);
  if (limited) {
    logSecurityEvent("admin_verify_rate_limited", { ip: req.ip });
    return res.status(429).json({ success: false, error: "Too many attempts. Please wait." });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password, token } = req.body || {};
  if (typeof token === "string" && token && isAdminSessionValid(token)) {
    return res.status(200).json({ success: true, token });
  }

  if (!password || typeof password !== "string") {
    return res.status(400).json({ success: false, error: "Password required" });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    logSecurityEvent("admin_no_password_configured");
    return res.status(500).json({ success: false, error: "Server configuration error" });
  }

  if (validateAdminPassword(password, adminPassword)) {
    const sessionToken = createAdminToken();
    return res.status(200).json({ success: true, token: sessionToken });
  }

  logSecurityEvent("admin_verify_failed", { ip: req.ip });
  return res.status(401).json({ success: false, error: "Invalid credentials" });
}
