import { expect, element, device, waitFor, by } from 'detox'
import { deleteUser } from '@e2e/database/delete-user'
import { createUser } from '@e2e/database/create-user'
import {
  SIGNIN_SCREEN,
  SIGNIN_LINK_SIGNUP,
  SIGNUP_SCREEN,
  SIGNUP_INPUT_EMAIL,
  SIGNUP_INPUT_PASSWORD,
  SIGNUP_SUBMIT_BUTTON,
  ERROR_MESSAGE,
  DICTIONARIES_SCREEN,
  SIGNUP_LINK_SIGNIN,
} from '@e2e/ids'

describe('SignUp', () => {
  const fakeEmail = 'fake@test.com'
  const fakePassword = 'String@PassWord109'

  beforeEach(async () => {
    await device.launchApp({ delete: true, newInstance: true })

    await navigateToSignUpScreen()
  })

  const navigateToSignUpScreen = async () => {
    await waitFor(element(by.id(SIGNIN_SCREEN))).toBeVisible()
    await element(by.id(SIGNIN_LINK_SIGNUP)).tap()
    await waitFor(element(by.id(SIGNUP_SCREEN))).toBeVisible()
  }

  const submitFormWithCredentials = async (email: string, password: string) => {
    await element(by.id(SIGNUP_INPUT_EMAIL)).tap()
    await element(by.id(SIGNUP_INPUT_EMAIL)).typeText(email)
    await element(by.id(SIGNUP_INPUT_PASSWORD)).tap()
    await element(by.id(SIGNUP_INPUT_PASSWORD)).typeText(password)
    await element(by.id(SIGNUP_SUBMIT_BUTTON)).tap()
  }

  const waitForErrorMessage = async () => {
    await waitFor(element(by.id(ERROR_MESSAGE)))
      .toBeVisible()
      .withTimeout(3000)
  }

  it('should sign up a new user', async () => {
    await deleteUser(fakeEmail)
    await submitFormWithCredentials(fakeEmail, fakePassword)

    await waitFor(element(by.id(DICTIONARIES_SCREEN)))
      .toBeVisible()
      .withTimeout(3000)
    await expect(element(by.id(DICTIONARIES_SCREEN))).toBeVisible()
  })

  it('should redirect to signin', async () => {
    await element(by.id(SIGNUP_LINK_SIGNIN)).tap()
    await expect(element(by.id(SIGNIN_SCREEN))).toBeVisible()
  })

  describe('on submit error', () => {
    it('should display an error for invalid email', async () => {
      await submitFormWithCredentials('invalid email', fakePassword)
      await waitForErrorMessage()

      await expect(element(by.id(ERROR_MESSAGE))).toHaveText('Invalid email.')
    })

    it('should display an error for weak password', async () => {
      await submitFormWithCredentials(fakeEmail, 'weak')
      await waitForErrorMessage()

      await expect(element(by.id(ERROR_MESSAGE))).toHaveText(
        'Password is too weak.'
      )
    })

    it('should display an error for email already in use', async () => {
      await createUser(fakeEmail, fakePassword)
      await submitFormWithCredentials(fakeEmail, fakePassword)
      await waitForErrorMessage()

      await expect(element(by.id(ERROR_MESSAGE))).toHaveText(
        'Email already in use.'
      )
    })
  })
})
