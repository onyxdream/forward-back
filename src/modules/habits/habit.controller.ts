import { Request, Response } from "express";
import { ForbiddenError } from "../../utils/errors";
import service from "./habit.service";

const create = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if( !userId) throw new ForbiddenError( "Missing valid user authentication." );

    const newHabit = await service.create(userId, req.body);

    res.status(201).json(newHabit);
}

const getHabit = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const habitId = req.params.habitId;

    if( !userId) throw new ForbiddenError( "Missing valid user authentication." );

    const habit = await service.read(userId, habitId);

    res.status(200).json(habit);
}

const getHabits = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if( !userId) throw new ForbiddenError( "Missing valid user authentication." );

    const from = req.query.from ? new Date(req.query.from as string) : new Date(0);
    const to = req.query.to ? new Date(req.query.to as string) : new Date();

    const habits = await service.bulkRead(userId, from, to);

    res.status(200).json(habits);
}

const update = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const habitId = req.params.habitId; 

    if( !userId) throw new ForbiddenError( "Missing valid user authentication." );

    const updatedHabit = await service.update(userId, habitId, req.body);

    res.status(200).json(updatedHabit);
}

const deleteHabit = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const habitId = req.params.habitId;

    if( !userId) throw new ForbiddenError( "Missing valid user authentication." );

    await service.deleteHabit(userId, habitId);

    res.status(204).send();
}

export default {
    create,
    getHabit,
    getHabits,
    update,
    deleteHabit,
}