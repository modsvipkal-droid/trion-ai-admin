import { findUserByEmail, updateUser, insertActivation } from "../../../../lib/db";
import { sanitizeEmail, sanitizeString } from "@/lib/validate";
import { logSecurityEvent } from "@/lib/securityLog";
import { createRateLimiter } from "@/lib/rateLimit";

const adminLimiter = createRateLimiter({ windowMs: 60000, max: 30, name: "admin-payment-access" });

const MODEL_LABELS = {
  korven: { name: "Korven Model", amount: 749 },
  fx1: { name: "FX1 Model", amount: 1100 },
};

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
    const { email, model, action } = req.body || {};
    const safeEmail = sanitizeEmail(email);
    if (!safeEmail) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    const modelId = sanitizeString(model, 20).toLowerCase();
    if (!MODEL_LABELS[modelId]) {
      return res.status(400).json({ error: "Invalid model" });
    }

    const mode = action === "revoke" ? "revoke" : "restore";
    const user = await findUserByEmail(safeEmail);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const modelAccess = Array.isArray(user.model_access) ? user.model_access : [];

    let nextAccess;
    if (mode === "revoke") {
      nextAccess = modelAccess.filter((m) => m !== modelId);
    } else {
      nextAccess = modelAccess.includes(modelId) ? modelAccess : [...modelAccess, modelId];
    }

    const hasAny = nextAccess.length > 0;

    const updates = {
      model_access: nextAccess,
      unlimited: hasAny,
      unlimitedAt: hasAny ? (mode === "restore" ? Date.now() : user.unlimitedAt) : null,
    };

    if (hasAny) {
      updates.model = nextAccess[nextAccess.length - 1];
    } else {
      updates.model = "";
    }

    await updateUser(safeEmail, updates);

    if (mode === "restore") {
      await insertActivation({
        email: safeEmail,
        model: modelId,
        activatedAt: Date.now(),
        source: "admin_manual_restore",
      });
    }

    logSecurityEvent("admin_payment_access", {
      email: safeEmail,
      model: modelId,
      action: mode,
    });

    return res.status(200).json({
      success: true,
      user: {
        email: safeEmail,
        model_access: nextAccess,
        unlimited: hasAny,
        model: hasAny ? updates.model : "",
      },
    });
  } catch {
    return res.status(200).json({ error: "Operation failed" });
  }
}