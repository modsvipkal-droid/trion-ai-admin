import { findUserByEmail, updateUser, insertActivation } from "../../../../lib/db";
import { sanitizeEmail, sanitizeString } from "@/lib/validate";
import { logSecurityEvent } from "@/lib/securityLog";
import { createRateLimiter } from "@/lib/rateLimit";

const adminLimiter = createRateLimiter({ windowMs: 60000, max: 30, name: "admin-payment-access" });

const MODEL_LABELS = {
  korven: { name: "Korven Model", amount: 749 },
  fx1: { name: "FX1 Model" },
};

const FX1_PLANS = {
  fx1_d7: { name: "7 Days", amount: 1000, duration_days: 7, access_type: "TEMPORARY" },
  fx1_m1: { name: "1 Month", amount: 3000, duration_days: 30, access_type: "TEMPORARY" },
  fx1_lt: { name: "Lifetime", amount: 10000, duration_days: null, access_type: "LIFETIME" },
};

const DAY_MS = 24 * 60 * 60 * 1000;

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
    const { email, model, action, plan, extendDays } = req.body || {};
    const safeEmail = sanitizeEmail(email);
    if (!safeEmail) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    const modelId = sanitizeString(model, 20).toLowerCase();
    if (!MODEL_LABELS[modelId]) {
      return res.status(400).json({ error: "Invalid model" });
    }

    const mode = action === "revoke" ? "revoke"
      : action === "extend" ? "extend"
      : action === "activate" && modelId === "fx1" ? "activate"
      : "restore";

    const user = await findUserByEmail(safeEmail);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const modelAccess = Array.isArray(user.model_access) ? user.model_access : [];
    const now = Date.now();

    const buildFx1Sub = (planConfig, baseStarted = now) => ({
      plan_id: planConfig.id,
      plan_name: planConfig.name,
      access_type: planConfig.access_type,
      access_status: "ACTIVE",
      started_at: baseStarted,
      expires_at: planConfig.duration_days == null ? null : baseStarted + planConfig.duration_days * DAY_MS,
    });

    let nextAccess = modelAccess;
    const updates = {};

    if (modelId === "fx1") {
      const existingSub = user.fx1_subscription && typeof user.fx1_subscription === "object" ? user.fx1_subscription : null;

      if (mode === "revoke") {
        nextAccess = modelAccess.filter((m) => m !== "fx1");
        updates.fx1_subscription = existingSub ? { ...existingSub, access_status: "REVOKED" } : undefined;
      } else if (mode === "extend") {
        const days = Math.max(1, Math.floor(Number(extendDays) || 1));
        const lifetime = existingSub?.access_type === "LIFETIME" || existingSub?.expires_at == null;
        if (lifetime || !existingSub) {
          updates.fx1_subscription = { plan_id: "fx1_lt", plan_name: "Lifetime", access_type: "LIFETIME", access_status: "ACTIVE", started_at: existingSub?.started_at || now, expires_at: null };
        } else {
          const base = Math.max(existingSub.expires_at, now);
          updates.fx1_subscription = { ...existingSub, access_status: "ACTIVE", expires_at: base + days * DAY_MS };
        }
        nextAccess = modelAccess.includes("fx1") ? modelAccess : [...modelAccess, "fx1"];
      } else if (mode === "activate") {
        const planId = sanitizeString(plan, 20).toLowerCase();
        const planConfig = FX1_PLANS[planId];
        if (!planConfig) {
          return res.status(400).json({ error: "Invalid FX1 plan" });
        }
        updates.fx1_subscription = buildFx1Sub(planConfig);
        nextAccess = modelAccess.includes("fx1") ? modelAccess : [...modelAccess, "fx1"];
      } else {
        // restore
        updates.fx1_subscription = {
          plan_id: existingSub?.plan_id || "fx1_lt",
          plan_name: existingSub?.plan_name || "Lifetime",
          access_type: existingSub?.access_type === "TEMPORARY" && existingSub?.expires_at ? "TEMPORARY" : "LIFETIME",
          access_status: "ACTIVE",
          started_at: existingSub?.started_at || now,
          expires_at: existingSub?.access_type === "TEMPORARY" && existingSub?.expires_at ? existingSub.expires_at : null,
        };
        nextAccess = modelAccess.includes("fx1") ? modelAccess : [...modelAccess, "fx1"];
      }
    } else {
      if (mode === "revoke") {
        nextAccess = modelAccess.filter((m) => m !== modelId);
      } else {
        nextAccess = modelAccess.includes(modelId) ? modelAccess : [...modelAccess, modelId];
      }
    }

    const hasAny = (updates.fx1_subscription?.access_status === "ACTIVE" && modelId === "fx1") || nextAccess.length > 0;

    updates.model_access = nextAccess;
    updates.unlimited = hasAny;
    updates.unlimitedAt = hasAny ? now : null;
    updates.model = hasAny ? (modelId === "fx1" ? "fx1" : nextAccess[nextAccess.length - 1]) : "";

    await updateUser(safeEmail, updates);

    if (mode === "restore" || mode === "activate" || mode === "extend") {
      await insertActivation({
        email: safeEmail,
        model: modelId,
        planId: updates.fx1_subscription?.plan_id || null,
        planName: updates.fx1_subscription?.plan_name || null,
        activatedAt: now,
        source: "admin_manual_" + mode,
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
        fx1_subscription: updates.fx1_subscription || user.fx1_subscription || null,
        unlimited: hasAny,
        model: hasAny ? (modelId === "fx1" ? "fx1" : updates.model) : "",
      },
    });
  } catch {
    return res.status(200).json({ error: "Operation failed" });
  }
}