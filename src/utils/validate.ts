import { NextFunction, Request, RequestHandler, Response } from "express";
import { BadRequestError } from "./errors";
import { ZodSchema, treeifyError } from "zod";
import jwt from "jsonwebtoken";

/**
 * Middleware factory that validates the request body against a Zod schema.
 * If validation succeeds, the parsed (and potentially coerced) data replaces req.body.
 * If validation fails, a BadRequestError is thrown to be handled by error middleware.
 *
 * @param schema - Zod schema used to validate req.body
 * @returns Express request handler that validates req.body
 */
export const validateBody =
  (schema: ZodSchema<any>): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    // Attempt to parse and validate the incoming request body
    const result = schema.safeParse(req.body);

    // If validation fails, throw a BadRequestError (handled by central error handler)
    if (!result.success) {
      // In development, log validation errors for debugging
      if (process.env.NODE_ENV !== "production") {
        console.error("Validation failed:", treeifyError(result.error));
      }
      throw new BadRequestError("Invalid request body");
    }

    // Replace the raw body with the parsed/validated data to ensure downstream code
    // receives correctly typed and validated input
    req.body = result.data;
    next();
  };
