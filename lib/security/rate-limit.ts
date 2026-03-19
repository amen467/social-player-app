import type { NextRequest } from "next/server";

type Bucket = {
  count: number;
  windowStart: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
const maxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 120);

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const firstForwardedIp = forwarded?.split(",")[0]?.trim();

  if (firstForwardedIp) {
    return firstForwardedIp;
  }

  const realIp = request.headers.get("x-real-ip");

  if (realIp) {
    return realIp;
  }

  return "unknown";
}

function maybeCleanup(now: number) {
  if (buckets.size < 5_000) {
    return;
  }

  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart > windowMs) {
      buckets.delete(key);
    }
  }
}

export function rateLimitByIp(request: NextRequest): RateLimitResult {
  const now = Date.now();
  maybeCleanup(now);

  const key = getClientIp(request);
  const existingBucket = buckets.get(key);

  if (!existingBucket || now - existingBucket.windowStart >= windowMs) {
    buckets.set(key, { count: 1, windowStart: now });

    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt: now + windowMs,
    };
  }

  existingBucket.count += 1;

  if (existingBucket.count > maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existingBucket.windowStart + windowMs,
    };
  }

  return {
    allowed: true,
    remaining: maxRequests - existingBucket.count,
    resetAt: existingBucket.windowStart + windowMs,
  };
}
