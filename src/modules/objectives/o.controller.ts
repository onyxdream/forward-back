import { Request, Response } from "express";
import service from "./o.service";
import { ForbiddenError } from "../../utils/errors";

const createObjective = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const body = req.body;

  if (!userId) throw new ForbiddenError("User not authenticated");

  const result = await service.create(userId, body);

  res.status(201).json(result);
};

const getObjective = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { objectiveId } = req.params;

  if (!userId) throw new ForbiddenError("User not authenticated");

  const result = await service.read(objectiveId, userId);

  res.status(200).json(result);
};

const updateObjective = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const body = req.body;
  const { objectiveId } = req.params;

  if (!userId) throw new ForbiddenError("User not authenticated");

  const result = await service.update(objectiveId, userId, body);

  res.status(200).json(result);
};

const deleteObjective = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { objectiveId } = req.params;

  if (!userId) throw new ForbiddenError("User not authenticated");

  await service.remove(objectiveId, userId);

  res.status(204).send();
};

export default {
  createObjective,
  getObjective,
  updateObjective,
  deleteObjective,
};
