import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

interface AppError extends Error {
  status?: number;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.status || 500;
  const isProd = env.NODE_ENV === "production";

  const payload = {
    success: false,
    message: err.message || "Internal Server Error",
    ...(isProd ? {} : { stack: err.stack }),
  };

  console.error(`[${req.method} ${req.url}] -> ${status}: ${err.message}`);

  res.status(status).json(payload);
}

