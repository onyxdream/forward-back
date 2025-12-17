import z from "zod";

export const scheduleSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  name: z.string().min(1).max(50),
  created_at: z.number().transform((val) => new Date(val)),
  starts_at: z.number().transform((val) => new Date(val)),
  ends_at: z
    .number()
    .transform((val) => new Date(val))
    .optional(),
});

export const createScheduleSchema = scheduleSchema.omit({
  id: true,
  created_at: true,
  user_id: true,
});

export const updateScheduleSchema = createScheduleSchema.partial();

export type Schedule = z.infer<typeof scheduleSchema>;
export type CreateSchedule = z.infer<typeof createScheduleSchema>;
export type UpdateSchedule = z.infer<typeof updateScheduleSchema>;
