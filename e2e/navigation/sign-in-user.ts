import { element, waitFor, by } from 'detox'
import { createUser } from '@e2e/database/create-user'
import { E2E_EMAIL, E2E_PASSWORD } from '@e2e/constants'
import {
  SIGNIN_SCREEN,
  SIGNIN_INPUT_EMAIL,
  SIGNIN_INPUT_PASSWORD,
  SIGNIN_SUBMIT_BUTTON,
  DICTIONARIES_SCREEN,
} from '@e2e/ids'

const signInUser = async () => {
  await createUser(E2E_EMAIL, E2E_PASSWORD)
  await waitFor(element(by.id(SIGNIN_SCREEN))).toBeVisible()

  await element(by.id(SIGNIN_INPUT_EMAIL)).tap()
  await element(by.id(SIGNIN_INPUT_EMAIL)).typeText(E2E_EMAIL)
  await element(by.id(SIGNIN_INPUT_PASSWORD)).tap()
  await element(by.id(SIGNIN_INPUT_PASSWORD)).typeText(E2E_PASSWORD)
  await element(by.id(SIGNIN_SUBMIT_BUTTON)).tap()

  await waitFor(element(by.id(DICTIONARIES_SCREEN)))
    .toBeVisible()
    .withTimeout(4000)
}

export { signInUser }
