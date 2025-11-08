import express from "express";
import sqlite from "node:sqlite";
import { initMiddleware } from "./mwHandler";
import cors from "cors";
import morgan from "morgan";

console.clear();

const app = express();
const port = process.env.PORT;

// If running behind a proxy (nginx, Docker, etc.) enable trust proxy so req.ip
// reflects the client IP from X-Forwarded-For. Adjust as needed for your setup.
app.set("trust proxy", true);

app.use(express.json());

// Morgan: add custom tokens for origin and client ip
import morganModule from "morgan";
const morganLogger = morganModule as typeof morgan;
morganLogger.token("origin", (req: any) => req.headers?.origin || "-");
morganLogger.token(
  "client-ip",
  (req: any) => req.ip || req.socket?.remoteAddress || "-"
);

// Combined-ish format with origin and client ip
const logFormat =
  ":client-ip :origin :method :url :status :res[content-length] - :response-time ms";
app.use(morganLogger(logFormat));

// Sanitize FRONTEND value (remove surrounding quotes if present)
const sanitize = (v?: string) => (v ? v.replace(/^['"]|['"]$/g, "") : v);

const allowedOrigins = new Set<string>([
  "http://localhost:8081",
  "http://127.0.0.1:8081",
]);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (native apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

export default app;

initMiddleware();

process.removeAllListeners("warning");

app.listen(port, () => {
  console.log(`\n[+] Server running at http://localhost:${port}`);
});
