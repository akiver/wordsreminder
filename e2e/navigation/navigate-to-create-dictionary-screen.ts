import { element, waitFor, by } from 'detox';
import { DICTIONARIES_SCREEN_ID, ADD_BUTTON, DICTIONARY_CREATE_SCREEN_ID } from '@e2e/ids';

export const navigateToCreateDictionaryScreen = async () => {
  await waitFor(element(by.id(DICTIONARIES_SCREEN_ID))).toBeVisible();
  await element(by.id(ADD_BUTTON(DICTIONARIES_SCREEN_ID))).tap();
  await waitFor(element(by.id(DICTIONARY_CREATE_SCREEN_ID)))
    .toBeVisible()
    .withTimeout(1000);
};
