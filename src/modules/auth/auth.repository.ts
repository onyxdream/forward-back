import { query } from "../../config/db";
import { User } from "../users/user.model";

export const queryUserByEmail = async (email: string) => {
  const normalized = email.toLowerCase().trim();
  const { rows } = await query("SELECT * FROM f0_users WHERE email = $1", [
    normalized,
  ]);

  const row: User = rows[0];

  if (!row) return undefined;

  return row;
};

export const createUser = async (
  email: string,
  username: string,
  password_hash: string
) => {
  const { rows } = await query(
    "INSERT INTO f0_users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id, email, username, created_at",
    [email, username, password_hash]
  );

  const userData: User = rows[0];

  return userData;
};
