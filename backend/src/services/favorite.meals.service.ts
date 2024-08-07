import { prisma } from "../bin/database";
import * as _ from 'lodash';
import { favoriteMealTypes, favoritemealTypesMandatory } from "../types/db-schema/favorite";

export const create = ({ data }: { data: favoritemealTypesMandatory; }) => {
  return prisma.favorite_meals.create({
    data: {
      external_id: data.external_id,
      meal_id: data.meal_id,
      user_id: data.user_id
    }
  });
};


export const find = ({ id }: { id: string; }) => {
  return prisma.favorite_meals.findFirst({
    where: {
      id: id
    }
  });
};


export const remove = ({ data }: { data: favoriteMealTypes; }) => {
  return prisma.favorite_meals.delete({
    where: {
      id: data.id!,
      user_id: data.user_id!,
    }
  });
};