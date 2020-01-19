import { admin } from '@e2e/database/db';

export const createUser = async (email: string, password: string) => {
  try {
    await admin.auth().createUser({
      email,
      password,
    });
  } catch (err) {} // eslint-disable-line
};
