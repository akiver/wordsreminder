import { FirestoreError } from '@services/firestore-error';

export function getErrorMessageFromFirestoreError(error: FirestoreError) {
  switch (error.code) {
    case 'firestore/permission-denied':
      return 'Permission denied, check your database rules from the firebase console.';
    case 'firestore/cancelled':
      return 'Operation cancelled.';
    case 'firestore/unknown':
      return 'Unknown error.';
    case 'firestore/invalid-argument':
      return 'Invalid arguments provided.';
    case 'firestore/deadline-exceeded':
      return 'Deadline expired, please try again.';
    case 'firestore/not-found':
      return 'Document not found.';
    case 'firestore/already-exists':
      return 'Document already exists.';
    case 'firestore/resource-exhausted':
      return 'Resource exhausted, check your quota FS free space.';
    case 'firestore/failed-precondition':
      return `Operation was rejected because the system is not in a state required for the operation's execution.`;
    case 'firestore/aborted':
      return 'Operation aborted.';
    case 'firestore/out-of-range':
      return 'Operation was attempted past the valid range.';
    case 'firestore/unimplemented':
      return 'Operation is not implemented or not supported/enabled.';
    case 'firestore/internal':
      return 'Internal error.';
    case 'firestore/unavailable':
      return 'The service is currently unavailable.';
    case 'firestore/data-loss':
      return 'Unrecoverable data loss or corruption.';
    case 'firestore/unauthenticated':
      return 'The request does not have valid authentication credentials for the operation.';
    case 'auth/invalid-email':
      return 'Invalid email.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid credentials.';
    case 'auth/user-disabled':
      return 'User disabled.';
    case 'auth/weak-password':
      return 'Password is too weak.';
    case 'auth/operation-not-allowed':
      return 'User account not enabled.';
    case 'auth/email-already-in-use':
      return 'Email already in use.';
    case 'auth/network-request-failed':
      return 'A network error occurred.';
    default:
      return 'An error occurred';
  }
}
