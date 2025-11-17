import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { validateToken } from "../modules/auth/auth.utils";

// Simple Express middleware that protects routes by validating a Bearer JWT
// from the `Authorization` header. On success it attaches the decoded token
// payload to `req.user` and calls `next()`. On failure it returns 401.
export const authGuard = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  // Expect header format: "Authorization: Bearer <token>".
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = env.JWT_SECRET;

    if (!secret) {
      // Defensive: ensure the signing secret is configured.
      throw new Error("JWT_SECRET is not defined");
    }

    // Verify the token signature and decode the payload.
    const decoded = validateToken(token);

    // Attach decoded payload to the request for downstream handlers.
    // We use a type assertion because Express Request has no `user` by
    // default in @types/express. Consumers can cast `req` when needed.
    (req as any).user = decoded;

    next();
  } catch (error) {
    if (env.NODE_ENV === "development") {
      console.error("Auth error:", (error as Error).message);
    } else res.status(401).json({ message: "Invalid token" });
    return;
  }
};
