// server routes
import { Router, RequestHandler } from "express";
import * as userController from "./user.controller";
import { updateUserModel } from "./user.model";
import { validateBody } from "../../utils/validate";

export const userRoutes = Router();

// To specify an specific user that doesn't match with the token's owner, you need admin rights.

// get
userRoutes.get("/", userController.getUserById as RequestHandler);
userRoutes.get("/:id", userController.getUserById as RequestHandler);

// update
userRoutes.put(
  "/",
  validateBody(updateUserModel),
  userController.updateUser as RequestHandler
);
userRoutes.put(
  "/:id",
  validateBody(updateUserModel),
  userController.updateUser as RequestHandler
);

// delete
userRoutes.delete("/", userController.deleteUser as RequestHandler);
userRoutes.delete("/:id", userController.deleteUser as RequestHandler);
