const { Router } = require("express");
const controller = require("./o.controller");

const objectiveRouter = Router();

objectiveRouter.post("/", controller.createObjective);
objectiveRouter.get("/:objectiveId", controller.getObjective);
objectiveRouter.put("/:objectiveId", controller.updateObjective);
objectiveRouter.delete("/:objectiveId", controller.deleteObjective);
