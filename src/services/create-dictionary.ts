import firestore from '@react-native-firebase/firestore';
import { DICTIONARIES } from '@constants/database';
import { isStringEmpty } from '@utils/is-string-empty';
import { handleError } from '@services/handle-error';

export const createDictionary = async (name: string) => {
  try {
    if (isStringEmpty(name)) {
      throw new Error('A name is required.');
    }

    const dictionaries = firestore().collection(DICTIONARIES);
    const snap = await dictionaries.where('name', '==', name).get();
    if (!snap.empty) {
      throw new Error('This dictionary already exists.');
    }

    await dictionaries.add({
      name,
      words: [],
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    handleError(error);
  }
};
