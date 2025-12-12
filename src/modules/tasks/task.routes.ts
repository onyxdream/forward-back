import { Router, RequestHandler } from "express";
import taskController from "./task.controller";
import { validateBody } from "../../utils/validate";
import {
  bulkGetInputSchema,
  createTaskSchema,
  updateTaskSchema,
} from "./task.model";

export const taskRoutes = Router();

// CRUD: Create, Read, Update, Delete
taskRoutes.post(
  "/",
  validateBody(createTaskSchema),
  taskController.create as RequestHandler
);
taskRoutes.get("/:id", taskController.getById as RequestHandler);
taskRoutes.get(
  "/",
  //validateBody(bulkGetInputSchema),
  taskController.getAll as RequestHandler
);
taskRoutes.put(
  "/:id",
  validateBody(updateTaskSchema),
  taskController.update as RequestHandler
);
taskRoutes.delete("/:id", taskController.remove as RequestHandler);
