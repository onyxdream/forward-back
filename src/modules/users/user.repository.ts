import { query } from "../../config/db";


export async function findById(id: string) {
  const { rows } = await query("SELECT id, name, email FROM users WHERE id = $1", [id]);
  return rows[0];
}