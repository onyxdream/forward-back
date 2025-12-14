import { Router } from "express";
import controller from "./o.controller";
import { validateBody } from "../../utils/validate";
import { createObjectiveSchema, updateObjectiveSchema } from "./o.model";

export const objectiveRoutes = Router();

objectiveRoutes.post(
  "/",
  validateBody(createObjectiveSchema),
  controller.createObjective
);
objectiveRoutes.get("/:objectiveId", controller.getObjective);
objectiveRoutes.get("/", controller.getObjective);
objectiveRoutes.put(
  "/:objectiveId",
  validateBody(updateObjectiveSchema),
  controller.updateObjective
);
objectiveRoutes.delete("/:objectiveId", controller.deleteObjective);
