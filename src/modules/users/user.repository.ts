import { query } from "../../config/db";

export async function findById(id: string) {
  const { rows } = await query(
    "SELECT id, username, email FROM f0_users WHERE id = $1",
    [id]
  );
  return rows[0];
}
