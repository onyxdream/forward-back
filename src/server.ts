// Brief server bootstrap: create an HTTP server from the Express `app`,
// ensure the DB pool is available, start listening on the configured port,
// and handle shutdown (SIGTERM) gracefully.

import http from "http";
import app from "./app";
import { pool } from "./config/db";
import { env } from "./config/env";

const server = http.createServer(app);

const start = async () => {
  try {
    // Verify DB connectivity before accepting requests. If this fails,
    // we abort startup so the process manager can attempt a restart.
    await pool.connect();

    server.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();

// so the process exits cleanly (useful for container shutdowns / orchestrators).
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => pool.end());
});
