import firestore from '@react-native-firebase/firestore';
import { WORDS, DICTIONARIES } from '@constants/database';
import { isStringEmpty } from '@utils/is-string-empty';
import { getErrorMessageFromFirestoreError } from '@utils/get-error-message-from-firestore-error';

export const createWord = async (
  dictionaryId: string,
  value?: string,
  signification?: string,
  description?: string
) => {
  try {
    if (isStringEmpty(dictionaryId)) {
      throw new Error('A dictionary ID is required.');
    }

    if (isStringEmpty(value)) {
      throw new Error('A value is required.');
    }
    if (isStringEmpty(signification)) {
      throw new Error('A signification is required.');
    }

    const words = firestore().collection(WORDS);
    const snap = await words.where('dictionary', '==', dictionaryId).where('value', '==', value).get();

    if (!snap.empty) {
      throw new Error('This word already exists in this dictionary.');
    }

    const word = await words.add({
      value,
      signification,
      description,
      dictionary: dictionaryId,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

    const dictionary = firestore().collection(DICTIONARIES).doc(dictionaryId);

    await dictionary.update({
      words: firestore.FieldValue.arrayUnion(word.id),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    throw new Error(getErrorMessageFromFirestoreError(error));
  }
};
