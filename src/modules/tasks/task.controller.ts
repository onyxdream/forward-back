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
  const taskId = req.params.id;
  const userId = req.user?.id;

  if (!taskId) throw new ForbiddenError("Invalid task id");

  if (!userId) throw new ForbiddenError("Missing authenticated user id");

  const taskData: Task = await taskService.get(userId, taskId);

  res.status(200).json(taskData);
};

const getAll = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const body: BulkGetInput = req.body;

  if (!userId) throw new ForbiddenError("Missing authenticated user id");

  const tasks: BulkTask[] = await taskService.getAll(
    userId,
    body?.from_date,
    body?.to_date
  );

  res.status(200).json(tasks);
};

const update = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const taskId = req.params.id;
  const alter = req.body;

  if (!taskId) throw new ForbiddenError("Invalid task id");

  if (!userId) throw new ForbiddenError("Missing authenticated user id");

  const updatedTask: Task = await taskService.update(userId, taskId, alter);

  res.status(200).json(updatedTask);
};

const remove = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const taskId = req.params.id;

  if (!taskId) throw new ForbiddenError("Invalid task id");

  if (!userId) throw new ForbiddenError("Missing authenticated user id");

  await taskService.remove(userId, taskId);

  res.status(204).send();
};

export default {
  create,
  getById,
  getAll,
  update,
  remove,
};
