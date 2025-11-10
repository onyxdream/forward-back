// Minimal PostgreSQL client setup using `pg` Pool.
// This module exports a single `query` helper so other parts of the
// application can run parameterized SQL without managing connections.

import { Pool } from "pg";

// Create a connection pool. `connectionString` is taken from the
// `DATABASE_URL` environment variable (expected to be set by the runtime).
// `ssl.rejectUnauthorized: false` is commonly used when connecting to some
// managed Postgres providers that require SSL but provide certificates that
// aren't verifiable against system CAs. Review for your environment and
// enable proper certificate verification in production if possible.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Log when a new client connects (helps during development).
pool.on("connect", () => {
  console.log("[+] Connected to PostgreSQL database");
});

// Surface connection errors to the process logs so they can be observed.
pool.on("error", (err) => console.error("[-] PostgreSQL client error", err));

// Lightweight wrapper that forwards to the pool's `query` method. It keeps
// call sites simple: `await query('SELECT * FROM users WHERE id = $1', [id])`.
export const query = (text: string, params?: any[]) => pool.query(text, params);
