import { isStringEmpty } from '@utils/is-string-empty';
import { WORDS } from '@constants/database';
import firestore from '@react-native-firebase/firestore';
import { getErrorMessageFromFirestoreError } from '@utils/get-error-message-from-firestore-error';
import { Word } from '@models/word';

export const updateWord = async (word: Word) => {
  try {
    const { value } = word;
    if (isStringEmpty(value)) {
      throw new Error('Word is required.');
    }

    const { signification } = word;
    if (isStringEmpty(signification)) {
      throw new Error('Signification is required.');
    }

    const words = firestore().collection(WORDS);
    await words.doc(word.id).update({
      value,
      signification,
      description: word.description,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    throw new Error(getErrorMessageFromFirestoreError(error));
  }
};
