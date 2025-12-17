import z from "zod";
import { CrudModel } from "../types";

export const createCrudModel = <T>(schema: z.ZodObject): CrudModel => {
  const createSchema = schema.omit({
    id: true,
    created_at: true,
    user_id: true,
  });

  const updateSchema = createSchema.partial();

  return {
    schema,
    createSchema,
    updateSchema,
  };
};
