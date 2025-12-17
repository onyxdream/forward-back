import { Router } from "express";
import controller from "./habit.controller";
import { validateBody } from "../../utils/validate";
import { createHabitSchema, updateHabitSchema } from "./habit.model";

export const habitRoutes = Router();

habitRoutes.post("/", validateBody(createHabitSchema), controller.create);
habitRoutes.get("/:habitId", controller.getHabit);
habitRoutes.get("/", controller.getHabits);
habitRoutes.put(
  "/:habitId",
  validateBody(updateHabitSchema),
  controller.update
);
habitRoutes.delete("/:habitId", controller.deleteHabit);
