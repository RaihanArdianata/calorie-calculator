import { seedRoles } from './role.seeder';
import { seedUsers } from './user.seeder';

const main = async () => {
  try {
    await seedRoles();
    await seedUsers();
    console.log('Seeding completed');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

main().finally(() => {
  process.exit();
});
