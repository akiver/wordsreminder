import auth from '@react-native-firebase/auth';
import { getErrorMessageFromFirestoreError } from '@utils/get-error-message-from-firestore-error';

export const signOut = async () => {
  try {
    if (auth().currentUser !== null) {
      await auth().signOut();
    }
  } catch (error) {
    throw new Error(getErrorMessageFromFirestoreError(error));
  }
};
