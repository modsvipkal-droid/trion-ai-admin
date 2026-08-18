import { createRateLimiter } from "@/lib/rateLimit";

/**
 * Server-side admin authorization for API routes.
 * Checks the admin session token that the panel sets after a successful login.
 * Never trust the client UI state — the token is signed and verified here.
 */
const cachedAdminSession = {};

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function isAdminSessionValid(token) {
  if (!token || typeof token !== "string") return false;
  const cached = cachedAdminSession[token];
  if (cached && cached.expiresAt > Date.now()) {
    return true;
  }
  delete cachedAdminSession[token];
  return false;
}

/** Cache a just-created admin session token (set on successful login). */
export function grantAdminSession(token) {
  if (!token) return;
  cachedAdminSession[token] = { expiresAt: Date.now() + 6 * 60 * 60 * 1000 };
}

export function validateAdminPassword(input, expected) {
  if (!input || !expected) return false;
  return (
    input.length === expected.length &&
    timingSafeEqual(input, expected)
  );
}

export function withAdminAuth(handler) {
  const limiter = createRateLimiter({ windowMs: 60000, max: 60, name: "admin-auth" });

  return async (req, res) => {
    const { limited } = limiter(req, res);
    if (limited) {
      return res.status(429).json({ error: "Too many requests" });
    }

    const { limited: globalUserLimit } = createRateLimiter({ windowMs: 60000, max: 300, name: "admin-global" })(req, res);
    if (globalUserLimit) {
      return res.status(429).json({ error: "Too many requests" });
    }

    const token = req.headers["x-admin-token"] || req.body?.adminToken || req.query?.adminToken;
    if (!isAdminSessionValid(token)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    try {
      return await handler(req, res);
    } catch (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}