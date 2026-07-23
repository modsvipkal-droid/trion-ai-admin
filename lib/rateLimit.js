const stores = new Map();

export function createRateLimiter({ windowMs = 60000, max = 60, name = "default", statusCode = 429 }) {
  if (!stores.has(name)) {
    stores.set(name, new Map());
  }
  const store = stores.get(name);

  const interval = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store) {
      if (now - record.windowStart > windowMs) {
        store.delete(key);
      }
    }
  }, windowMs * 2);

  if (interval.unref) interval.unref();

  return function rateLimit(req, res) {
    const key = req.ip || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";
    const now = Date.now();
    let record = store.get(key);
    if (!record || now - record.windowStart > windowMs) {
      record = { count: 1, windowStart: now };
      store.set(key, record);
    } else {
      record.count += 1;
    }
    const remaining = Math.max(0, max - record.count);
    const resetMs = windowMs - (now - record.windowStart);
    res.setHeader("X-RateLimit-Limit", String(max));
    res.setHeader("X-RateLimit-Remaining", String(remaining));
    res.setHeader("X-RateLimit-Reset", String(Math.ceil(resetMs / 1000)));
    if (record.count > max) {
      res.setHeader("Retry-After", String(Math.ceil(resetMs / 1000)));
      return { limited: true, statusCode };
    }
    return { limited: false };
  };
}
