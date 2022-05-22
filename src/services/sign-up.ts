import auth from '@react-native-firebase/auth';
import { isStringEmpty } from '@utils/is-string-empty';
import { handleError } from './handle-error';

export async function signUp(email?: string, password?: string) {
  try {
    if (isStringEmpty(email)) {
      throw new Error('Email is required.');
    }

    if (isStringEmpty(password)) {
      throw new Error('Password is required.');
    }

    await auth().createUserWithEmailAndPassword(email as string, password as string);
  } catch (error) {
    handleError(error);
  }
}
