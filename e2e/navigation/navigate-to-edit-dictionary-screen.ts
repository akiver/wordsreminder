import { element, waitFor, by } from 'detox'
import {
  DICTIONARIES_ROW,
  DICTIONARIES_ROW_EDIT,
  DICTIONARY_EDIT_SCREEN,
} from '@e2e/ids'

const navigateToEditDictionaryScreen = async (dictionaryId: string) => {
  await waitFor(element(by.id(DICTIONARIES_ROW(dictionaryId))))
    .toBeVisible()
    .withTimeout(4000)
  await element(by.id(DICTIONARIES_ROW(dictionaryId))).swipe('left')
  await element(by.id(DICTIONARIES_ROW_EDIT(dictionaryId))).tap()
  await waitFor(element(by.id(DICTIONARY_EDIT_SCREEN)))
    .toBeVisible()
    .withTimeout(1000)
}

export { navigateToEditDictionaryScreen }
