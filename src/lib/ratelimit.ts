// Simple in-memory rate limiter (swap to Upstash in prod)
type Bucket = { count: number; reset: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now > b.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }
  if (b.count >= limit) {
    return { success: false, remaining: 0, retryAfter: Math.ceil((b.reset - now)/1000) };
  }
  b.count++;
  return { success: true, remaining: limit - b.count };
}

export function getClientIp(req: Request) {
  const fwd = (req.headers as any).get?.('x-forwarded-for') || '';
  return fwd.split(',')[0] || 'local';
}
