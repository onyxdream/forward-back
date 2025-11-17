import { Router, RequestHandler } from "express";
import { login, register } from "./auth.controller";

export const authRoutes = Router();

authRoutes.post("/login", login as RequestHandler);
authRoutes.post("/register", register as RequestHandler);
