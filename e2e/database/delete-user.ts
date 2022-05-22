import { admin } from '@e2e/database/db';

export async function deleteUser(email: string) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().deleteUser(user.uid);
  } catch (err) {} // eslint-disable-line
}
