import z from "zod";

const objectiveSchema = z.object({
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

export const createObjectiveSchema = objectiveSchema.omit({
  id: true,
  created_at: true,
  user_id: true,
});

export const updateObjectiveSchema = createObjectiveSchema.partial();

export type Objective = z.infer<typeof objectiveSchema>;
export type CreateObjectiveSchema = z.infer<typeof createObjectiveSchema>;
export type UpdateObjectiveInput = z.infer<typeof updateObjectiveSchema>;
