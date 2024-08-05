import { prisma } from "../bin/database";
import { transformPhoneNumber } from "../utils/formater";
import { bcryptHash } from "../utils/hashing";
import { FetchAllSchemaType, CreateSchemaType, DeleteSchemaType } from "../utils/validator/users.validator";

export const fetchAll = async ({ page, limit }: FetchAllSchemaType) => {
  page = isNaN(page) ? 1 : +page;
  limit = isNaN(limit) ? 10 : +limit;
  const skip = (page - 1) * limit;
  return prisma.users.findMany({
    skip,
    take: limit,
  });
}

export const fetchDatabaseSize = async() => prisma.users.count();

export const create = async (data: CreateSchemaType) => 
  prisma.users.upsert({
    create: {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      password: await bcryptHash(data.password),
      phone: await transformPhoneNumber(data.phone),
      username: data.username,
      role_id: data.role_id,
    },
    update: {
      ...data,
      password: await bcryptHash(data.password),
      phone: await transformPhoneNumber(data.phone),
    },
    where: {
      id: data.id ?? "no_id"
    }
  });


export const removes = async ({ id }: DeleteSchemaType) => 
  prisma.users.deleteMany({ where: { id: id } });

export const favMeals = async (id: string) =>
  prisma.favorite_meals.findMany({ where: { user_id: id }});

export const isAdmin = async(id: string) => {
  const data = await prisma.roles.findFirst({
    where: {
      AND: [
        {
          app_users: {
            some: { id }
          }
        },
        { name: 'ADMINISTRATOR' }
      ]
    }
  });
  return data;
}

export const isEmailOrUsernameTaken = async (username: string, email: string) => {
  const count = await prisma.users.count({
    where: {
      OR: [
        { username },
        { email }
      ]
    }
  });

  return count > 0;
}
