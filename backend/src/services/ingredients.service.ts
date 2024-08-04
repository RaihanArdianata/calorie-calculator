import { prisma } from "../bin/database";
import { IngredientTypes, IngredientTypesMandatory } from "../types/db-schema/ingeredients";
import * as _ from 'lodash';

export const getIngeredients = () => {
  return prisma.ingredients.findMany({
    select: {

    }
  });
};

export const findIngredient = ({ name, id }: IngredientTypes) => {
  return prisma.ingredients.findFirst({
    where: {
      OR: [
        { name: { equals: name?.toLowerCase() } },
        { id: { equals: id } }
      ]
    }
  });
};

export const findIngredientByNames = ({ names }: { names: string[]; }) => {
  return prisma.ingredients.findMany({
    where: {
      OR: [
        { name: { in: _.map(names, (name) => name?.replace(/,|-/g, " ")) } },
      ]
    }
  });
};

export const createManyIngredient = ({ data }: { data: IngredientTypesMandatory[]; }) => {
  const resData = _.map(data, ({ calories, carbohydrates_total_g, cholesterol_mg, fat_saturated_g, fat_total_g, fiber_g, name, potassium_mg, protein_g, serving_size_g, sodium_mg, sugar_g }) => ({ calories, carbohydrates_total_g, cholesterol_mg, fat_saturated_g, fat_total_g, fiber_g, name, potassium_mg, protein_g, serving_size_g, sodium_mg, sugar_g }));

  return prisma.ingredients.createManyAndReturn({
    data: resData
  });
};