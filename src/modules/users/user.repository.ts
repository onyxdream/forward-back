import { query } from "../../config/db";
import { UpdateUserModel, User } from "./user.model";

export async function findById(id: string) {
  const { rows } = await query(
    "SELECT id, username, email FROM f0_users WHERE id = $1",
    [id]
  );
  return rows[0];
}

export async function updateUser(
  id: string,
  userData: Partial<UpdateUserModel>
) {
  const { rows } = await query(
    "UPDATE f0_users SET username = COALESCE($1, username), email = COALESCE($2, email), is_active = COALESCE($3, is_active), premium = COALESCE($4, premium) WHERE id = $6 RETURNING id, username, email, is_active, premium",
    [
      userData.username,
      userData.email,
      userData.is_active,
      userData.premium,
      id,
    ]
  );

  const result: Partial<User> = rows[0];

  return result;
}

export async function deleteUser(id: string) {
  await query("UPDATE f0_users SET is_active = false WHERE id = $1", [id]);
}
