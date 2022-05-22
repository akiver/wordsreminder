import firestore from '@react-native-firebase/firestore';
import { WORDS, DICTIONARIES } from '@constants/database';
import { handleError } from '@services/handle-error';
import { Dictionary } from '@models/dictionary';

export async function deleteDictionary(dictionary: Dictionary) {
  try {
    const words = firestore().collection(WORDS);
    for (const wordId of dictionary.words) {
      await words.doc(wordId).delete();
    }
    await firestore().collection(DICTIONARIES).doc(dictionary.id).delete();
  } catch (error) {
    handleError(error);
  }
}
