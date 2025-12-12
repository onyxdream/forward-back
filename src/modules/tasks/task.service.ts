import { NotFoundError } from "../../utils/errors";
import {
  BulkTask,
  createTaskSchema,
  CreateTaskSchema,
  Task,
  UpdateTaskInput,
} from "./task.model";
import taskRepo from "./task.repo";

const get = async (userId: string, taskId: string) => {
  const taskData: Task = await taskRepo.getById(userId, taskId);

  if (!taskData) throw new NotFoundError("Task not found");
  if (taskData.user_id !== userId) throw new NotFoundError("Task not found");

  return taskData;
};

const getAll = async (userId: string, from_date?: Date, to_date?: Date) => {
  const from_date_iso = from_date?.toISOString() || undefined;
  const to_date_iso = to_date?.toISOString() || undefined;

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

const update = async (
  userId: string,
  taskId: string,
  updateTaskSchema: UpdateTaskInput
) => {
  const taskData: Task = await taskRepo.update(
    userId,
    taskId,
    updateTaskSchema
  );

  if (!taskData) throw new NotFoundError("Task not found");

  if (taskData.user_id !== userId)
    throw new NotFoundError("You cannot edit this task");

  return taskData;
};

const remove = async (userId: string, taskId: string) => {
  await taskRepo.remove(userId, taskId);
};

export default {
  get,
  getAll,
  create,
  update,
  remove,
};
