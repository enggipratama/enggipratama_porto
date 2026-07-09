// In-memory sliding window rate limiter
// Suitable for Next.js API serverless routes

const lru = new Map<string, { count: number; reset: number }>();

// Cleanup interval to prevent memory leaks from old entries
if (typeof global !== "undefined") {
  const intervalKey = "_rate_limit_cleanup";
  if (!(global as any)[intervalKey]) {
    (global as any)[intervalKey] = setInterval(() => {
      const now = Date.now();
      for (const [key, value] of lru.entries()) {
        if (now > value.reset) {
          lru.delete(key);
        }
      }
    }, 60000 * 5); // every 5 minutes
  }
}

export function rateLimit(ip: string, limit = 5, windowMs = 60 * 1000) {
  const now = Date.now();
  const client = lru.get(ip);

  if (!client) {
    const data = { count: 1, reset: now + windowMs };
    lru.set(ip, data);
    return { success: true, count: 1, reset: data.reset };
  }

  if (now > client.reset) {
    client.count = 1;
    client.reset = now + windowMs;
    return { success: true, count: 1, reset: client.reset };
  }

  client.count++;
  if (client.count > limit) {
    return { success: false, count: client.count, reset: client.reset };
  }

  return { success: true, count: client.count, reset: client.reset };
}
