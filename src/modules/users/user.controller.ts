// handles web stuff
import { NextFunction, Request, Response } from "express";
import * as userService from "./user.service";
import { UpdateUserModel } from "./user.model";
import { BadRequestError, ForbiddenError } from "../../utils/errors";
import { findById } from "./user.repository";

/**
 * Retrieves a user's profile information.
 * @param req - Express request object containing:
 *   - `req.user.id` - The authenticated user's ID
 *   - `req.user.admin` - Admin flag indicating if user has admin privileges
 *   - `req.params.id` - The target user's ID to retrieve
 * @param res - Express response object
 *
 * @throws {ForbiddenError} When authenticated user ID is missing
 * @throws {BadRequestError} When target user ID is missing
 * @throws {ForbiddenError} When non-admin user attempts to access another user's profile
 *
 * @returns Promise that resolves with HTTP 200 and the user object
 */
export async function getUserById(req: Request, res: Response) {
  const { id: targetId } = req.params;
  const authUserId = req.user?.id;

  if (!authUserId) throw new ForbiddenError("Missing authenticated user id");

  if (!targetId) throw new BadRequestError("Missing target user id");

  if (authUserId !== targetId && !req.user?.admin)
    throw new ForbiddenError("Cannot access another user's profile");

  const user = await userService.getById(targetId);

  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json(user);
}

/**
 * Updates a user's profile information.
 *
 * @remarks
 * This function handles user profile updates with the following restrictions:
 * - Users can only update their own profile unless they have admin privileges
 * - The authenticated user must exist in the request
 * - The target user must exist in the database
 *
 * @param req - Express request object containing:
 *   - `req.user.id` - The authenticated user's ID
 *   - `req.user.admin` - Admin flag indicating if user has admin privileges
 *   - `req.params.id` - The target user's ID to update
 *   - `req.body` - Partial user data to update
 * @param res - Express response object
 *
 * @throws {ForbiddenError} When authenticated user ID is missing
 * @throws {BadRequestError} When target user ID is missing or user not found
 * @throws {ForbiddenError} When non-admin user attempts to update another user's profile
 *
 * @returns Promise that resolves with HTTP 200 and the updated user object
 */
export async function updateUser(req: Request, res: Response) {
  try {
    const authUserId = req.user?.id;

    if (!authUserId) throw new ForbiddenError("Missing authenticated user id");

    const { id } = req.params;

    if (!id) throw new BadRequestError("Missing target user id");

    if (authUserId !== id && !req.user?.admin)
      throw new ForbiddenError("Cannot update another user's profile");

    const userData: Partial<UpdateUserModel> = req.body;

    // check if user exists
    const user = await userService.getById(id);

    if (!user) throw new BadRequestError("User not found");

    const updatedUser = await userService.updateUser(authUserId, id, userData);

    res.status(200).json(updatedUser);
  } catch (error) {
    // In production, avoid revealing internal error messages to clients.
    throw error;
  }
}

/**
 * Deletes a user account.
 *
 * @param req - Express request object containing the target user ID in params and authenticated user info
 * @param res - Express response object
 *
 * @throws {BadRequestError} When the user ID is missing from params or when the user is not found
 * @throws {ForbiddenError} When the authenticated user ID is missing or when a non-admin user attempts to delete another user's account
 *
 * @returns A 204 No Content response on successful deletion
 *
 * @remarks
 * - Only allows users to delete their own account unless they have admin privileges
 * - Requires authentication via req.user
 */
export async function deleteUser(req: Request, res: Response) {
  const { id: targetId } = req.params;
  const authUserId = req.user?.id;

  if (!targetId) throw new BadRequestError("Missing user id");

  if (!authUserId) throw new ForbiddenError("Missing authenticated user id");

  if (authUserId !== targetId && !req.user?.admin)
    throw new ForbiddenError("Cannot delete another user's profile");

  const user = await findById(targetId);

  if (!user) throw new BadRequestError("User not found");

  await userService.deleteUser(authUserId, targetId);

  res.status(204).send();
}
