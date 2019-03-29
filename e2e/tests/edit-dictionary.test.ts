import { expect, element, device, waitFor, by } from 'detox'
import { db } from '@e2e/database/db'
import { deleteCollection } from '@e2e/database/delete-collection'
import { signInUser } from '@e2e/navigation/sign-in-user'
import { E2E_COLLECTION_DICTIONARIES } from '@e2e/constants'
import { createDictionary } from '@e2e/database/create-dictionary'
import { navigateToEditDictionaryScreen } from '@e2e/navigation/navigate-to-edit-dictionary-screen'
import {
  DICTIONARY_EDIT_INPUT_NAME,
  SAVE_BUTTON,
  DICTIONARIES_ROW_NAME,
} from '@e2e/ids'

describe('Edit dictionary screen', () => {
  const dictionaryName = 'Dictionary1'
  let dictionaryId: string

  beforeAll(async () => {
    await device.launchApp({ delete: true, newInstance: true })
    await deleteCollection(db, E2E_COLLECTION_DICTIONARIES)
    const dictionary = await createDictionary(dictionaryName)
    dictionaryId = dictionary.id
    await signInUser()
  })

  beforeEach(async () => {
    await device.reloadReactNative()
    await navigateToEditDictionaryScreen(dictionaryId)
  })

  it('should display the form', async () => {
    await expect(
      element(by.text(dictionaryName).and(by.id(DICTIONARY_EDIT_INPUT_NAME)))
    ).toBeVisible()
    await expect(element(by.id(SAVE_BUTTON))).toBeVisible()
  })

  it('should not submit the form if it is invalid', async () => {
    await element(by.id(DICTIONARY_EDIT_INPUT_NAME)).replaceText('')
    await element(by.id(SAVE_BUTTON)).tap()
    await expect(element(by.id(DICTIONARY_EDIT_INPUT_NAME))).toBeVisible()
  })

  it('should change the dictionary name', async () => {
    await element(by.id(DICTIONARY_EDIT_INPUT_NAME)).tap()
    await element(by.id(DICTIONARY_EDIT_INPUT_NAME)).replaceText('test')
    await element(by.id(SAVE_BUTTON)).tap()
    const dictionaryRowId = DICTIONARIES_ROW_NAME(dictionaryId)
    await waitFor(element(by.id(dictionaryRowId).and(by.text('test'))))
      .toBeVisible()
      .withTimeout(4000)
    await expect(
      element(by.id(dictionaryRowId).and(by.text('test')))
    ).toBeVisible()
  })
})
