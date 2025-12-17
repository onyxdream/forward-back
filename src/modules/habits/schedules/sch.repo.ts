import { query } from "../../../config/db";
import { CreateSchedule } from "./sch.model";

const create = async (user_id: string, schedule: CreateSchedule) => {
  // Implementation for creating a schedule in the database
  const q = `INSERT INTO f0_habit_schedules (user_id, name, starts_at, ends_at) VALUES ($1, $2, $3, $4) RETURNING *`;
  const values = [
    user_id,
    schedule.name,
    schedule.starts_at,
    schedule.ends_at || null,
  ];
  // Execute the query and return the created schedule
  const result = await query(q, values);
  return result.rows[0];
};

const readById = async (user_id: string, id: string) => {
  // Implementation for reading a schedule by ID from the database
  const result = await query(
    "SELECT * FROM f0_habit_schedules WHERE user_id = $1 AND id = $2",
    [user_id, id]
  );
  return result.rows[0];
};

const getByUserId = async (user_id: string) => {
  // Implementation for getting all schedules for a user from the database
  const result = await query(
    "SELECT * FROM f0_habit_schedules WHERE user_id = $1",
    [user_id]
  );
  return result.rows;
};

const update = async (
  user_id: string,
  id: string,
  schedule: Partial<CreateSchedule>
) => {
  // Implementation for updating a schedule in the database
  const result = await query(
    "UPDATE f0_habit_schedules SET name = COALESCE($1, name), starts_at = COALESCE($2, starts_at), ends_at = COALESCE($3, ends_at) WHERE user_id = $4 AND id = $5 RETURNING *",
    [
      schedule.name || null,
      schedule.starts_at || null,
      schedule.ends_at || null,
      user_id,
      id,
    ]
  );
  return result.rows[0];
};

const remove = async (user_id: string, id: string) => {
  // Implementation for deleting a schedule from the database
  await query("DELETE FROM f0_habit_schedules WHERE user_id = $1 AND id = $2", [
    user_id,
    id,
  ]);
};

export default  {
  create,
  readById,
  getByUserId,
  update,
  remove,
};
