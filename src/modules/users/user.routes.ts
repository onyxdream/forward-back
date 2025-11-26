// server routes
import { Router, RequestHandler } from "express";
import * as userController from "./user.controller";
import { deleteUserModel, updateUserModel } from "./user.model";
import { validateBody } from "../../utils/validate";

export const userRoutes = Router();

userRoutes.get("/:id", userController.getUserById as RequestHandler);
userRoutes.put(
  "/:id",
  validateBody(updateUserModel),
  userController.getUserById as RequestHandler
);
userRoutes.delete(
  "/:id",
  validateBody(deleteUserModel),
  userController.getUserById as RequestHandler
);
