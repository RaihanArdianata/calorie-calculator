import { z } from 'zod';

const passwordSchema = z.string()
  .min(1, "Password must be at least 1 character long.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/\d/, "Password must contain at least one number.")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one symbol.");


export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type loginSchemaType = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: passwordSchema,
  phone: z.string().min(1),
});

export type registerSchemaType = z.infer<typeof registerSchema>;