import { CreateSchedule, UpdateSchedule } from "./sch.model";
import repo from "./sch.repo";

const create = async (user_id: string, schedule: CreateSchedule) => {
  const result = await repo.create(user_id, schedule);
  return result;
};

const getByUserId = async (user_id: string) => {
  const result = await repo.getByUserId(user_id);
  return result;
};

const getById = async (user_id: string, scheduleId: string) => {
  const result = await repo.readById(user_id, scheduleId);
  return result;
};

const update = async (
  user_id: string,
  scheduleId: string,
  schedule: UpdateSchedule
) => {
  const result = await repo.update(user_id, scheduleId, schedule);
  return result;
};

const remove = async (user_id: string, scheduleId: string) => {
  const result = await repo.remove(user_id, scheduleId);
  return result;
};

export default {
  create,
  getByUserId,
  getById,
  update,
  remove,
};
