import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const seedRoles = async () => {
  const adminRole = await prisma.roles.upsert({
    where: { name: 'ADMINISTRATOR' },
    update: {},
    create: {
      name: 'ADMINISTRATOR',
      description: 'Administrator role with full access',
    },
  });

  const appOwnerRole = await prisma.roles.upsert({
    where: { name: 'USER' },
    update: {},
    create: {
      name: 'USER',
      description: 'App owner role with access to manage own apps',
    },
  });

  console.log({ adminRole, appOwnerRole });
};
