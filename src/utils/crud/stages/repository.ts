import z from "zod";
import { CrudModel, CrudRepository } from "../types";
import { query } from "../../../config/db";

export const createCrudRepository = <T>(
  tableName: string,
  model: CrudModel
): CrudRepository => {
  type SchemaType = z.infer<typeof model.schema>;
  type UpdateSchemaType = z.infer<typeof model.updateSchema>;
  type CreateSchemaType = z.infer<typeof model.createSchema>;

  function coalesceWithSchema<T>(input: any, schema: z.ZodObject<any>) {
    const parsedSchema = schema.shape; // Get the schema's shape

    const coalescedObject: Record<string, any> = {};

    for (const key in parsedSchema) {
      coalescedObject[key] = key in input ? input[key] : null; // Set to input value or null
    }

    return coalescedObject as typeof schema; // Cast to expected type
  }

  const createQuery =
    "INSERT INTO " +
    tableName +
    " (user_id, " +
    Object.keys(model.createSchema.shape).join(", ") +
    ")" +
    " VALUES ($1, " +
    Object.keys(model.createSchema.shape)
      .map((_, i) => "$" + (i + 2))
      .join(", ") +
    ") RETURNING *;";

  const updateQuery =
    "UPDATE " +
    tableName +
    " SET " +
    Object.keys(model.updateSchema.shape)
      .map((key, i) => key + " = COALESCE($" + (i + 1) + ", " + key + ")")
      .join(", ") +
    " WHERE id = $" +
    (Object.keys(model.updateSchema.shape).length + 1) +
    " AND user_id = $" +
    (Object.keys(model.updateSchema.shape).length + 2) +
    " RETURNING *;";

  const deleteQuery =
    "DELETE FROM " + tableName + " WHERE id = $1 AND user_id = $2;";
  const getByIdQuery =
    "SELECT * FROM " + tableName + " WHERE id = $1 AND user_id = $2;";
  const getAllQuery = "SELECT * FROM " + tableName + " WHERE user_id = $1;";

  const create = async (user_id: string, data: CreateSchemaType) => {
    const cData = coalesceWithSchema(data, model.createSchema);
    const params = [user_id, ...Object.values(cData)];
    const result = await query(createQuery, params);
    return result.rows[0] as SchemaType;
  };

  const getById = async (user_id: string, id: string) => {
    const result = await query(getByIdQuery, [id, user_id]);
    return result.rows[0] as SchemaType;
  };

  const getByUserId = async (user_id: string) => {
    const result = await query(getAllQuery, [user_id]);
    return result.rows as SchemaType[];
  };

  const update = async (
    user_id: string,
    id: string,
    data: UpdateSchemaType
  ) => {
    const cData = coalesceWithSchema(data, model.updateSchema);
    const params = [...Object.values(cData), id, user_id];
    const result = await query(updateQuery, params);
    return result.rows[0] as SchemaType;
  };

  const remove = async (user_id: string, id: string) => {
    await query(deleteQuery, [id, user_id]);
  };

  return {
    create,
    getById,
    getByUserId,
    update,
    remove,
  };
};
