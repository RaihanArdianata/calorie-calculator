import { prisma } from "../bin/database";
import * as _ from 'lodash';
import { MealsAgendaTypes } from "../types/db-schema/meal.agenda";

export const createMealsAgenda = ({ data }: { data: MealsAgendaTypes; }) => {
  console.log(data, "-----data----");

  return prisma.meals_agenda.create({
    data: {
      agenda_name: data.agenda_name!,
      meal_id: data.meal_id!,
      user_id: data.user_id!,
      time: data.time,
      target_calorie: Number(data.target_calorie! || 0)
    }
  });
};

export const updateMealsAgenda = ({ data }: { data: MealsAgendaTypes; }) => {
  return prisma.meals_agenda.update({
    where: {
      user_id: data.user_id!,
      id: data.id!,
    },
    data: {
      agenda_name: data.agenda_name!,
      meal_id: data.meal_id!,
      time: data.time,
      target_calorie: Number(data.target_calorie! || 0)
    }
  });
};

export const deleteMealsAgenda = ({ data }: { data: MealsAgendaTypes; }) => {
  return prisma.meals_agenda.delete({
    where: {
      user_id: data.user_id!,
      id: data.id!,
    },
  });
};


export const getMealAgenda = () => {
  return prisma.meals_agenda.findMany({
    include: {
      meal: true,
      user: {
        select: {
          first_name: true,
          last_name: true,
          email: true,
        }
      }
    }
  });
};

export const getMealAgendaByUserId = ({ data, endOfDay, startOfDay }: { data: MealsAgendaTypes; startOfDay?: Date; endOfDay?: Date; }) => {
  return prisma.meals_agenda.findMany({
    where: {
      user_id: data.id,
      OR: [{
        agenda_name: data.agenda_name,
      },]
    }
  });
};

export const findMealAgendaByUserId = ({ data, endOfDay, startOfDay }: { data: MealsAgendaTypes; startOfDay?: Date | string; endOfDay?: Date | string; }) => {

  return prisma.meals_agenda.findMany({
    where: {
      user_id: data.user_id,
      AND: {
        OR: [
          { id: data.id },
          {
            agenda_name: data.agenda_name,
          },
          (startOfDay && _.isDate(new Date(startOfDay)) ? { created_at: { gte: new Date(startOfDay), ...(endOfDay && _.isDate(new Date(endOfDay)) ? { lte: new Date(endOfDay) } : {}) } } : {}),
        ],
      },
    },
    include: {
      meal: {
        include: {
          tr_ingredients: {
            include: {
              ingredient: true
            }
          }
        }
      }
    }
  });
};