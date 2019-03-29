import { admin } from '@e2e/database/db'

const createUser = async (email: string, password: string) => {
  try {
    await admin.auth().createUser({
      email,
      password,
    })
    // tslint:disable-next-line
  } catch (err) {}
}

export { createUser }
