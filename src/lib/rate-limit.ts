import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export interface Limiter {
  allow(key: string): Promise<boolean>;
}

const LIMIT = 5;
const WINDOW_SECONDS = 600;

export function createMemoryLimiter(
  limit = LIMIT,
  windowMs = WINDOW_SECONDS * 1000,
): Limiter {
  const hits = new Map<string, number[]>();
  return {
    async allow(key) {
      const now = Date.now();
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      hits.set(key, [...recent, now]);
      return true;
    },
  };
}

export function createUpstashLimiter(url: string, token: string): Limiter {
  const limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(LIMIT, `${WINDOW_SECONDS} s`),
    prefix: 'contact',
  });
  return { allow: async (key) => (await limiter.limit(key)).success };
}
