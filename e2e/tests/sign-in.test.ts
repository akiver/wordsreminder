import { expect, element, device, waitFor, by } from 'detox'
import { E2E_EMAIL, E2E_PASSWORD } from '@e2e/constants'
import { createTestUser } from '@e2e/database/create-test-user'
import {
  SIGNIN_INPUT_EMAIL,
  SIGNIN_SUBMIT_BUTTON,
  SIGNIN_INPUT_PASSWORD,
  SIGNIN_SCREEN,
  DICTIONARIES_SCREEN,
  ERROR_MESSAGE,
} from '@e2e/ids'

describe('SignIn', () => {
  beforeAll(async () => {
    await createTestUser()
  })

  beforeEach(async () => {
    await device.launchApp({ delete: true, newInstance: true })
  })

  const submitFormWithCredentials = async (email: string, password: string) => {
    await element(by.id(SIGNIN_INPUT_EMAIL)).tap()
    await element(by.id(SIGNIN_INPUT_EMAIL)).typeText(email)
    await element(by.id(SIGNIN_INPUT_PASSWORD)).tap()
    await element(by.id(SIGNIN_INPUT_PASSWORD)).typeText(password)
    await element(by.id(SIGNIN_SUBMIT_BUTTON)).tap()
  }

  const waitForSignInScreen = async () => {
    await waitFor(element(by.id(SIGNIN_SCREEN))).toBeVisible()
  }

  it('should sign in the user properly', async () => {
    await waitForSignInScreen()

    await submitFormWithCredentials(E2E_EMAIL, E2E_PASSWORD)

    await waitFor(element(by.id(DICTIONARIES_SCREEN)))
      .toBeVisible()
      .withTimeout(2000)
    await expect(element(by.id(DICTIONARIES_SCREEN))).toBeVisible()
  })

  it('should display an error on invalid credentials', async () => {
    await waitForSignInScreen()

    await submitFormWithCredentials('fail@test.com', 'fail')

    await waitFor(element(by.id(ERROR_MESSAGE)))
      .toBeVisible()
      .withTimeout(2000)
    await expect(element(by.id(ERROR_MESSAGE))).toBeVisible()
    await expect(element(by.id(ERROR_MESSAGE))).toHaveText(
      'Invalid credentials.'
    )
  })
})
