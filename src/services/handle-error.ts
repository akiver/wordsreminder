import { getErrorMessageFromFirestoreError } from '@utils/get-error-message-from-firestore-error';
import { isFirestoreError } from './firestore-error';

export function handleError(error: unknown) {
  if (isFirestoreError(error)) {
    throw new Error(getErrorMessageFromFirestoreError(error));
  }

  throw error;
}
