import { getMaintenance, updateMaintenance } from "@/lib/db";
import { createRateLimiter } from "@/lib/rateLimit";

const limiter = createRateLimiter({ windowMs: 1000, max: 5, name: "admin-maintenance" });

export default async function handler(req, res) {
  const { limited } = limiter(req, res);
  if (limited) {
    return res.status(429).json({ error: "Too many requests" });
  }

  if (req.method === "GET") {
    try {
      const config = await getMaintenance();
      return res.status(200).json(config);
    } catch {
      return res.status(200).json({ enabled: false, title: "", message: "", eta: "" });
    }
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password, enabled, title, message, eta } = req.body || {};

  if (!password || typeof password !== "string") {
    return res.status(401).json({ error: "Admin authentication required" });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  const isValid = password.length > 0 && adminPassword.length > 0 &&
    password[0] === adminPassword[0] &&
    password.length === adminPassword.length &&
    password === adminPassword;

  if (!isValid) {
    return res.status(401).json({ error: "Invalid admin credentials" });
  }

  try {
    const config = await updateMaintenance({ enabled, title, message, eta });
    return res.status(200).json({ success: true, config });
  } catch {
    return res.status(500).json({ error: "Failed to update maintenance config" });
  }
}
