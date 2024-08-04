import { z } from "zod";

export const fetchAllSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).default(10),
});

export const createSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  password: z.string().min(1),
  phone: z.string().min(1),
  username: z.string().min(1),
  role_id: z.string().min(1),
});

export const deleteSchema = z.object({
  id: z.string().uuid().min(1)
});

export type FetchAllSchemaType = z.infer<typeof fetchAllSchema>;
export type CreateSchemaType = z.infer<typeof createSchema>;
export type DeleteSchemaType = z.infer<typeof deleteSchema>;
