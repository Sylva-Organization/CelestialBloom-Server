import { db_connection } from '../src/database/db_connection.js';
import { UserModel } from '../src/models/UserModel.js';

//prepares the environment before the test
export const setupTestDB = async () => {
  await db_connection.sync();//{ force: true }
};

//cleans the environment after the test
export const teardownTestDB = async () => {
  await UserModel.destroy({ where: {}, truncate: true, cascade: true });
  await db_connection.close();
};