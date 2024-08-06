import { z } from "zod";


export const createSchema = z.object({
  agenda_name: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK",]),
  meal_id: z.string().uuid().min(1),
  time: z.date().nullable().optional()
});

export const deleteSchema = z.object({
  id: z.string().uuid().min(1)
});

export const updateSchema = z.object({
  agenda_name: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK",]),
  time: z.date().nullable().optional()
});

export type CreateSchemaType = z.infer<typeof createSchema>;
export type DeleteSchemaType = z.infer<typeof deleteSchema>;
export type UpdateSchemaType = z.infer<typeof updateSchema>;