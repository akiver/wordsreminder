// Signin
export const SIGNIN_SCREEN = 'signin-screen'
export const SIGNIN_INPUT_EMAIL = 'auth-input-email'
export const SIGNIN_INPUT_PASSWORD = 'auth-input-password'
export const SIGNIN_LINK_SIGNUP = 'signup-button'
export const SIGNIN_SUBMIT_BUTTON = 'signin-submit-button'

// Signup
export const SIGNUP_SCREEN = 'signup-screen'
export const SIGNUP_INPUT_EMAIL = 'signup-input-email'
export const SIGNUP_INPUT_PASSWORD = 'signup-input-password'
export const SIGNUP_LINK_SIGNIN = 'signup-link-signin'
export const SIGNUP_SUBMIT_BUTTON = 'signup-submit-button'

// Create dictionary screen
export const DICTIONARY_CREATE_SCREEN = 'dictionary-create-screen'
export const DICTIONARY_CREATE_INPUT_NAME = 'dictionary-create-input-name'

// Dictionaries screen
export const DICTIONARIES_SCREEN = 'dictionaries-screen'
export const DICTIONARIES_ROW = (dictionaryId: string) =>
  `dictionary-${dictionaryId}`
export const DICTIONARIES_ROW_EDIT = (dictionaryId: string) =>
  `dictionary-edit-action-${dictionaryId}`
export const DICTIONARIES_ROW_DELETE = (dictionaryId: string) =>
  `dictionary-delete-action-${dictionaryId}`
export const DICTIONARIES_ROW_NAME = (dictionaryId: string) =>
  `dictionary-name-${dictionaryId}`
export const DICTIONARIES_ROW_WORDS_COUNT = 'dictionary-words-count'
export const DICTIONARIES_ROW_UPDATED_AT = 'dictionary-updated-at'

// Dictionary edit screen
export const DICTIONARY_EDIT_SCREEN = 'dictionary-edit-screen'
export const DICTIONARY_EDIT_INPUT_NAME = 'dictionary-edit-input-name'

// Settings screen
export const SETTINGS_SCREEN = 'settings-screen'
export const SETTINGS_THEME_BUTTON = 'settings-theme-button'
export const SETTINGS_SIGNOUT_BUTTON = 'settings-signout-button'

// Word create screen
export const WORD_CREATE_SCREEN = 'word-create-screen'
export const WORD_CREATE_INPUT_VALUE = 'word-create-input-value'
export const WORD_CREATE_INPUT_SIGNIFICATION = 'word-create-input-signification'
export const WORD_CREATE_INPUT_DESCRIPTION = 'word-create-input-description'

// Word edit screen
export const WORD_EDIT_SCREEN = 'word-edit-screen'
export const WORD_EDIT_INPUT_VALUE = 'word-edit-input-value'
export const WORD_EDIT_INPUT_SIGNIFICATION = 'word-edit-input-signification'
export const WORD_EDIT_INPUT_DESCRIPTION = 'word-edit-input-description'

// Words screen
export const WORDS_SCREEN = 'words-screen'
export const WORDS_ROW = (wordId: string) => `word-${wordId}`
export const WORDS_ROW_EDIT = (wordId: string) => `word-edit-action-${wordId}`
export const WORDS_ROW_DELETE = (wordId: string) =>
  `word-delete-action-${wordId}`
export const WORDS_ROW_VALUE = (wordId: string) => `word-value-${wordId}`
export const WORDS_ROW_SIGNIFICATION = 'word-signification'
export const WORDS_ROW_DESCRIPTION = 'word-description'

// Tabnav bottom
export const TABNAV_DICTIONARIES_FOCUSED = 'tabnav-dictionaries-focused'
export const TABNAV_DICTIONARIES_UNFOCUSED = 'tabnav-dictionaries-unfocused'
export const TABNAV_SETTINGS_FOCUSED = 'tabnav-settings-focused'
export const TABNAV_SETTINGS_UNFOCUSED = 'tabnav-settings-unfocused'

// Misc
export const ADD_BUTTON = (testID: string) => `button-add-${testID}`
export const ERROR_MESSAGE = 'error-message'
export const EMPTY_LIST_MESSAGE = 'empty-list-message'
export const SAVE_BUTTON = 'save-button'
export const FILTER_OPEN_BUTTON = 'filter-open-button'
export const FILTER_CLOSE_BUTTON = 'filter-close-button'
