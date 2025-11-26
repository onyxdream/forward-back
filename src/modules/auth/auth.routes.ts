import { Router, RequestHandler } from "express";
import { login, register } from "./auth.controller";
import { validateBody } from "./auth.utils";
import { loginSchema, registerSchema } from "./auth.model";

export const authRoutes = Router();

authRoutes.post("/login", validateBody(loginSchema), login as RequestHandler);
authRoutes.post(
  "/register",
  validateBody(registerSchema),
  register as RequestHandler
);
