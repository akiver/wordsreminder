import auth from '@react-native-firebase/auth';
import { isStringEmpty } from '@utils/is-string-empty';
import { getErrorMessageFromFirestoreError } from '@utils/get-error-message-from-firestore-error';

export const signIn = async (email?: string, password?: string) => {
  try {
    if (isStringEmpty(email)) {
      throw new Error('Email is required.');
    }

    if (isStringEmpty(password)) {
      throw new Error('Password is required.');
    }

    await auth().signInWithEmailAndPassword(email as string, password as string);
  } catch (error) {
    throw new Error(getErrorMessageFromFirestoreError(error));
  }
};
