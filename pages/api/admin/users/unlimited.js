import { findUserByEmail, updateUser, insertActivation } from "../../../../lib/db";
import { sanitizeEmail, sanitizeString } from "@/lib/validate";
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
    const { email, value, model } = req.body || {};
    const safeEmail = sanitizeEmail(email);
    if (!safeEmail) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    let updates;
    if (model !== undefined) {
      const safeModel = sanitizeString(model, 20) || "";
      const active = safeModel !== "";
      updates = {
        unlimited: active,
        unlimitedAt: active ? Date.now() : null,
        model: safeModel,
      };
      if (active) {
        updates.model_access = [safeModel];
        if (safeModel === "fx1") {
          updates.fx1_subscription = {
            plan_id: "fx1_lt",
            plan_name: "Lifetime",
            access_type: "LIFETIME",
            access_status: "ACTIVE",
            started_at: Date.now(),
            expires_at: null,
          };
        }
        await insertActivation({ email: safeEmail, model: safeModel, planId: safeModel === "fx1" ? "fx1_lt" : null, planName: safeModel === "fx1" ? "Lifetime" : null, activatedAt: Date.now() });
      } else {
        updates.model_access = [];
      }
      logSecurityEvent("admin_model_selected", { email: safeEmail, model: safeModel });
    } else {
      updates = {
        unlimited: !!value,
        unlimitedAt: value ? Date.now() : null,
      };
      if (value) {
        await insertActivation({ email: safeEmail, activatedAt: Date.now() });
      }
      logSecurityEvent("admin_unlimited_toggled", { email: safeEmail, value: !!value });
    }

    const user = await updateUser(safeEmail, updates);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user });
  } catch {
    return res.status(200).json({ error: "Operation failed" });
  }
}
