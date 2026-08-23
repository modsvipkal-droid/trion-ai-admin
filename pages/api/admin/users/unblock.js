import { findUserByEmail, updateUser } from "../../../../lib/db";
import { sanitizeEmail } from "@/lib/validate";
import { logSecurityEvent } from "@/lib/securityLog";
import { createRateLimiter } from "@/lib/rateLimit";

const adminLimiter = createRateLimiter({ windowMs: 60000, max: 30, name: "admin-unblock" });

/**
 * POST /api/admin/users/unblock
 * Manually lifts the subscription anti-abuse block from an account.
 */
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
    const { email } = req.body || {};
    const safeEmail = sanitizeEmail(email);
    if (!safeEmail) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    const existing = await findUserByEmail(safeEmail);
    if (!existing) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await updateUser(safeEmail, {
      subscriptionBlocked: false,
      blockReason: null,
      blockedAt: null,
      subscriptionScreenVisits: 0,
    });

    logSecurityEvent("admin_user_unblocked", { email: safeEmail });

    return res.status(200).json({ user });
  } catch {
    return res.status(500).json({ error: "Operation failed" });
  }
}
