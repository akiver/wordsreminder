import { expect, element, device, by, waitFor } from 'detox'
import { db } from '@e2e/database/db'
import { deleteCollection } from '@e2e/database/delete-collection'
import { signInUser } from '@e2e/navigation/sign-in-user'
import {
  E2E_COLLECTION_DICTIONARIES,
  E2E_COLLECTION_WORDS,
} from '@e2e/constants'
import { createDictionary } from '@e2e/database/create-dictionary'
import { createTestUser } from '@e2e/database/create-test-user'
import { navigateToCreateWordScreen } from '@e2e/navigation/navigate-to-create-word-screen'
import { createWord } from '@e2e/database/create-word'
import { getWordByValue } from '@e2e/database/getWordByValue'
import {
  WORD_CREATE_INPUT_VALUE,
  WORD_CREATE_INPUT_SIGNIFICATION,
  WORD_CREATE_INPUT_DESCRIPTION,
  SAVE_BUTTON,
  WORDS_ROW,
} from '@e2e/ids'
import { sleep } from '@e2e/utils/sleep'

describe('Create word screen', () => {
  let dictionaryId: string

  beforeAll(async () => {
    await deleteCollection(db, E2E_COLLECTION_DICTIONARIES)
    const dictionary = await createDictionary('A dictionary')
    dictionaryId = dictionary.id
    await createTestUser()
    await device.launchApp({ delete: true, newInstance: true })
    await signInUser()
  })

  beforeEach(async () => {
    await device.reloadReactNative()
    await navigateToCreateWordScreen(dictionaryId)
  })

  it('should display the form', async () => {
    await expect(element(by.id(WORD_CREATE_INPUT_VALUE))).toBeVisible()
    await expect(element(by.id(WORD_CREATE_INPUT_SIGNIFICATION))).toBeVisible()
    await expect(element(by.id(WORD_CREATE_INPUT_DESCRIPTION))).toBeVisible()
    await expect(element(by.id(SAVE_BUTTON))).toBeVisible()
  })

  describe('the form is invalid', () => {
    beforeAll(async () => {
      await createWord(dictionaryId, 'Word', 'Signification')
    })

    beforeEach(async () => {
      await device.reloadReactNative()
      await navigateToCreateWordScreen(dictionaryId)
    })

    it('should not submit the form if value is empty', async () => {
      await waitFor(element(by.id(WORD_CREATE_INPUT_VALUE))).toBeVisible()
      await element(by.id(WORD_CREATE_INPUT_VALUE)).replaceText('')
      await element(by.id(SAVE_BUTTON)).tap()

      await expect(element(by.id(WORD_CREATE_INPUT_VALUE))).toBeVisible()
    })

    it('should not submit the form if signification is empty', async () => {
      await waitFor(
        element(by.id(WORD_CREATE_INPUT_SIGNIFICATION))
      ).toBeVisible()
      await element(by.id(WORD_CREATE_INPUT_SIGNIFICATION)).replaceText('')
      await element(by.id(SAVE_BUTTON)).tap()

      await expect(
        element(by.id(WORD_CREATE_INPUT_SIGNIFICATION))
      ).toBeVisible()
    })

    it('should display an error if the word already exists in the dictionary', async () => {
      await element(by.id(WORD_CREATE_INPUT_VALUE)).tap()
      await element(by.id(WORD_CREATE_INPUT_VALUE)).typeText('Word')
      await element(by.id(WORD_CREATE_INPUT_SIGNIFICATION)).tap()
      await element(by.id(WORD_CREATE_INPUT_SIGNIFICATION)).typeText(
        'Signification'
      )
      await element(by.id(SAVE_BUTTON)).tap()

      const error = 'This word already exists in this dictionary.'
      await waitFor(element(by.text(error)))
        .toBeVisible()
        .withTimeout(4000)
      await expect(element(by.text(error))).toBeVisible()
    })
  })

  it('should create a word', async () => {
    await deleteCollection(db, E2E_COLLECTION_WORDS)

    await element(by.id(WORD_CREATE_INPUT_VALUE)).tap()
    await element(by.id(WORD_CREATE_INPUT_VALUE)).typeText('Value')
    await element(by.id(WORD_CREATE_INPUT_SIGNIFICATION)).tap()
    await element(by.id(WORD_CREATE_INPUT_SIGNIFICATION)).typeText(
      'Signification'
    )
    await element(by.id(WORD_CREATE_INPUT_DESCRIPTION)).tap()
    await element(by.id(WORD_CREATE_INPUT_DESCRIPTION)).typeText('Description')
    await element(by.id(SAVE_BUTTON)).tap()

    // Give some time to Firestore to create the doc.
    await sleep(4000)
    const word = await getWordByValue('Value')

    await expect(element(by.id(WORDS_ROW(word.id)))).toBeVisible()
  })
})
