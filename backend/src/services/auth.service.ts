import { prisma } from "../bin/database";
import { UserTypes } from "../types/db-schema/users";
import { transformPhoneNumber } from "../utils/formater";
import { bcryptHash } from "../utils/hashing";

export const getUsers = () => {
  return prisma.users.findMany({
    select: {
      id: true,
      created_at: true,
      email: true,
      first_name: true,
      last_name: true,
      phone: true,
      birth_date: true,
      role_id: true,
      username: true,
    }
  });
};

export const getUser = async ({ email, phone, username }: { email: string, phone: string; username: string; }) => {
  return prisma.users.findFirst({
    where: {
      OR: [
        { email: email },
        { phone: await transformPhoneNumber(phone) },
        { username }
      ]
    },
    include: {
      roles: true
    }
  });
};

export const createUser = async (data: UserTypes) => {
  const role = await prisma.roles.findUnique({ where: { name: "USER" } });
  return prisma.users.create({
    data: {
      email: data.email!,
      first_name: data.first_name,
      last_name: data.last_name,
      password: await bcryptHash(data.password!),
      phone: await transformPhoneNumber(data.phone!),
      username: `${data.first_name?.toLowerCase()}_${data.last_name?.toLowerCase()}`,
      role_id: role!.id
    }
  });
};

export const getUserById = async (data: UserTypes) => {
  return prisma.users.findFirst({
    where: {
      id: data.id!
    }
  });
};
