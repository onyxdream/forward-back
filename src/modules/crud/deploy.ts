import Crud from "../../utils/crud";
import { CrudConstructors } from "./constructors";
import { Express } from "express";

export default (app: Express, middleware: any[]) => {
  console.log("[*] Deploying CRUD modules...");
  for (const c of CrudConstructors) {
    try {
      const crud = new Crud(c);
      app.use(crud.endpoint, ...middleware, crud.routes);
      console.log(`    + ${crud.endpoint}`);
    } catch (error) {
      console.error(
        `[!] Failed to deploy CRUD module at endpoint: ${c.endpoint}`
      );
      console.error(error);
    }
  }
};
