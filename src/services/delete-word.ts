import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { DICTIONARIES, WORDS } from '@constants/database';
import { getErrorMessageFromFirestoreError } from '@utils/get-error-message-from-firestore-error';
import { Word } from '@models/word';

export const deleteWord = async (word: Word) => {
  try {
    const snapshot: FirebaseFirestoreTypes.QuerySnapshot = await firestore()
      .collection(DICTIONARIES)
      .where('words', 'array-contains', word.id)
      .get();

    for (const dictionary of snapshot.docs) {
      if (dictionary.id !== null) {
        await firestore()
          .collection(DICTIONARIES)
          .doc(dictionary.id)
          .update({
            words: firestore.FieldValue.arrayRemove(word.id),
          });
      }
    }

    await firestore().collection(WORDS).doc(word.id).delete();
  } catch (error) {
    throw new Error(getErrorMessageFromFirestoreError(error));
  }
};
