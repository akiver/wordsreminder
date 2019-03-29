import { element, waitFor, by } from 'detox'
import {
  DICTIONARIES_SCREEN,
  ADD_BUTTON,
  DICTIONARY_CREATE_SCREEN,
} from '@e2e/ids'

const navigateToCreateDictionaryScreen = async () => {
  await waitFor(element(by.id(DICTIONARIES_SCREEN))).toBeVisible()
  await element(by.id(ADD_BUTTON(DICTIONARIES_SCREEN))).tap()
  await waitFor(element(by.id(DICTIONARY_CREATE_SCREEN)))
    .toBeVisible()
    .withTimeout(1000)
}

export { navigateToCreateDictionaryScreen }
