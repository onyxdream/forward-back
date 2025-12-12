import { query } from "../../config/db";
import { CreateTaskSchema, Task, UpdateTaskInput } from "./task.model";

const create = async (userId: string, body: CreateTaskSchema) => {
  const result = await query(
    "INSERT INTO f0_tasks (user_id, name, goal, note, top_task, date, time, deadline, all_day) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
    [
      userId,
      body.name,
      body.goal,
      body.note,
      body.top_task,
      body.date,
      body.time,
      body.deadline,
      body.all_day,
    ]
  );

  const taskData: Task = result.rows[0];

  return taskData;
};

const getById = async (userId: string, taskId: string) => {
  const result = await query(
    "SELECT * FROM f0_tasks WHERE id = $1 AND user_id = $2",
    [taskId, userId]
  );

  const taskData: Task = result.rows[0];

  return taskData;
};

const getAll = async (
  userId: string,
  from_date_iso?: string,
  to_date_iso?: string
) => {
  let queryStr: string = "SELECT * FROM f0_tasks WHERE user_id = $1";
  let parameters = [userId];

  if (from_date_iso) {
    queryStr += " AND start >= $2";
    parameters.push(from_date_iso);
  }
  if (to_date_iso) {
    queryStr += from_date_iso ? " AND start <= $3" : " AND start <= $2";
    parameters.push(to_date_iso);
  }

  const result = await query(queryStr, [userId]);

  const tasks: Task[] = result.rows;

  return tasks;
};

const update = async (
  userId: string,
  taskId: string,
  body: UpdateTaskInput
) => {
  const result = await query(
    "UPDATE f0_tasks SET name = COALESCE($2, name), goal = COALESCE($3, goal), note = COALESCE($4, note), top_task = COALESCE($5, top_task), date = COALESCE($6, date), time = COALESCE($7, time), deadline = COALESCE($8, deadline), all_day = COALESCE($9, all_day), progress = COALESCE($10, progress) WHERE id = $1 AND user_id = $11 RETURNING *",
    [
      taskId,
      body.name,
      body.goal,
      body.note,
      body.top_task,
      body.date,
      body.time,
      body.deadline,
      body.all_day,
      body.progress,
      userId,
    ]
  );

  const taskData: Task = result.rows[0];

  return taskData;
};

const remove = async (userId: string, id: string) => {
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
