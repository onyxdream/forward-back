// Brief server bootstrap: create an HTTP server from the Express `app`,
// ensure the DB pool is available, start listening on the configured port,
// and handle shutdown (SIGTERM) gracefully.

import http from "http";
import https from "https";
import app from "./app";
import { pool } from "./config/db";
import { env } from "./config/env";
import fs from "fs";

const port = env.PORT;
const address = env.ADDRESS;

let server: http.Server | https.Server;
const useSSL = env.HTTP_SSL || env.NODE_ENV === "production";
const protocol = useSSL ? "HTTPS" : "HTTP";

// Create either an HTTP or HTTPS server based on configuration.
if (useSSL) {
  const options = {
    ca: fs.readFileSync(env.CA_CERT_PATH),
    key: fs.readFileSync(env.SERVER_KEY_PATH),
    cert: fs.readFileSync(env.SERVER_CERT_PATH),
    requestCert: false,
    rejectUnauthorized: true,
  };
  server = https.createServer(options, app);
} else {
  server = http.createServer(app);
}

const start = async () => {
  try {
    // Verify DB connectivity before accepting requests. If this fails,
    // we abort startup so the process manager can attempt a restart.

    console.log("> Testing database connectivity...");

    const client = await pool.connect();
    client.release();

    console.log("> Starting server...");

    server.listen(port, address);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Log when the server is listening, including whether it's HTTP or HTTPS.
server.once("listening", () => {
  let serverAddress = server.address();

  if (typeof serverAddress !== "string")
    serverAddress = serverAddress?.address || "unknown";

  console.log(
    `[+] ${protocol} server is listening at address ${protocol.toLowerCase()}://${address}:${port}`
  );
});

start();

// so the process exits cleanly (useful for container shutdowns / orchestrators).
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => pool.end());
});

// Handle server errors such as EADDRINUSE
server.on("error", (err) => {
  console.error("Server error:", err);
  process.exit(1);
});
