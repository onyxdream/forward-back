import { NotFoundError } from "../../utils/errors";
import { CreateHabit, UpdateHabit } from "./habit.model";
import repo from "./habit.repo";

const create = async (userId: string, schema: CreateHabit) => {
  const result = await repo.create(userId, schema);
  return result;
};

const update = async (userId: string, habitId: string, schema: UpdateHabit) => {
  const result = await repo.update(userId, habitId, schema);
  return result;
};

const read = async (userId: string, habitId: string) => {
  const result = await repo.getById(userId, habitId);

  if (!result) throw new NotFoundError("Habit not found.");
  return result;
};

const bulkRead = async (userId: string, from: Date, to: Date) => {
  const result = await repo.getAllHabits(
    userId,
    from.toISOString(),
    to.toISOString()
  );
  return result;
};

const deleteHabit = async (userId: string, habitId: string) => {
  await repo.remove(userId, habitId);
};

export default {
  create,
  update,
  read,
  bulkRead,
  deleteHabit,
};
