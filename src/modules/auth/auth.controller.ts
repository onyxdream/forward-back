import { Request, Response } from "express";
import { userLogin, userRegister } from "./auth.service";
import { env } from "../../config/env";
import { LoginInput } from "./auth.model";

// Controller for handling authentication requests.
// Responsibilities:
//  - validate/parse incoming request body (email + password)
//  - call the auth service to perform login
//  - map service results/errors to HTTP responses
export const login = async (req: Request, res: Response) => {
  try {
    // Basic extraction – consider adding request validation middleware
    // (zod/express-validator) to enforce shape and provide nicer errors.
    const { email, password } = req.body as LoginInput;

    // Delegate auth logic to service layer
    const result = await userLogin(email, password);

    // On success, respond with the result (token and user id).
    // NOTE: ensure user-sensitive fields (like password hashes) are not
    // included in the returned object – the service should sanitize.
    res.status(200).json(result);
  } catch (error) {
    // In production, avoid revealing internal error messages to clients.
    if (env.NODE_ENV === "production") {
      console.error("Login error:", (error as Error).message);
      return res.status(400).json({ message: "Invalid credentials" });
    } else {
      // In development, return the actual error message to aid debugging.
      return res.status(400).json({ message: (error as Error).message });
    }
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body as {
      email: string;
      username: string;
      password: string;
    };

    const result = await userRegister(email, username, password);

    res.status(201).json(result);
  } catch (error) {
    if (env.NODE_ENV === "production") {
      console.error("Registration error:", (error as Error).message);
      return res.status(400).json({ message: "Registration failed" });
    } else {
      return res.status(400).json({ message: (error as Error).message });
    }
  }
};
