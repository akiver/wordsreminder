import { admin } from '@e2e/database/db'

const createUser = async (email: string, password: string) => {
  try {
    await admin.auth().createUser({
      email,
      password,
    })
  } catch (err) {}
}

export { createUser }
