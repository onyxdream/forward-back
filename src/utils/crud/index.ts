import { z } from "zod";
import { Router } from "express";
import {
  CrudModel,
  CrudRepository,
  CrudService,
  CrudController,
  CrudConstructor,
} from "./types";
import { createCrudModel } from "./stages/model";
import { createCrudRepository } from "./stages/repository";
import { createService } from "./stages/service";
import { createController } from "./stages/controller";
import { createRoutes } from "./stages/routes";

class Crud {
  model: CrudModel;
  repository: CrudRepository;
  service: CrudService;
  controller: CrudController;
  routes: Router;
  tableName: string;
  endpoint: string;

  constructor(c: CrudConstructor) {
    this.tableName = c.tableName;
    this.endpoint = c.endpoint;

    this.model = createCrudModel(c.schema);
    this.repository = createCrudRepository(c.tableName, this.model);
    this.service = createService(this.repository, this.model);
    this.controller = createController(this.service, this.model);
    this.routes = createRoutes(this.controller, this.model);
  }
}

export default Crud;
