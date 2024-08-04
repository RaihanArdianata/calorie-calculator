import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const rollbackRoles = async () => {
  const adminRole = await prisma.roles.deleteMany({
    where: { name: 'ADMINISTRATOR' },
  });

  const appOwnerRole = await prisma.roles.deleteMany({
    where: { name: 'APP_OWNER' },
  });

  console.log({ adminRole, appOwnerRole });
};
