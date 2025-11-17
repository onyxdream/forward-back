// Configuration / environment parsing for the backend.
//
// This module uses `zod` to declare a schema for the expected environment
// variables, validate `process.env` at startup, and coerce/transform values
// where appropriate. Validating environment variables early makes the
// application fail-fast when required configuration is missing or malformed.

import z from "zod"; // zod is a tiny, expressive schema-validation library used here

// Define the expected shape of environment variables using zod's fluent API.
// Each key below corresponds to a variable the app expects to find in
// `process.env` (typically provided by the environment or loaded from a
// `.env` file via a loader like `dotenv` before app boot).
const envSchema = z.object({
  // NODE_ENV controls runtime behavior (logging, debug features, etc.).
  // We restrict allowed values to the common set and default to 'development'
  // when not provided so that local dev is convenient.
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // PORT is provided as a string in `process.env`. We accept a string but
  // transform it to a number using `.transform(...)` so downstream code can
  // work with a typed numeric port. The `.default(3000)` ensures the server
  // will listen on port 3000 if no PORT is supplied.
  // Note: transform runs even when default is used, so the final value is a
  // number in either case.
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default(3000),

  // DATABASE_URL must be a valid URL (e.g. postgres://user:pass@host/db).
  // This is required (no `.default()`), so startup will fail if it's missing
  // or if the value is not a valid URL string.
  DATABASE_URL: z.string().url(),

  // JWT_SECRET is used to sign and verify JSON Web Tokens. We require a
  // strong secret (minimum length 32 here) to avoid weak keys. Because this
  // is sensitive material, keep it out of source control and provide it via
  // your deployment environment (or a secret manager).
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters long"),

  // LOG_LEVEL controls verbosity. Default to 'info' in production-adjacent
  // setups but allow overrides for debugging ('debug') or reduced noise
  // ('warn'/'error').
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),

  // TOKEN_EXPIRATION controls how long issued JWTs are valid.
  TOKEN_EXPIRATION: z.string().default("1h"),
  PASSWORD_SALT_ROUNDS: z.number().default(10),
  DB_SSL: z
    .string()
    .transform((val: string) => val === "true")
    .default(false),
});

// Parse and validate the runtime environment. `envSchema.parse(process.env)`
// will:
//  - pick the keys defined in the schema from `process.env`,
//  - apply transformations (e.g. parseInt for PORT),
//  - fill in defaults when a key is missing, and
//  - throw a descriptive error if a required key is missing or a value
//    doesn't meet its constraints.
//
// Important usage notes:
// 1. If you use a `.env` file locally, ensure you call `require('dotenv').config()`
//    (or equivalent) before importing this module, so `process.env` contains
//    the values from the file.
// 2. Keep secrets (like `JWT_SECRET`) out of version control and prefer
//    environment-specific secret stores (ECS/EKS secrets, GitHub Actions
//    secrets, HashiCorp Vault, etc.) for production deployments.
export const env = envSchema.parse(process.env);

// Optionally, consumers can import `env` and use typed values, e.g.:
//    import { env } from './config/env';
//    console.log(env.PORT, env.NODE_ENV);
// This guarantees the values have been validated and coerced according to the
// schema above.
