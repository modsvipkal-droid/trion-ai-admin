import { createRateLimiter } from "@/lib/rateLimit";
import crypto from "crypto";

/**
 * Server-side admin authorization for API routes.
 *
 * Tokens are STATELESS (signed with HMAC-SHA256 using ADMIN_PASSWORD as the
 * shared secret) so that validation works identically on every serverless
 * instance / after restarts — there is no in-memory session registry to miss.
 *
 * Token format:  base64url(JSON payload).base64url(HMAC)
 * payload:       { exp: <expiry ms timestamp> }
 */
const SESSION_TTL_MS = 6 * 60 * 60 * 1000;

function getSecret() {
  return process.env.ADMIN_PASSWORD || "";
}

function b64url(str) {
  return Buffer.from(str, "utf8").toString("base64url");
}

function fromB64url(b64) {
  return Buffer.from(b64, "base64url").toString("utf8");
}

/** Sign a base64url payload with HMAC-SHA256 keyed by ADMIN_PASSWORD. */
function sign(payloadB64) {
  return crypto.createHmac("sha256", getSecret()).update(payloadB64).digest("base64url");
}

/**
 * Mint a new admin session token that is valid on every instance/process
 * without any stored state. Expiry is embedded and checked at validation.
 */
export function createAdminToken() {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_TTL_MS });
  const payloadB64 = b64url(payload);
  return `${payloadB64}.${sign(payloadB64)}`;
}

/**
 * Stateless validation: recompute the HMAC over the payload and compare with
 * a timing-safe check, then verify the embedded expiry is still in the future.
 */
export function isAdminSessionValid(token) {
  if (!token || typeof token !== "string") return false;
  if (!getSecret()) return false;

  const idx = token.indexOf(".");
  if (idx <= 0) return false;

  const payloadB64 = token.slice(0, idx);
  const providedSig = token.slice(idx + 1);

  const expectedSig = sign(payloadB64);
  if (providedSig.length !== expectedSig.length) return false;

  let diff = 0;
  for (let i = 0; i < expectedSig.length; i++) {
    diff |= providedSig.charCodeAt(i) ^ expectedSig.charCodeAt(i);
  }
  if (diff !== 0) return false;

  let payload;
  try {
    payload = JSON.parse(fromB64url(payloadB64));
  } catch {
    return false;
  }

  if (typeof payload.exp !== "number" || payload.exp <= Date.now()) return false;

  return true;
}

/**
 * Backwards-compatible no-op. Auth is now stateless so nothing needs to be
 * cached. Kept so existing callers (verify.js) do not have to change.
 */
export function grantAdminSession(_token) {
  return true;
}

export function validateAdminPassword(input, expected) {
  if (!input || !expected) return false;
  return (
    input.length === expected.length &&
    timingSafeEqual(input, expected)
  );
}

function timingSafeEqual(a, b) {
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function withAdminAuth(handler) {
  const limiter = createRateLimiter({ windowMs: 60000, max: 60, name: "admin-auth" });
  const globalLimiter = createRateLimiter({ windowMs: 60000, max: 300, name: "admin-global" });

  return async (req, res) => {
    const { limited } = limiter(req, res);
    if (limited) {
      return res.status(429).json({ error: "Too many requests" });
    }

    const { limited: globalUserLimit } = globalLimiter(req, res);
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