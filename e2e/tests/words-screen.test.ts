import { expect, element, device, waitFor, by } from 'detox'
import { db } from '@e2e/database/db'
import { deleteCollection } from '@e2e/database/delete-collection'
import {
  E2E_COLLECTION_DICTIONARIES,
  E2E_COLLECTION_WORDS,
} from '@e2e/constants'
import { signInUser } from '@e2e/navigation/sign-in-user'
import { navigateToWordsScreen } from '@e2e/navigation/navigate-to-words-screen'
import { createTestUser } from '@e2e/database/create-test-user'
import { createDictionary } from '@e2e/database/create-dictionary'
import { createWord } from '@e2e/database/create-word'
import {
  WORDS_SCREEN,
  WORDS_ROW,
  EMPTY_LIST_MESSAGE,
  WORDS_ROW_EDIT,
  WORD_EDIT_SCREEN,
  WORDS_ROW_DELETE,
  ADD_BUTTON,
  WORD_CREATE_SCREEN,
} from '@e2e/ids'

describe('WordsScreen screen', () => {
  let dictionaryId: string
  let wordId: string
  const dictionaryName = 'Dictionary1'
  const value = 'A value'
  const signification = 'A signification'

  beforeAll(async () => {
    await deleteCollection(db, E2E_COLLECTION_DICTIONARIES)
    await createTestUser()
    await device.launchApp({ delete: true, newInstance: true })
    await signInUser()
  })

  beforeEach(async () => {
    await device.reloadReactNative()
  })

  describe('with words', () => {
    beforeAll(async () => {
      const dictionary = await createDictionary(dictionaryName)
      dictionaryId = dictionary.id
      const word = await createWord(dictionary.id, value, signification)
      wordId = word.id
    })

    beforeEach(async () => {
      await navigateToWordsScreen(dictionaryId)
    })

    it('should display the words list', async () => {
      await expect(element(by.id(WORDS_SCREEN))).toBeVisible()
      await expect(element(by.id(WORDS_ROW(wordId)))).toBeVisible()
      await expect(element(by.id(EMPTY_LIST_MESSAGE))).toBeNotVisible()
    })

    it('should navigate to the screen to edit the word', async () => {
      await element(by.id(WORDS_ROW(wordId))).swipe('left')
      await element(by.id(WORDS_ROW_EDIT(wordId))).tap()

      await expect(element(by.id(WORD_EDIT_SCREEN))).toBeVisible()
    })

    it('should delete the word', async () => {
      await element(by.id(WORDS_ROW(wordId))).swipe('left')
      await element(by.id(WORDS_ROW_DELETE(wordId))).tap()
      if (process.env.PLATFORM === 'android') {
        await element(by.text('DELETE')).tap()
      } else {
        await element(
          by.type('_UIAlertControllerActionView').and(by.label('Delete'))
        ).tap()
      }
      await waitFor(element(by.id(WORDS_ROW(wordId))))
        .toBeNotVisible()
        .withTimeout(3000)

      await expect(element(by.id(WORDS_ROW(wordId)))).toBeNotVisible()
    })
  })

  describe('without words', () => {
    beforeAll(async () => {
      await deleteCollection(db, E2E_COLLECTION_DICTIONARIES)
      await deleteCollection(db, E2E_COLLECTION_WORDS)
      const dictionary = await createDictionary(dictionaryName)
      dictionaryId = dictionary.id
    })

    beforeEach(async () => {
      await navigateToWordsScreen(dictionaryId)
    })

    it('should display a message', async () => {
      await expect(element(by.id(EMPTY_LIST_MESSAGE))).toBeVisible()
    })
  })

  it('should navigate to the screen to create a word', async () => {
    await deleteCollection(db, E2E_COLLECTION_DICTIONARIES)
    const dictionary = await createDictionary(dictionaryName)
    await navigateToWordsScreen(dictionary.id)

    await element(by.id(ADD_BUTTON(WORDS_SCREEN))).tap()
    await waitFor(element(by.id(WORD_CREATE_SCREEN)))
      .toBeVisible()
      .withTimeout(2000)
    await expect(element(by.id(WORD_CREATE_SCREEN))).toBeVisible()
  })
})
