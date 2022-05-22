import { isStringEmpty } from '@utils/is-string-empty';
import firestore from '@react-native-firebase/firestore';
import { DICTIONARIES } from '@constants/database';
import { handleError } from '@services/handle-error';
import { Dictionary } from '@models/dictionary';

export async function updateDictionary(dictionary: Dictionary) {
  try {
    const { name } = dictionary;
    if (isStringEmpty(name)) {
      throw new Error('A name is required.');
    }

    const dictionaries = firestore().collection(DICTIONARIES);
    const snap = await dictionaries.where('name', '==', name).get();
    if (!snap.empty) {
      throw new Error('This dictionary already exists.');
    }

    await dictionaries.doc(dictionary.id).update({
      name,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    handleError(error);
  }
}
