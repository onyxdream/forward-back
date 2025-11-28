// handles logic
// src/modules/users/user.service.ts
import Audit from "../../utils/logs";
import { UpdateUserModel } from "./user.model";
import * as userRepo from "./user.repository";
import { emailSanitize } from "./user.utils";

/**
 * Retrieves a user's profile information by ID.
 *
 * @param id - The ID of the user to retrieve
 *
 * @returns The user data if found, otherwise undefined
 */
export async function getById(id: string) {
  const user = await userRepo.findById(id);

  return user;
}

/**
 * Updates a user's profile information.
 *
 * @param actorId - The ID of the user performing the update
 * @param id - The ID of the user to update
 * @param userData - Partial user data to update
 *
 * @returns The updated user data
 */
export async function updateUser(
  actorId: string,
  id: string,
  userData: Partial<UpdateUserModel>
) {
  const sanitizedUserData: Partial<UpdateUserModel> = {
    ...userData,
    email: userData.email ? emailSanitize(userData.email) : undefined,
  };

  const updatedUser = await userRepo.updateUser(id, sanitizedUserData);

  Audit.log({
    action: "UpdateUser",
    actorId: actorId,
    targetId: id,
  });

  return updatedUser;
}

/**
 * Deactivates a user account.
 *
 * @param actorId - The ID of the user performing the deletion
 * @param id - The ID of the user to deactivate
 *
 * @returns Promise that resolves when the user is deactivated
 */
export async function deleteUser(actorId: string, id: string) {
  await userRepo.deleteUser(id);

  Audit.log({
    action: "DeleteUser",
    actorId,
    targetId: id,
  });
}
