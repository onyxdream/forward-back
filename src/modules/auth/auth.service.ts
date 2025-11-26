import { AuthError } from "../../utils/errors";
import { createUser, queryUserByEmail } from "./auth.repository";
import {
  findUserByEmail,
  generateToken,
  hashPassword,
  validatePassword,
} from "./auth.utils";

// Service responsible for authenticating a user and issuing a token.
// Flow:
//  1. Look up the user by email.
//  2. If not found, fail (controller should map to a generic auth error).
//  3. Validate the provided password against the stored bcrypt hash.
//  4. If valid, generate and return a JWT and the user's id.
//
// Security notes:
//  - Do NOT return the raw `userData` (it contains `password_hash`). The
//    controller should ensure only non-sensitive fields are returned to the
//    client. Avoid distinct error messages for 'not found' vs 'bad
//    password' in production to prevent user enumeration attacks.
export const userLogin = async (email: string, password: string) => {
  try {
    const userData = await findUserByEmail(email);

    if (!userData) throw new AuthError("User not found");

    const isPasswordValid = await validatePassword(
      password,
      userData.password_hash
    );

    if (!isPasswordValid) throw new AuthError("Invalid credentials");

    const token = generateToken(userData.id, userData.admin);

    const { password_hash, ...safeUserData } = userData;

    // Return minimal auth result. The caller should avoid exposing the
    // full user row which contains sensitive fields.
    return { token, user: safeUserData };
  } catch (error) {
    // Re-throw and let controller decide how to present errors to clients.
    throw error;
  }
};

export const userRegister = async (
  email: string,
  username: string,
  password: string
) => {
  try {
    const exists = await queryUserByEmail(email);

    if (exists) throw new AuthError("Email taken");

    const hash = await hashPassword(password);

    const userData = await createUser(email, username, hash);

    return { token: generateToken(email), user: userData };
  } catch (error) {
    throw error;
  }
};
