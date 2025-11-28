import { query } from "../../config/db";
import { NotFoundError } from "../../utils/errors";
import { SafeUser, UpdateUserModel, User } from "./user.model";

/**
 * Finds a user by their ID.
 *
 * @param id - The ID of the user to find
 *
 * @returns The user data if found, otherwise undefined
 */
export async function findById(id: string): Promise<SafeUser | undefined> {
  const { rows } = await query(
    "SELECT id, username, email, is_active, premium FROM f0_users WHERE id = $1",
    [id]
  );
  return rows[0];
}

/**
 * Updates a user's information in the database.
 *
 * @param id - The ID of the user to update
 * @param userData - Partial user data to update
 *
 * @throws {NotFoundError} When the user with the specified ID does not exist
 *
 * @returns The updated user data
 */
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
