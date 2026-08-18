import { withAdminAuth } from "@/lib/adminAuth";
import { getPresence, deleteStalePresence, getUsers, findUserByEmail } from "../../../../lib/db";
import { sanitizeEmail } from "@/lib/validate";
import { logSecurityEvent } from "@/lib/securityLog";

// Heartbeat every 15s → ONLINE; no heartbeat for 45s → OFFLINE.
const OFFLINE_THRESHOLD_MS = 45 * 1000;
// Presence records older than this are purged (temporary session data only).
const CLEANUP_THRESHOLD_MS = 24 * 60 * 60 * 1000;

const DAY_MS = 24 * 60 * 60 * 1000;

function relativeTime(ts, now) {
  const diff = Math.max(0, now - ts);
  if (diff < 1000) return "Just now";
  if (diff < 60000) return `${Math.floor(diff / 1000)} sec ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hr ago`;
  return `${Math.floor(diff / 86400000)} days ago`;
}

function computeUserAccess(user) {
  if (!user) return null;
  const modelAccess = Array.isArray(user.model_access) ? user.model_access : [];
  const fx1 = user.fx1_subscription && typeof user.fx1_subscription === "object" ? user.fx1_subscription : null;

  let fx1Status = null;
  if (fx1) {
    const lifetime = fx1.access_type === "LIFETIME" || fx1.expires_at == null;
    const expired = !lifetime && typeof fx1.expires_at === "number" && Date.now() >= fx1.expires_at;
    fx1Status = {
      plan_id: fx1.plan_id || null,
      plan_name: fx1.plan_name || "FX1",
      access_type: fx1.access_type || (lifetime ? "LIFETIME" : "TEMPORARY"),
      access_status: fx1.access_status === "REVOKED" ? "REVOKED" : (expired ? "EXPIRED" : "ACTIVE"),
      expires_at: lifetime ? null : fx1.expires_at ?? null,
    };
  }

  return {
    model_access: modelAccess,
    model: user.model || "",
    korven: modelAccess.includes("korven"),
    fx1: fx1Status,
  };
}

async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body || {};
    const safeEmail = sanitizeEmail(email);
    if (!safeEmail) {
      return res.status(400).json({ error: "Valid email is required" });
    }
    try {
      const user = await findUserByEmail(safeEmail);
      if (!user) return res.status(404).json({ error: "User not found" });
      return res.status(200).json({ user });
    } catch {
      return res.status(500).json({ error: "Failed to fetch user" });
    }
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const now = Date.now();

    // Purge very stale temporary presence records (keeps user/payment data intact).
    deleteStalePresence(now - CLEANUP_THRESHOLD_MS).catch(() => {});

    const presence = await getPresence();
    const users = await getUsers();

    const enriched = (Array.isArray(presence) ? presence : []).map((p) => {
      const online = typeof p.last_seen === "number" && now - p.last_seen < OFFLINE_THRESHOLD_MS;
      const email = (p.email || "").toLowerCase();
      const savedUser = users.find((u) => (u.email || "").toLowerCase() === email);
      return {
        user_id: p.user_id || "",
        email: email || "",
        status: online ? "ONLINE" : "OFFLINE",
        last_seen: p.last_seen || 0,
        last_seen_label: p.last_seen ? relativeTime(p.last_seen, now) : "—",
        last_page: p.last_page || "",
        session_id: p.session_id || "",
        session_started: p.session_started || p.last_seen || 0,
        session_started_label: p.session_started ? new Date(p.session_started).toLocaleString() : "—",
        access: computeUserAccess(savedUser),
      };
    });

    const onlineUsers = enriched.filter((u) => u.status === "ONLINE");

    logSecurityEvent("admin_live_viewed", { count: enriched.length });

    return res.status(200).json({
      stats: {
        live: onlineUsers.length,
        activeSessions: enriched.length,
        lastUpdated: now,
        lastUpdatedLabel: "Just now",
      },
      users: enriched,
    });
  } catch (err) {
    console.error("admin live error:", err?.message);
    return res.status(500).json({ error: "Failed to load live users" });
  }
}

export default withAdminAuth(handler);