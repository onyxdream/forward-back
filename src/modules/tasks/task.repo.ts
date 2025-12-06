import { query } from "../../config/db";
import { CreateTaskSchema, Task, UpdateTaskInput } from "./task.model";

const create = async (userId: string, body: CreateTaskSchema) => {
  const result = await query(
    "INSERT INTO f0_tasks (user_id, name, goal, note, top_task, start, deadline, all_day) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
    [
      userId,
      body.name,
      body.goal,
      body.note,
      body.top_task,
      body.start,
      body.deadline,
      body.all_day,
    ]
  );

  const taskData: Task = result.rows[0];

  return taskData;
};

const getById = async (userId: string, id: number) => {
  const result = await query(
    "SELECT * FROM f0_tasks WHERE id = $1 AND user_id = $2",
    [id, userId]
  );

  const taskData: Task = result.rows[0];

  return taskData;
};

const getAll = async (
  userId: string,
  from_date_iso: string,
  to_date_iso: string
) => {
  const result = await query(
    "SELECT * FROM f0_tasks WHERE user_id = $1 AND start >= $2 AND start <= $3",
    [userId, from_date_iso, to_date_iso]
  );

  const tasks: Task[] = result.rows;

  return tasks;
};

const update = async (userId: string, body: UpdateTaskInput) => {
  const result = await query(
    "UPDATE f0_tasks SET name = COALESCE($2, name), goal = COALESCE($3, goal), note = COALESCE($4, note), top_task = COALESCE($5, top_task), start = COALESCE($6, start), deadline = COALESCE($7, deadline), all_day = COALESCE($8, all_day) WHERE id = $1 AND user_id = $9 RETURNING *",
    [
      body.id,
      body.name,
      body.goal,
      body.note,
      body.top_task,
      body.start,
      body.deadline,
      body.all_day,
      userId,
    ]
  );

  const taskData: Task = result.rows[0];

  return taskData;
};

const remove = async (userId: string, id: number) => {
  await query("DELETE FROM f0_tasks WHERE id = $1 AND user_id = $2", [
    id,
    userId,
  ]);
};

export default {
  create,
  getById,
  getAll,
  update,
  remove,
};
