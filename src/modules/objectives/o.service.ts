import { CreateObjectiveSchema, UpdateObjectiveInput } from "./o.model";
import repo from "./o.repo";

const create = async (userId: string, schema: CreateObjectiveSchema) => {
  const result = await repo.create(userId, schema);
  return result;
};

const read = async (objectiveId: string, user_id: string) => {
  const result = await repo.read(objectiveId, user_id);
  return result;
};

const update = async (
  objectiveId: string,
  userId: string,
  input: UpdateObjectiveInput
) => {
  const result = await repo.update(objectiveId, userId, input);
  return result;
};

const remove = async (objectiveId: string, userId: string) => {
  return await repo.remove(objectiveId, userId);
};

export default {
  create,
  read,
  update,
  remove,
};
