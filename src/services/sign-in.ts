import auth from '@react-native-firebase/auth';
import { handleError } from '@services/handle-error';
import { isStringEmpty } from '@utils/is-string-empty';

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
    handleError(error);
  }
};
