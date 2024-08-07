import { favorite_meals } from "@prisma/client";

export type favoriteMealTypes = Partial<favorite_meals>;
export type favoritemealTypesMandatory = Pick<favorite_meals, "external_id" | "meal_id" | "user_id">;