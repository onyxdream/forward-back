import { query } from "../../config/db";
import { CreateObjectiveSchema, UpdateObjectiveInput } from "./o.model";

const create = async (userId: string, schema: CreateObjectiveSchema) => {
  const result = await query(
    "INSERT INTO f0_objectives (user_id, title, description, deadline, top_objective) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [
      userId,
      schema.title,
      schema.description || null,
      schema.deadline || null,
      schema.top_objective || null,
    ]
  );

  const objective = result.rows[0];

  return objective;
};

const read = async (objectiveId: string | undefined, user_id: string) => {
  if (!objectiveId) return await readAll(user_id);
  const result = await query(
    "SELECT * FROM f0_bjectives WHERE id = $1 AND user_id = $2",
    [objectiveId, user_id]
  );

  const objective = result.rows[0];

  return objective;
};

const readAll = async (userId: string) => {
  const result = await query(
    "SELECT * FROM f0_objectives WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );

  return result.rows;
};

const update = async (
  objectiveId: string,
  userId: string,
  input: UpdateObjectiveInput
) => {
  const result = await query(
    "UPDATE f0_objectives SET title = COALESCE($1, title), description = COALESCE($2, description), deadline = COALESCE($3, deadline), top_objective = COALESCE($4, top_objective) WHERE id = $5 AND user_id = $6 RETURNING *",
    [
      input.title,
      input.description || null,
      input.deadline || null,
      input.top_objective || null,
      objectiveId,
      userId,
    ]
  );

  const objective = result.rows[0];

  return objective;
};

const remove = (objectiveId: string, userId: string) => {
  return query("DELETE FROM f0_objectives WHERE id = $1 AND user_id = $2", [
    objectiveId,
    userId,
  ]);
};

export default {
  create,
  read,
  update,
  remove,
};
