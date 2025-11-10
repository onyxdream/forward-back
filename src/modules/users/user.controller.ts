// handles web stuff
import { NextFunction, Request, Response } from "express";
import * as userService from "./user.service";

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Missing user id" });

    const user = await userService.getById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}
