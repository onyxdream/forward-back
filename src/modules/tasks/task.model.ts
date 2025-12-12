import z from "zod";

export const taskSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  name: z.string().min(1).max(50),
  created_at: z.number().transform((val) => new Date(val)),
  note: z.string().max(500).optional(),
  top_task: z.uuid().optional(),
  date: z
    .string()
    .refine((v) => !isNaN(Date.parse(v)), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val)),
  time: z.string().optional(),
  deadline: z
    .number()
    .transform((val) => new Date(val))
    .optional(),
  all_day: z.boolean().default(true),
  progress: z.string().transform((val) => parseFloat(val)),
  goal: z.string().transform((val) => parseFloat(val)),
});

export const createTaskSchema = taskSchema.omit({
  id: true,
  created_at: true,
  user_id: true,
});

export const updateTaskSchema = taskSchema
  .omit({
    id: true,
    created_at: true,
    user_id: true,
  })
  .partial();

export const deleteTaskSchema = z.object({
  id: z.number(),
});

export const bulkGetInputSchema = z.object({
  from_date: z.date().optional(),
  to_date: z.date().optional(),
});

export const bulkTaskSchema = taskSchema.omit({
  goal: true,
  all_day: true,
  deadline: true,
  note: true,
  created_at: true,
  user_id: true,
});

export type BulkTask = z.infer<typeof bulkTaskSchema>;
export type BulkGetInput = z.infer<typeof bulkGetInputSchema>;
export type Task = z.infer<typeof taskSchema>;
export type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
