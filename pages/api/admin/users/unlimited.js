import { findUserByEmail, updateUser, insertActivation } from "../../../../lib/db";
import { sanitizeEmail } from "@/lib/validate";
import { logSecurityEvent } from "@/lib/securityLog";
import { createRateLimiter } from "@/lib/rateLimit";

const adminLimiter = createRateLimiter({ windowMs: 60000, max: 30, name: "admin-unlimited" });

export default async function handler(req, res) {
  const { limited } = adminLimiter(req, res);
  if (limited) {
    return res.status(429).json({ error: "Too many requests" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, value } = req.body || {};
    const safeEmail = sanitizeEmail(email);
    if (!safeEmail) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    const user = await updateUser(safeEmail, {
      unlimited: !!value,
      unlimitedAt: value ? Date.now() : null,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (value) {
      await insertActivation({ email: safeEmail, activatedAt: Date.now() });
    }

    logSecurityEvent("admin_unlimited_toggled", { email: safeEmail, value: !!value });

    return res.status(200).json({ user });
  } catch {
    return res.status(200).json({ error: "Operation failed" });
  }
}
