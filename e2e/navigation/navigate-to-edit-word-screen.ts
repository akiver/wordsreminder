import { element, waitFor, by } from 'detox'
import { navigateToWordsScreen } from '@e2e/navigation/navigate-to-words-screen'
import { WORDS_ROW, WORDS_ROW_EDIT, WORD_EDIT_SCREEN } from '@e2e/ids'

const navigateToEditWordScreen = async (
  dictionaryId: string,
  wordId: string
) => {
  await navigateToWordsScreen(dictionaryId)
  await element(by.id(WORDS_ROW(wordId))).swipe('left')
  await element(by.id(WORDS_ROW_EDIT(wordId))).tap()
  await waitFor(element(by.id(WORD_EDIT_SCREEN)))
    .toBeVisible()
    .withTimeout(1000)
}

export { navigateToEditWordScreen }
