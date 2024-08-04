import { rollbackRoles } from './role.rollback';
import { rollbackUsers } from './user.rollback';

const main = async () => {
  try {
    await rollbackUsers();
    await rollbackRoles();
    console.log('Rollback completed');
  } catch (error) {
    console.error('Rollback failed:', error);
    process.exit(1);
  }
};

main().finally(() => {
  process.exit();
});
