import { expect, element, device, waitFor, by } from 'detox'
import { db } from '@e2e/database/db'
import { deleteCollection } from '@e2e/database/delete-collection'
import { signInUser } from '@e2e/navigation/sign-in-user'
import { E2E_COLLECTION_DICTIONARIES } from '@e2e/constants'
import { createTestUser } from '@e2e/database/create-test-user'
import { navigateToCreateDictionaryScreen } from '@e2e/navigation/navigate-to-create-dictionary-screen'
import { createDictionary } from '@e2e/database/create-dictionary'
import { getDictionaryByName } from '@e2e/database/getDictionaryByName'
import {
  DICTIONARY_CREATE_INPUT_NAME,
  SAVE_BUTTON,
  DICTIONARY_CREATE_SCREEN,
  DICTIONARIES_ROW,
} from '@e2e/ids'
import { sleep } from '@e2e/utils/sleep'

describe('Create dictionary screen', () => {
  beforeAll(async () => {
    await deleteCollection(db, E2E_COLLECTION_DICTIONARIES)
    await createTestUser()
    await device.launchApp({ delete: true, newInstance: true })
    await signInUser()
  })

  beforeEach(async () => {
    await device.reloadReactNative()
    await navigateToCreateDictionaryScreen()
  })

  it('should display the form', async () => {
    await expect(element(by.id(DICTIONARY_CREATE_SCREEN))).toBeVisible()
  })

  it('should not submit the form if it is invalid', async () => {
    await element(by.id(DICTIONARY_CREATE_INPUT_NAME)).replaceText('')
    await element(by.id(SAVE_BUTTON)).tap()
    await expect(element(by.id(DICTIONARY_CREATE_INPUT_NAME))).toBeVisible()
  })

  it('should create a dictionary', async () => {
    await element(by.id(DICTIONARY_CREATE_INPUT_NAME)).tap()
    await element(by.id(DICTIONARY_CREATE_INPUT_NAME)).typeText('test')
    await element(by.id(SAVE_BUTTON)).tap()
    // Give some time to Firestore to create the doc.
    await sleep(4000)
    const dictionary = await getDictionaryByName('test')
    const dictionaryRowID = DICTIONARIES_ROW(dictionary.id)
    await waitFor(element(by.id(dictionaryRowID)))
      .toBeVisible()
      .withTimeout(3000)

    await expect(element(by.id(dictionaryRowID))).toBeVisible()
  })

  it('should display an error if the dictionary name already exists', async () => {
    await createDictionary('Nop')
    await element(by.id(DICTIONARY_CREATE_INPUT_NAME)).typeText('Nop')
    await element(by.id(SAVE_BUTTON)).tap()

    const error = 'This dictionary already exists.'
    await waitFor(element(by.text(error)))
      .toBeVisible()
      .withTimeout(4000)
    await expect(element(by.text(error))).toBeVisible()
  })
})
