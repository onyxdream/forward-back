import { query } from "../../config/db";
import { CreateHabit, UpdateHabit } from "./habit.model";

const create = async (userId: string, schema: CreateHabit) => {
  const q = `
        INSERT INTO f0_habits (user_id, name, goal, objective, type)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;

  const params = [
    userId,
    schema.name,
    schema.goal,
    schema.objective || null,
    schema.type,
  ];
  const result = await query(q, params);

  return result.rows[0];
};

const getAllHabits = async (
  userId: string,
  from_iso: string,
  to_iso: string
) => {
  let str = "SELECT * FROM f0_habits WHERE user_id = $1";

  const params: string[] = [userId];

  if (from_iso) {
    params.push(from_iso);
    str += ` AND created_at >= $${params.length}`;
  }

  if (to_iso) {
    params.push(to_iso);
    str += ` AND created_at <= $${params.length}`;
  }

  const res = await query(str, params);
  return res.rows;
};

const getById = async (userId: string, habitId: string) => {
  const result = await query(
    "SELECT * FROM f0_habits WHERE id = $1 AND user_id = $2",
    [habitId, userId]
  );

  return result.rows[0];
};

const update = async (userId: string, habitId: string, schema: UpdateHabit) => {
  const result = await query(
    "UPDATE f0_habits SET name = COALESCE($1, name), goal = COALESCE($2, goal), objective = COALESCE($3, objective), type = COALESCE($4, type) WHERE id = $5 AND user_id = $6 RETURNING *",
    [schema.name, schema.goal, schema.objective, schema.type, habitId, userId]
  );

  return result.rows[0];
};

const remove = async (userId: string, habitId: string) => {
  await query("DELETE FROM f0_habits WHERE id = $1 AND user_id = $2", [
    habitId,
    userId,
  ]);
};

export default {
  create,
  getAllHabits,
  update,
  getById,
  remove,
};
