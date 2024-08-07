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


export const find = ({ id, external_id, user_id }: { user_id: string; id: string; external_id: string; }) => {
  return prisma.favorite_meals.findFirst({
    where: {
      user_id: user_id,
      OR: [
        { id: id },
        { external_id: external_id },
      ]
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