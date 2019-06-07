import { createUser } from '@e2e/database/create-user'
import { E2E_EMAIL, E2E_PASSWORD } from '@e2e/constants'

const createTestUser = async () => {
  try {
    await createUser(E2E_EMAIL, E2E_PASSWORD)
  } catch (err) {}
}

export { createTestUser }
