import { admin } from '@e2e/database/db'

const deleteUser = async (email: string) => {
  try {
    const user = await admin.auth().getUserByEmail(email)
    await admin.auth().deleteUser(user.uid)
  } catch (err) {}
}

export { deleteUser }
