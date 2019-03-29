import { admin } from '@e2e/database/db'

const deleteUser = async (email: string) => {
  try {
    const user = await admin.auth().getUserByEmail(email)
    await admin.auth().deleteUser(user.uid)
    // tslint:disable-next-line
  } catch (err) {}
}

export { deleteUser }
