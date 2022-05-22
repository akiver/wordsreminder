import { createUser } from '@e2e/database/create-user';
import { E2E_EMAIL, E2E_PASSWORD } from '@e2e/constants';

export async function createTestUser() {
  try {
    await createUser(E2E_EMAIL, E2E_PASSWORD);
  } catch (err) {} // eslint-disable-line
}
