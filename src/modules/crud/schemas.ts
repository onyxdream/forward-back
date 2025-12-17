import { z } from "zod";

const habit = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  name: z.string().min(1).max(50),
  created_at: z.number().transform((val) => new Date(val)),
  goal: z.string().transform((val) => parseFloat(val)),
  type: z.number().min(0).max(2).default(0),
  objective: z.uuid().optional(),
});

const task = z.object({
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
  completed: z.boolean().default(false),
});

const objective = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  title: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  created_at: z.number().transform((val) => new Date(val)),
  deadline: z
    .number()
    .transform((v) => new Date(v))
    .optional(),
  top_objective: z.uuid().optional(),
});

const schedule = z.object({
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

const habitTime = z.object({
  id: z.uuid(),
  habit_id: z.uuid(),
  schedule_id: z.uuid(),
  repeat_type: z.enum(["daily", "weekly", "monthly"]),
  repeat_interval: z.number().int().min(1),
  day_of_week: z.array(z.number().int().min(0).max(6)).optional(),
  hour_of_day: z
    .string()
    .refine((val) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
      message: "Invalid time format",
    }),
  created_at: z.number().transform((val) => new Date(val)),
  expires_in: z.string().optional(),
});

const habitStreak = z.object({
  id: z.uuid(),
  habit_id: z.uuid(),
  user_id: z.uuid(),
  start_date: z.number().transform((val) => new Date(val)),
  end_date: z
    .number()
    .transform((val) => new Date(val))
    .optional(),
});

const tag = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(50),
  master_tag: z.uuid().optional(),
  color: z.string().max(20).default("blue"),
});

export default {
  habit,
  task,
  objective,
  schedule,
  habitTime,
  habitStreak,
  tag,
};
