import { BAD_REQUEST } from "http-status";
import { prisma } from "../bin/database";
import ApiError from "../utils/ApiError";
import { transformPhoneNumber } from "../utils/formater";
import { bcryptHash } from "../utils/hashing";
import { FetchAllSchemaType, CreateSchemaType, DeleteSchemaType } from "../utils/validator/users.validator";

export const fetchAll = async ({ page, limit }: FetchAllSchemaType, totalPages: number) => {
  page = isNaN(page) ? 1 : +page;
  limit = isNaN(limit) ? 10 : +limit;
  if (page > totalPages) page = totalPages;
  const skip = (page - 1) * limit;
  return prisma.users.findMany({
    skip,
    take: limit,
    include: {
      roles: {
        select: {
          name: true
        }
      }
    }
  });
}

export const fetchDatabaseSize = async() => prisma.users.count();

export const create = async (data: CreateSchemaType) => {
  const role = await prisma.roles.findFirst({ where: { name: data.admin === "true" ? "ADMINISTRATOR" : "USER" }});
  delete data.admin;
  if (!data.id && (
    !data.email || !data.first_name ||
    !data.last_name || !data.password ||
    !data.phone || !data.username
  )) throw new ApiError(BAD_REQUEST, { message: "missing field" });
  if (data.password) data.password = await bcryptHash(data.password!);
  if (data.phone) data.phone = await transformPhoneNumber(data.phone!);
  return prisma.users.upsert({
    create: {
      email: data.email ?? "no_email",
      first_name: data.first_name,
      last_name: data.last_name,
      username: data.username ?? "no_username",
      role_id: role!.id,
      password: data.password ?? "no_password",
      phone: data.phone!
    },
    update: {
      ...data,
      role_id: role?.id
    },
    where: {
      id: data.id ?? "no_id"
    }
  });
}

export const removes = async ({ id }: DeleteSchemaType) => 
  prisma.users.delete({ where: { id: id } });

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

export const fetchProfileWithFavMeals = async (id: string) => {
  return prisma.users.findFirst(
    {
      where: { id },
      include: {
        roles: {
          select: { name: true }
        },
        favorite_meals: true
      }
    });
}
