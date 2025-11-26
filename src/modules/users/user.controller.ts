// handles web stuff
import { NextFunction, Request, Response } from "express";
import * as userService from "./user.service";
import { UpdateUserModel } from "./user.model";
import { BadRequestError, ForbiddenError } from "../../utils/errors";

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id: targetId } = req.params;
    const authUserId = req.user?.id;

    if (!authUserId) throw new ForbiddenError("Missing authenticated user id");

    if (!targetId) throw new BadRequestError("Missing target user id");

    if (authUserId !== targetId && !req.user?.admin)
      throw new ForbiddenError("Cannot access another user's profile");

    const user = await userService.getById(targetId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    throw error;
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const authUserId = req.user?.id;

    if (!authUserId) throw new ForbiddenError("Missing authenticated user id");

    const { id } = req.params;

    if (!id) throw new BadRequestError("Missing target user id");

    if (authUserId !== id && !req.user?.admin)
      throw new ForbiddenError("Cannot update another user's profile");

    const userData: Partial<UpdateUserModel> = req.body;

    const updatedUser = await userService.updateUser(id, userData);
    res.status(200).json(updatedUser);
  } catch (error) {
    // In production, avoid revealing internal error messages to clients.
    throw error;
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const { id: targetId } = req.params;
    const authUserId = req.user?.id;

    if (!targetId) throw new BadRequestError("Missing user id");

    if (!authUserId) throw new ForbiddenError("Missing authenticated user id");

    if (authUserId !== targetId && !req.user?.admin)
      throw new ForbiddenError("Cannot delete another user's profile");

    await userService.deleteUser(targetId);
  } catch (error) {
    // In production, avoid revealing internal error messages to clients.
    throw error;
  }
}
