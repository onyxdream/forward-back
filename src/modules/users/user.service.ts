// handles logic
// src/modules/users/user.service.ts
import { UpdateUserModel } from "./user.model";
import * as userRepo from "./user.repository";
//import { BadRequestError, NotFoundError } from "../../utils/errors";

export async function getById(id: string) {
  const user = await userRepo.findById(id);
  //if (!user) throw new NotFoundError("User not found");
  return user;
}

export async function updateUser(
  id: string,
  userData: Partial<UpdateUserModel>
) {
  const updatedUser = await userRepo.updateUser(id, userData);

  return updatedUser;
}

export async function deleteUser(id: string) {
  await userRepo.deleteUser(id);
}
