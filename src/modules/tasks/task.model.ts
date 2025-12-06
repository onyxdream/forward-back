import z from "zod";

export const taskSchema = z.object({
  id: z.int(),
  user_id: z.uuid(),
  name: z.string().min(1).max(50),
  created_at: z.number().transform((val) => new Date(val)),
  note: z.string().max(500).optional(),
  top_task: z.int().optional(),
  start: z.number().transform((val) => new Date(val)),
  deadline: z
    .number()
    .transform((val) => new Date(val))
    .optional(),
  all_day: z.boolean().default(true),
  progress: z.number().min(0).max(100).default(0),
  goal: z.number().min(0).max(100).default(1),
});

export const createTaskSchema = taskSchema.omit({
  id: true,
  created_at: true,
  user_id: true,
});

export const updateTaskSchema = taskSchema.partial().extend({
  id: z.number(),
});

export const deleteTaskSchema = z.object({
  id: z.number(),
});

export const bulkGetInputSchema = z.object({
  from_date: z.date(),
  to_date: z.date(),
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
