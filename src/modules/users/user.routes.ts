// server routes
import { Router, RequestHandler } from "express";
import * as userController from "./user.controller";
import { authGuard } from "../../middleware/authGuard";

export const userRoutes = Router();

userRoutes.get("/:id", userController.getUserById as RequestHandler);
