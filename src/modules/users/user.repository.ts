import { query } from "../../config/db";
import { NotFoundError } from "../../utils/errors";
import { SafeUser, UpdateUserModel, User } from "./user.model";

export async function findById(id: string): Promise<SafeUser | undefined> {
  const { rows } = await query(
    "SELECT id, username, email, is_active, premium FROM f0_users WHERE id = $1",
    [id]
  );
  return rows[0];
}

export async function updateUser(
  id: string,
  userData: Partial<UpdateUserModel>
) {
  const { rows } = await query(
    "UPDATE f0_users SET username = COALESCE($2, username), email = COALESCE($3, email), is_active = COALESCE($4, is_active), premium = COALESCE($5, premium) WHERE id = $1 RETURNING id, email, username, is_active, created_at",
    [id, userData.username, userData.email, userData.is_active]
  );

  if (!rows?.[0]) throw new NotFoundError("User not found");

  const result: Partial<User> = rows[0];

  return result;
}

export async function deleteUser(id: string) {
  await query("UPDATE f0_users SET is_active = false WHERE id = $1", [id]);
}
