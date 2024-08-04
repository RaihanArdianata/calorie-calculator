import { PrismaClient } from '@prisma/client';
import { bcryptHash } from '../../src/utils/hashing';

const prisma = new PrismaClient();

export const seedUsers = async () => {
  const adminRole = await prisma.roles.findUnique({
    where: { name: 'ADMINISTRATOR' },
  });

  if (!adminRole) {
    throw new Error('Administrator role not found');
  }

  const hashedPassword = await bcryptHash('password1');

  const adminUser = await prisma.users.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'admin',
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@example.com',
      password: hashedPassword,
      role_id: adminRole.id,
    },
  });

  console.log({ adminUser });
};
