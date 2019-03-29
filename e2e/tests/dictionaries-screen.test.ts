import { expect, element, device, waitFor, by } from 'detox'
import { db } from '@e2e/database/db'
import { deleteCollection } from '@e2e/database/delete-collection'
import { signInUser } from '@e2e/navigation/sign-in-user'
import { E2E_COLLECTION_DICTIONARIES } from '@e2e/constants'
import { createTestUser } from '@e2e/database/create-test-user'
import { createDictionary } from '@e2e/database/create-dictionary'
import {
  DICTIONARIES_SCREEN,
  DICTIONARIES_ROW,
  EMPTY_LIST_MESSAGE,
  WORDS_SCREEN,
  DICTIONARIES_ROW_EDIT,
  DICTIONARY_EDIT_SCREEN,
  DICTIONARIES_ROW_DELETE,
  ADD_BUTTON,
  DICTIONARY_CREATE_SCREEN,
} from '@e2e/ids'

describe('Dictionaries screen', () => {
  beforeAll(async () => {
    await createTestUser()
    await device.launchApp({ delete: true, newInstance: true })
    await signInUser()
  })

  beforeEach(async () => {
    await device.reloadReactNative()
  })

  describe('with dictionaries', () => {
    let dictionary1Id: string
    let dictionary2Id: string

    beforeAll(async () => {
      await deleteCollection(db, E2E_COLLECTION_DICTIONARIES)
      const dictionary1 = await createDictionary('Dictionary1')
      dictionary1Id = dictionary1.id
      const dictionary2 = await createDictionary('Dictionary2')
      dictionary2Id = dictionary2.id
    })

    beforeEach(async () => {
      await waitFor(element(by.id(DICTIONARIES_ROW(dictionary1Id))))
        .toBeVisible()
        .withTimeout(4000)
      await waitFor(
        element(by.id(DICTIONARIES_ROW(dictionary2Id)))
      ).toBeVisible()
    })

    it('should display the dictionaries list', async () => {
      await expect(
        element(by.id(DICTIONARIES_ROW(dictionary1Id)))
      ).toBeVisible()
      await expect(
        element(by.id(DICTIONARIES_ROW(dictionary2Id)))
      ).toBeVisible()
      await expect(element(by.id(EMPTY_LIST_MESSAGE))).toBeNotVisible()
    })

    it('should navigate to words screen', async () => {
      await element(by.id(DICTIONARIES_ROW(dictionary2Id))).tap()

      await expect(element(by.id(WORDS_SCREEN))).toBeVisible()
    })

    it('should navigate to the screen to edit the dictionary', async () => {
      await element(by.id(DICTIONARIES_ROW(dictionary1Id))).swipe('left')
      await element(by.id(DICTIONARIES_ROW_EDIT(dictionary1Id))).tap()

      await expect(element(by.id(DICTIONARY_EDIT_SCREEN))).toBeVisible()
    })

    it('should delete the dictionary', async () => {
      await element(by.id(DICTIONARIES_ROW(dictionary1Id))).swipe('left')
      await element(by.id(DICTIONARIES_ROW_DELETE(dictionary1Id))).tap()
      if (process.env.PLATFORM === 'android') {
        await element(by.text('DELETE')).tap()
      } else {
        await element(
          by.type('_UIAlertControllerActionView').and(by.label('Delete'))
        ).tap()
      }
      const dictionaryRowId = DICTIONARIES_ROW(dictionary1Id)
      await waitFor(element(by.id(dictionaryRowId)))
        .toBeNotVisible()
        .withTimeout(3000)

      await expect(element(by.id(dictionaryRowId))).toBeNotVisible()
    })
  })

  describe('without dictionaries', () => {
    beforeAll(async () => {
      await deleteCollection(db, E2E_COLLECTION_DICTIONARIES)
    })

    it('should display a message', async () => {
      await expect(element(by.id(EMPTY_LIST_MESSAGE))).toBeVisible()
    })
  })

  it('should navigate to the screen to create a dictionary', async () => {
    const buttonId = ADD_BUTTON(DICTIONARIES_SCREEN)
    await waitFor(element(by.id(buttonId))).toBeNotVisible()
    await element(by.id(buttonId)).tap()
    await expect(element(by.id(DICTIONARY_CREATE_SCREEN))).toBeVisible()
  })
})
