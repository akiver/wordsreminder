import { element, waitFor, by } from 'detox'
import { navigateToWordsScreen } from '@e2e/navigation/navigate-to-words-screen'
import { ADD_BUTTON, WORDS_SCREEN, WORD_CREATE_SCREEN } from '@e2e/ids'

const navigateToCreateWordScreen = async (dictionaryName: string) => {
  await navigateToWordsScreen(dictionaryName)
  await element(by.id(ADD_BUTTON(WORDS_SCREEN))).tap()
  await waitFor(element(by.id(WORD_CREATE_SCREEN)))
    .toBeVisible()
    .withTimeout(1000)
}

export { navigateToCreateWordScreen }
