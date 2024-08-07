import { z } from "zod";

export const fetchAllSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).default(10),
});

const passwordSchema = z.string()
  .min(1, "Password must be at least 1 character long.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/\d/, "Password must contain at least one number.")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one symbol.");

export const createSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  password: z.string().optional(),
  phone: z.string().optional(),
  username: z.string().optional(),
  admin: z.string().optional(),
});

export const deleteSchema = z.object({
  id: z.string().uuid().min(1)
});

export const updateSchema = z.object({
  email: z.string().email().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  password: passwordSchema.optional(),
  phone: z.string().optional(),
  username: z.string().optional(),
});

export type FetchAllSchemaType = z.infer<typeof fetchAllSchema>;
export type CreateSchemaType = z.infer<typeof createSchema>;
export type DeleteSchemaType = z.infer<typeof deleteSchema>;
export type UpdateSchemaType = z.infer<typeof updateSchema>;
