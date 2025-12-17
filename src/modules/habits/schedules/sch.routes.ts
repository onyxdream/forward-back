import { Router } from "express";
import controller from "./sch.controller";
import { validateBody } from "../../../utils/validate";
import { createScheduleSchema, updateScheduleSchema } from "./sch.model";

export const scheduleRoutes = Router();
scheduleRoutes.post(
  "/schedule/",
  validateBody(createScheduleSchema),
  controller.create
);
scheduleRoutes.get("/schedule/:scheduleId", controller.getSchedule);
scheduleRoutes.get("/schedule/", controller.getSchedules);
scheduleRoutes.put(
  "/schedule/:scheduleId",
  validateBody(updateScheduleSchema),
  controller.update
);
scheduleRoutes.delete("/schedule/:scheduleId", controller.deleteSchedule);
