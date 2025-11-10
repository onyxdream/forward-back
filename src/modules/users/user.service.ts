// handles logic
// src/modules/users/user.service.ts
import * as userRepo from "./user.repository";
//import { BadRequestError, NotFoundError } from "../../utils/errors";

export async function getById(id: string) {
  const user = await userRepo.findById(id);
  //if (!user) throw new NotFoundError("User not found");
  return user;
}
