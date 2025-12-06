import { NotFoundError } from "../../utils/errors";
import {
  BulkTask,
  createTaskSchema,
  CreateTaskSchema,
  Task,
  UpdateTaskInput,
} from "./task.model";
import taskRepo from "./task.repo";

const get = async (userId: string, id: number) => {
  const taskData: Task = await taskRepo.getById(userId, id);

  if (taskData.user_id !== userId) throw new NotFoundError("Task not found");

  if (!taskData) throw new NotFoundError("Task not found");

  return taskData;
};

const getAll = async (userId: string, from_date: Date, to_date: Date) => {
  const from_date_iso = from_date.toISOString();
  const to_date_iso = to_date.toISOString();

  let tasks: BulkTask[] = await taskRepo.getAll(
    userId,
    from_date_iso,
    to_date_iso
  );

  return tasks;
};

const create = async (userId: string, taskSchema: CreateTaskSchema) => {
  const taskData = await taskRepo.create(userId, taskSchema);
  return taskData;
};

const update = async (userId: string, updateTaskSchema: UpdateTaskInput) => {
  const taskData: Task = await taskRepo.update(userId, updateTaskSchema);

  if (!taskData) throw new NotFoundError("Task not found");

  if (taskData.user_id !== userId) throw new NotFoundError("Task not found");
  return taskData;
};

const remove = async (userId: string, id: number) => {
  await taskRepo.remove(userId, id);
};

export default {
  get,
  getAll,
  create,
  update,
  remove,
};
