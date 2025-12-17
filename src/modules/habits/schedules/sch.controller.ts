import { Request, Response } from "express";
import { ForbiddenError } from "../../../utils/errors";
import service from "./sch.service";

const create = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) throw new ForbiddenError("Missing valid user authentication.");

  const newSchedule = await service.create(userId, req.body);

  res.status(201).json(newSchedule);
};

const getSchedule = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const scheduleId = req.params.scheduleId;

  if (!userId) throw new ForbiddenError("Missing valid user authentication.");

  const schedule = await service.getById(userId, scheduleId);
  res.status(200).json(schedule);
};

const getSchedules = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) throw new ForbiddenError("Missing valid user authentication.");

  const schedules = await service.getByUserId(userId);

  res.status(200).json(schedules);
};

const update = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const scheduleId = req.params.scheduleId;

  if (!userId) throw new ForbiddenError("Missing valid user authentication.");

  const updatedSchedule = await service.update(userId, scheduleId, req.body);
  res.status(200).json(updatedSchedule);
};

const deleteSchedule = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const scheduleId = req.params.scheduleId;

  if (!userId) throw new ForbiddenError("Missing valid user authentication.");

  await service.remove(userId, scheduleId);

  res.status(204).send();
};

export default {
  create,
  getSchedule,
  getSchedules,
  update,
  deleteSchedule,
};
