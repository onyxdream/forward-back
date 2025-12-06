import { Request, Response } from "express";
import { BulkGetInput, BulkTask, CreateTaskSchema, Task } from "./task.model";
import { ForbiddenError } from "../../utils/errors";
import taskService from "./task.service";

const create = async (req: Request, res: Response) => {
  const body: CreateTaskSchema = req.body;
  const userId = req.user?.id;

  if (!userId) throw new ForbiddenError("Missing authenticated user id");

  const taskData: Task = await taskService.create(userId, body);

  res.status(201).json(taskData);
};

const getById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const userId = req.user?.id;

  if (!isNaN(id)) throw new ForbiddenError("Invalid task id");

  if (!userId) throw new ForbiddenError("Missing authenticated user id");

  const taskData: Task = await taskService.get(userId, id);

  res.status(200).json(taskData);
};

const getAll = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const body: BulkGetInput = req.body;

  if (!userId) throw new ForbiddenError("Missing authenticated user id");

  const tasks: BulkTask[] = await taskService.getAll(
    userId,
    body.from_date,
    body.to_date
  );

  res.status(200).json(tasks);
};

const update = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const id = Number(req.params.id);
  const body = req.body;

  if (!isNaN(id)) throw new ForbiddenError("Invalid task id");
  if (!userId) throw new ForbiddenError("Missing authenticated user id");

  const updatedTask: Task = await taskService.update(userId, { id, ...body });

  res.status(200).json(updatedTask);
};

const remove = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const id = Number(req.params.id);

  if (!isNaN(id)) throw new ForbiddenError("Invalid task id");

  if (!userId) throw new ForbiddenError("Missing authenticated user id");

  await taskService.remove(userId, id);

  res.status(204).send();
};

export default {
  create,
  getById,
  getAll,
  update,
  remove,
};
