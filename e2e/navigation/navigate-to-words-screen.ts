import { element, waitFor, by } from 'detox'
import { DICTIONARIES_ROW, WORDS_SCREEN } from '@e2e/ids'

const navigateToWordsScreen = async (dictionaryId: string) => {
  await waitFor(element(by.id(DICTIONARIES_ROW(dictionaryId))))
    .toBeVisible()
    .withTimeout(3000)
  await element(by.id(DICTIONARIES_ROW(dictionaryId))).tap()
  await waitFor(element(by.id(WORDS_SCREEN)))
    .toBeVisible()
    .withTimeout(1000)
}

export { navigateToWordsScreen }
