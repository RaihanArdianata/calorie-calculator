import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const rollbackUsers = async () => {
  const adminUser = await prisma.app_Users.deleteMany({
    where: { email: 'admin@example.com' },
  });

  console.log({ adminUser });
};
