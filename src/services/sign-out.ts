import auth from '@react-native-firebase/auth';
import { handleError } from './handle-error';

export async function signOut() {
  try {
    if (auth().currentUser !== null) {
      await auth().signOut();
    }
  } catch (error) {
    handleError(error);
  }
}
