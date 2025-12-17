import z from "zod";

export const habitSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  name: z.string().min(1).max(50),
  created_at: z.number().transform((val) => new Date(val)),
  goal: z.string().transform((val) => parseFloat(val)),
  type: z.number().min(0).max(2).default(0),
  objective: z.uuid().optional(),
});

export const createHabitSchema = habitSchema.omit({
  id: true,
  created_at: true,
  user_id: true,
});

export const updateHabitSchema = createHabitSchema.partial();

export type Habit = z.infer<typeof habitSchema>;
export type CreateHabit = z.infer<typeof createHabitSchema>;
export type UpdateHabit = z.infer<typeof updateHabitSchema>;
