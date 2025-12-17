import Crud from "../../utils/crud";
import { CrudConstructor } from "../../utils/crud/types";
import schema from "./schemas";

export const CrudConstructors: CrudConstructor[] = [
  {
    tableName: "f0_habits",
    endpoint: "/habit",
    schema: schema.habit,
  },
  {
    tableName: "f0_tasks",
    endpoint: "/task",
    schema: schema.task,
  },
  {
    tableName: "f0_objectives",
    endpoint: "/objective",
    schema: schema.objective,
  },
];
