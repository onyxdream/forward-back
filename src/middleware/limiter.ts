import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import IORedis from "ioredis";
import { Request } from "express";
import jwt from "jsonwebtoken";

// Rate limiter module
// - Provides a general-purpose per-IP limiter and a tighter auth-specific
//   limiter keyed by IP+identifier (email/username).
// - Uses Redis as an optional distributed store when `REDIS_URL` is set.
// - Configuration is environment-driven so you can tune limits per deployment.

// Environment-driven defaults
const DEFAULT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const DEFAULT_MAX = 100;
const DEFAULT_AUTH_WINDOW_MS = 20 * 60 * 1000; // 20 minutes
const DEFAULT_AUTH_MAX = 5;

// Parse env overrides (fall back to defaults)
const windowMs =
  parseInt(process.env.RATE_LIMIT_WINDOW_MS || "", 10) || DEFAULT_WINDOW_MS;
const max = parseInt(process.env.RATE_LIMIT_MAX || "", 10) || DEFAULT_MAX;
const authWindowMs =
  parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || "", 10) ||
  DEFAULT_AUTH_WINDOW_MS;
const authMax =
  parseInt(process.env.AUTH_RATE_LIMIT_MAX || "", 10) || DEFAULT_AUTH_MAX;

// Optional Redis backing so rate limits are shared across instances.
// Set `REDIS_URL` to enable a distributed rate-limit store. Example:
//   REDIS_URL=redis://:password@redis-host:6379
// When unset, the limiter falls back to an in-memory store (process-local).
const redisUrl = process.env.REDIS_URL;
let redisClient: IORedis | undefined;
let store: any = undefined;

if (redisUrl) {
  // Create a Redis client and wire it to the rate-limit Redis store.
  redisClient = new IORedis(redisUrl);
  store = new RedisStore({
    // rate-limit-redis expects a sendCommand function compatible with ioredis
    sendCommand: (...args: any[]) => (redisClient as any).call(...args),
  });
} else {
  // No Redis configured — rate-limit will fall back to the default memory store.
  // This is acceptable for single-instance dev setups but not for production
  // horizontally scaled deployments.
  console.warn(
    "Rate limiter: REDIS_URL not set, using in-memory store (not suitable for multi-instance deployments)"
  );
}

// Helper: consistent JSON handler when limit is exceeded. Logs the event and
// returns a predictable JSON payload so clients can handle 429s uniformly.
// Avoids sending HTML responses so REST clients always get JSON on 429.
// Note: we intentionally do NOT include request body or headers in logs to
// prevent accidental leakage of sensitive data (like passwords).
const defaultHandler =
  (message = "Too many requests, please try again later") =>
  (req: any, res: any) => {
    console.warn("Rate limit exceeded", { ip: req.ip, path: req.path });
    res.status(429).json({ success: false, message });
  };

// Key generator: builds a unique key per request for rate-limiting.
const keyGenerator = (req: Request) => {
  // Prefer req.ip; fall back to x-forwarded-for if behind proxies (ensure
  // your proxy sets trust proxy appropriately in Express).
  const ip = ipKeyGenerator(req.ip || "unknown");

  // Normalize identifier: lowercased, trimmed string from body (email/username)
  const auth = req.headers?.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : null;

  if (token) {
    const decoded = jwt.decode(token) as { id: string } | null;
    const id = decoded?.id;

    if (id) return `${ip}:${id}`;
  }

  return `${ip}:no-ident`;
};

// Skip rate-limiting for whitelisted IPs (comma-separated env variable).
// Useful for health checks or internal services that must not be throttled.
// Example: RATE_LIMIT_WHITELIST_IPS=127.0.0.1,10.0.0.5
const skipIfWhitelisted = (req: any) => {
  const whitelist = (process.env.RATE_LIMIT_WHITELIST_IPS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!whitelist.length) return false;
  return whitelist.includes(req.ip);
};

// General-purpose limiter (per-IP). Attach this globally to protect
// general endpoints from abuse.
/**
 * General-purpose limiter
 * Usage: apply globally to protect most endpoints from abuse.
 * Example: `app.use(limiter)`
 *
 * Behavior:
 *  - Limits requests per IP (or store key) to `max` within `windowMs`.
 *  - When Redis is configured, limits are shared across instances.
 */
export const limiter = rateLimit({
  windowMs,
  max,
  store,
  standardHeaders: true,
  legacyHeaders: false,
  handler: defaultHandler(),
  keyGenerator,
  skip: skipIfWhitelisted,
});

// Auth-specific limiter: key on IP + normalized email/username (if present)
// to slow both IP-based and targeted credential-guessing attacks.
/**
 * Auth-specific limiter
 * Usage: apply to authentication routes like POST /auth/login
 * Example: `router.post('/login', authLimiter, loginHandler)`
 *
 * Notes on key generation:
 *  - We build a composite key `${ip}:${identifier}` where `identifier` is the
 *    normalized email or username from `req.body` when available.
 *  - This allows throttling to apply per (IP, account) pair instead of
 *    strictly per-IP which helps reduce collateral blocking behind NATs.
 */
export const authLimiter = rateLimit({
  windowMs: authWindowMs,
  max: authMax,
  store,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  handler: defaultHandler("Too many authentication attempts, try again later"),
  skip: skipIfWhitelisted,
});

// Keep `tightLimiter` name for compatibility (alias to authLimiter)
export const tightLimiter = authLimiter;
