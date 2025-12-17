import { Router } from "express";
import { validateBody } from "../../validate";
import { CrudController, CrudModel } from "../types";

export const createRoutes = (controller: CrudController, model: CrudModel) => {
  const routes = Router();

  routes.get("/", controller.getByUserId);
  routes.post("/", validateBody(model.createSchema), controller.create);
  routes.get("/:id", controller.getById);
  routes.put("/:id", validateBody(model.updateSchema), controller.update);
  routes.delete("/:id", controller.remove);

  return routes;
};
