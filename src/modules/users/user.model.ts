import z from "zod";

export const userModel = z.object({
  id: z.uuid(),
  email: z.email("Invalid email address"),
  password_hash: z.string().min(1),
  is_active: z.boolean(),
  created_at: z.number().int().nonnegative(),
  premium: z.boolean(),
  admin: z.boolean()
});

export const updateUserModel = z.object({
  id: z.uuid(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username must be at most 30 characters long")
    .optional(),
  email: z.email("Invalid email address").optional(),
  is_active: z.boolean().optional(),
  premium: z.boolean().optional(),
});

export const deleteUserModel = z.object({
  id: z.uuid(),
});

export type User = z.infer<typeof userModel>;
export type UpdateUserModel = z.infer<typeof updateUserModel>;
export type DeleteUserModel = z.infer<typeof deleteUserModel>;
