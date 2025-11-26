import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { queryUserByEmail } from "./auth.repository";
import bcrypt from "bcrypt";
import { BadRequestError, ValidationError } from "../../utils/errors";
import { ZodSchema } from "zod";
import { NextFunction, Request, RequestHandler, Response } from "express";

// Authentication helpers – small service that issues JWTs for authenticated
// users. Keeping token creation here centralizes signing behavior and makes
// testing easier.
export const generateToken = (userId: string, admin = false) => {
  // Create a signed JWT that contains the user id as the payload. The
  // signing secret and token expiration are pulled from the validated
  // `env` module so they are guaranteed to exist at runtime.
  return jwt.sign({ id: userId, admin }, env.JWT_SECRET as jwt.Secret, {
    expiresIn: env.TOKEN_EXPIRATION as jwt.SignOptions["expiresIn"],
  });
};

export const findUserByEmail = async (email: string) => {
  const userData = await queryUserByEmail(email);
  // Simple repository wrapper: returns the user row (or undefined) for the
  // provided email. Callers should not return the raw row to clients as it
  // may contain sensitive fields like `password_hash`.
  return userData;
};

export const validatePassword = async (
  plainTextPassword: string,
  hashedPassword: string
) => {
  // Compare a plaintext password with the stored bcrypt hash. Returns a
  // boolean indicating whether the password matches. Keep this function
  // async to allow easy mocking in tests.
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const hashPassword = async (password: string) => {
  const saltRounds = env.PASSWORD_SALT_ROUNDS;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  // Hash a plaintext password using bcrypt with the configured salt rounds.
  return hashedPassword;
};

/**
 * Verifies a JSON Web Token and returns its decoded payload or a ValidationError.
 *
 * Attempts to verify the provided JWT using the configured secret. If verification
 * succeeds, the decoded payload (which may be an object or a string) is returned.
 * If verification fails because the token has expired, a ValidationError with the
 * message "Token has expired" is returned. For any other verification failure
 * (malformed token, wrong signature, etc.), a ValidationError with the message
 * "Token invalid" is returned.
 *
 * Note: This function catches verification errors and returns ValidationError
 * instances instead of throwing them.
 *
 * @param token - The JWT string to validate.
 * @returns The decoded token payload on success (e.g. JwtPayload | string), or a ValidationError describing the failure.
 */
export const validateToken = (token: string) => {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET as jwt.Secret);

    return payload;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      // Token is syntactically valid but has expired.
      return new ValidationError("Token has expired");
    }
    // Token is malformed, signed with the wrong key, or otherwise invalid.
    return new ValidationError("Token invalid");
  }
};

export const validateBody =
  (schema: ZodSchema<any>): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) throw new BadRequestError("Invalid request body");

    req.body = result.data;
    next();
  };
