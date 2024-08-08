import { meals } from "@prisma/client";

export type mealTypes = Partial<meals>;
export type mealTypesMandatory = Pick<meals, "external_id" | "area" | "name" | "total_portions">;