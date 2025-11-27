// handles logic
// src/modules/users/user.service.ts
import Audit from "../../utils/logs";
import { UpdateUserModel } from "./user.model";
import * as userRepo from "./user.repository";
import { emailSanitize } from "./user.utils";
//import { BadRequestError, NotFoundError } from "../../utils/errors";

export async function getById(id: string) {
  const user = await userRepo.findById(id);

  return user;
}

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

export async function deleteUser(actorId: string, id: string) {
  await userRepo.deleteUser(id);

  Audit.log({
    action: "DeleteUser",
    actorId,
    targetId: id,
  });
}
