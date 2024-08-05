import { prisma } from "../bin/database";
import * as _ from 'lodash';
import { MealsAgendaTypes } from "../types/db-schema/meal.agenda";

export const createMealsAgenda = ({ data }: { data: MealsAgendaTypes; }) => {
  return prisma.meals_agenda.create({
    data: {
      agenda_name: data.agenda_name!,
      meal_id: data.meal_id!,
      user_id: data.user_id!,
      time: data.time
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
      time: data.time
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

export const getMealAgendaByUserId = ({ data }: { data: MealsAgendaTypes; }) => {
  return prisma.meals_agenda.findMany({
    where: {
      user_id: data.id
    }
  });
};

export const findMealAgendaByUserId = ({ data }: { data: MealsAgendaTypes; }) => {
  return prisma.meals_agenda.findMany({
    where: {
      OR: [
        { user_id: data.user_id },
        {
          OR: [
            { agenda_name: data.agenda_name },
            { id: data.id },
          ]
        }
      ]
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