import z from "zod";
import { CrudModel, CrudRepository, CrudService } from "../types";
import { NotFoundError } from "../../errors";

export const createService = (
  repository: CrudRepository,
  model: CrudModel
): CrudService => {
  type SchemaType = z.infer<typeof model.schema>;
  type UpdateSchemaType = z.infer<typeof model.updateSchema>;
  type CreateSchemaType = z.infer<typeof model.createSchema>;

  const create = async (user_id: string, id: string) => {
    const result = await repository.create(user_id, id);
    return result;
  };

  const update = async (
    user_id: string,
    id: string,
    data: UpdateSchemaType
  ) => {
    const result = await repository.update(user_id, id, data);
    return result;
  };

  const getById = async (user_id: string, id: string) => {
    const result = await repository.getById(user_id, id);

    if (!result) throw new NotFoundError("Not found.");

    return result;
  };

  const getByUserId = async (user_id: string) => {
    const result = await repository.getByUserId(user_id);
    return result;
  };

  const remove = async (user_id: string, id: string) => {
    const result = await repository.remove(user_id, id);
    return result;
  };

  return {
    create,
    update,
    getById,
    getByUserId,
    remove,
  };
};
