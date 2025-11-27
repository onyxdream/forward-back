import z from "zod";

export const safeUserModel = z.object({
  id: z.uuid(),
  email: z.email("Invalid email address"),
  username: z.string(),
  is_active: z.boolean(),
  created_at: z.number().int().nonnegative(),
  premium: z.boolean(),
  admin: z.boolean(),
});

export const userModel = z.object({
  id: z.uuid(),
  email: z.email("Invalid email address"),
  username: z.string(),
  password_hash: z.string().min(1),
  is_active: z.boolean(),
  created_at: z.number().int().nonnegative(),
  premium: z.boolean(),
  admin: z.boolean(),
});

export const updateUserModel = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username must be at most 30 characters long")
    .optional(),
  email: z.email("Invalid email address").optional(),
  is_active: z.boolean().optional(),
});

export type User = z.infer<typeof userModel>;
export type UpdateUserModel = z.infer<typeof updateUserModel>;
export type SafeUser = z.infer<typeof safeUserModel>;
