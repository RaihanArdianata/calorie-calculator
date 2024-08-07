import { z } from "zod";

const targetCalorieSchema = z.union([
  z.number().min(0),
  z.string().refine(value => {
    console.log(value);

    const parsed = Number(value);
    return !isNaN(parsed) && parsed >= 0;
  }, {
    message: 'must be a positive number or zero',
  })
]);

export const createSchema = z.object({
  agenda_name: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK",]),
  meal_id: z.string().min(1),
  time: z.date().nullable().optional(),
  target_calorie: targetCalorieSchema
});

export const deleteSchema = z.object({
  id: z.string().min(1)
});

export const updateSchema = z.object({
  agenda_name: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK",]),
  time: z.date().nullable().optional(),
  target_calorie: targetCalorieSchema
});

export type CreateSchemaType = z.infer<typeof createSchema>;
export type DeleteSchemaType = z.infer<typeof deleteSchema>;
export type UpdateSchemaType = z.infer<typeof updateSchema>;