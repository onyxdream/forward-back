import { Request, Response } from "express";

// Allow middleware functions that accept (req, res) and may return a value or a Promise.
// We cast to Express RequestHandler when registering so runtime works fine.
export type MiddlewareFunc = (
  req: Request,
  res: Response
) => any | Promise<any>;

export type MiddlewareRecord = Record<string, MiddlewareFunc>;

export type AppMethod = "put" | "get" | "delete" | "post";

export interface SpeedResult {
  speedBps: number;
  speedMbps: number;
  speedKbps: number;
  durationSeconds: number;
  bytes: number;
}
