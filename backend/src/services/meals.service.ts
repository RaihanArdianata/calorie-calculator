import { prisma } from "../bin/database";
import * as _ from 'lodash';
import { mealTypes, mealTypesMandatory } from "../types/db-schema/meals";

export const createManyMeals = ({ data }: { data: mealTypesMandatory[]; }) => {
  return prisma.meals.createManyAndReturn({
    data: data
  });
};

export const findMeal = ({ external_id, id }: mealTypes) => {
  return prisma.meals.findFirst({
    where: {
      OR: [
        { external_id: external_id || id },
        { id: id }
      ]
    },
    include: {
      tr_ingredients: {
        include: {
          ingredient: true
        }
      }
    }
  });
};

export const findUser = (id: string) => prisma.users.findMany({
  where: {
    favorite_meals: {
      some: {
        OR: [
          { id },
          { external_id: id }
        ]
      }
    }
  }
});
