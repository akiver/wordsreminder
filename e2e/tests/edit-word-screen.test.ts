import { expect, element, device, waitFor, by } from 'detox'
import { db } from '@e2e/database/db'
import { deleteCollection } from '@e2e/database/delete-collection'
import { signInUser } from '@e2e/navigation/sign-in-user'
import { E2E_COLLECTION_DICTIONARIES } from '@e2e/constants'
import { navigateToEditWordScreen } from '@e2e/navigation/navigate-to-edit-word-screen'
import { createDictionary } from '@e2e/database/create-dictionary'
import { createWord } from '@e2e/database/create-word'
import {
  WORD_EDIT_INPUT_VALUE,
  WORD_EDIT_INPUT_SIGNIFICATION,
  WORD_EDIT_INPUT_DESCRIPTION,
  SAVE_BUTTON,
  WORDS_ROW_DESCRIPTION,
  WORDS_ROW_SIGNIFICATION,
  WORDS_ROW_VALUE,
} from '@e2e/ids'

describe('Edit word screen', () => {
  let dictionaryId: string
  let wordId: string
  const wordValue = 'A word'
  const wordSignification = 'A signification'
  const wordDescription = 'A description'

  beforeAll(async () => {
    await deleteCollection(db, E2E_COLLECTION_DICTIONARIES)
    const dictionary = await createDictionary('A dictionary')
    dictionaryId = dictionary.id
    const word = await createWord(
      dictionary.id,
      wordValue,
      wordSignification,
      wordDescription
    )
    wordId = word.id
    await device.launchApp({ delete: true, newInstance: true })
    await signInUser()
  })

  beforeEach(async () => {
    await device.reloadReactNative()
    await navigateToEditWordScreen(dictionaryId, wordId)
  })

  it('should display the form', async () => {
    await expect(
      element(by.text(wordValue).and(by.id(WORD_EDIT_INPUT_VALUE)))
    ).toBeVisible()
    await expect(
      element(
        by.text(wordSignification).and(by.id(WORD_EDIT_INPUT_SIGNIFICATION))
      )
    ).toBeVisible()
    await expect(
      element(by.text(wordDescription).and(by.id(WORD_EDIT_INPUT_DESCRIPTION)))
    ).toBeVisible()
    await expect(element(by.id(SAVE_BUTTON))).toBeVisible()
  })

  describe('invalid form', () => {
    it('should not submit the form if value is empty', async () => {
      await element(by.id(WORD_EDIT_INPUT_VALUE)).clearText()
      await element(by.id(SAVE_BUTTON)).tap()

      await expect(element(by.id(WORD_EDIT_INPUT_VALUE))).toBeVisible()
    })

    it('should not submit the form if signification is empty', async () => {
      await element(by.id(WORD_EDIT_INPUT_SIGNIFICATION)).clearText()
      await element(by.id(SAVE_BUTTON)).tap()

      await expect(element(by.id(WORD_EDIT_INPUT_SIGNIFICATION))).toBeVisible()
    })
  })

  it('should update the word description', async () => {
    await element(by.id(WORD_EDIT_INPUT_DESCRIPTION)).tap()
    // replaceText() doesn't play well with multine TextInput
    await element(by.id(WORD_EDIT_INPUT_DESCRIPTION)).clearText()
    await element(by.id(WORD_EDIT_INPUT_DESCRIPTION)).typeText(
      'new description'
    )
    await element(by.id(SAVE_BUTTON)).tap()
    await waitFor(element(by.id(WORDS_ROW_DESCRIPTION)))
      .toBeVisible()
      .withTimeout(2000)

    await expect(
      element(by.id(WORDS_ROW_DESCRIPTION).and(by.text('new description')))
    ).toBeVisible()
  })

  it('should update the word signification', async () => {
    await element(by.id(WORD_EDIT_INPUT_SIGNIFICATION)).tap()
    await element(by.id(WORD_EDIT_INPUT_SIGNIFICATION)).clearText()
    await element(by.id(WORD_EDIT_INPUT_SIGNIFICATION)).typeText(
      'new signification'
    )
    await element(by.id(SAVE_BUTTON)).tap()
    await waitFor(element(by.id(WORDS_ROW_SIGNIFICATION)))
      .toBeVisible()
      .withTimeout(2000)

    await expect(
      element(by.id(WORDS_ROW_SIGNIFICATION).and(by.text('new signification')))
    ).toBeVisible()
  })

  it('should update the word value', async () => {
    await element(by.id(WORD_EDIT_INPUT_VALUE)).tap()
    await element(by.id(WORD_EDIT_INPUT_VALUE)).clearText()
    await element(by.id(WORD_EDIT_INPUT_VALUE)).typeText('new value')
    await element(by.id(SAVE_BUTTON)).tap()
    const wordRowId = WORDS_ROW_VALUE(wordId)
    await waitFor(element(by.id(wordRowId)))
      .toBeVisible()
      .withTimeout(2000)

    await expect(
      element(by.id(wordRowId).and(by.text('new value')))
    ).toBeVisible()
  })
})
