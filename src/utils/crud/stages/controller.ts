import { ForbiddenError } from "../../errors";
import { CrudController, CrudModel, CrudService } from "../types";
import { Request, Response } from "express";

export const createController = (
  service: CrudService,
  model: CrudModel
): CrudController => {
  const create = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) throw new ForbiddenError("Missing valid user authentication.");

    const newItem = await service.create(userId, req.body);

    res.status(201).json(newItem);
  };

  const getById = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const itemId = req.params.id;

    if (!userId) throw new ForbiddenError("Missing valid user authentication.");

    const item = await service.getById(userId, itemId);

    res.status(200).json(item);
  };

  const getByUserId = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ForbiddenError("Missing valid user authentication.");

    const items = await service.getByUserId(userId);
    res.status(200).json(items);
  };

  const update = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const itemId = req.params.id;

    if (!userId) throw new ForbiddenError("Missing valid user authentication.");

    const updatedItem = await service.update(userId, itemId, req.body);

    res.status(200).json(updatedItem);
  };

  const remove = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const itemId = req.params.id;
    if (!userId) throw new ForbiddenError("Missing valid user authentication.");

    await service.remove(userId, itemId);

    res.status(204).send();
  };

  return {
    create,
    getById,
    getByUserId,
    update,
    remove,
  };
};
