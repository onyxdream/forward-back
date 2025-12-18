import z from "zod";
import { CrudModel } from "../types";
import { Mask } from "zod/v4/core/util.cjs";

export const createCrudModel = <T>(schema: z.ZodObject): CrudModel => {
  const omit: Mask<string> = {};

  if ("id" in schema.shape) {
    // @ts-ignore
    omit["id"] = true;
  }

  if ("created_at" in schema.shape) {
    // @ts-ignore
    omit["created_at"] = true;
  }

  if ("user_id" in schema.shape) {
    // @ts-ignore
    omit["user_id"] = true;
  }

  const createSchema = schema.omit(omit);

  const updateSchema = createSchema.partial();

  return {
    schema,
    createSchema,
    updateSchema,
  };
};
