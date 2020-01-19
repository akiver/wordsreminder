export const getErrorMessageFromFirestoreError = (error: Error & { code?: string }) => {
  let errorMessage = error.message;
  switch (error.code) {
    case 'firestore/permission-denied':
      errorMessage = 'Permission denied, check your database rules from the firebase console.';
      break;
    case 'firestore/cancelled':
      errorMessage = 'Operation cancelled.';
      break;
    case 'firestore/unknown':
      errorMessage = 'Unknown error.';
      break;
    case 'firestore/invalid-argument':
      errorMessage = 'Invalid arguments provided.';
      break;
    case 'firestore/deadline-exceeded':
      errorMessage = 'Deadline expired, please try again.';
      break;
    case 'firestore/not-found':
      errorMessage = 'Document not found.';
      break;
    case 'firestore/already-exists':
      errorMessage = 'Document already exists.';
      break;
    case 'firestore/resource-exhausted':
      errorMessage = 'Resource exhausted, check your quota FS free space.';
      break;
    case 'firestore/failed-precondition':
      errorMessage = `Operation was rejected because the system is not in a state required for the operation's execution.`;
      break;
    case 'firestore/aborted':
      errorMessage = 'Operation aborted.';
      break;
    case 'firestore/out-of-range':
      errorMessage = 'Operation was attempted past the valid range.';
      break;
    case 'firestore/unimplemented':
      errorMessage = 'Operation is not implemented or not supported/enabled.';
      break;
    case 'firestore/internal':
      errorMessage = 'Internal error.';
      break;
    case 'firestore/unavailable':
      errorMessage = 'The service is currently unavailable.';
      break;
    case 'firestore/data-loss':
      errorMessage = 'Unrecoverable data loss or corruption.';
      break;
    case 'firestore/unauthenticated':
      errorMessage = 'The request does not have valid authentication credentials for the operation.';
      break;
    case 'auth/invalid-email':
      errorMessage = 'Invalid email.';
      break;
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      errorMessage = 'Invalid credentials.';
      break;
    case 'auth/user-disabled':
      errorMessage = 'User disabled.';
      break;
    case 'auth/weak-password':
      errorMessage = 'Password is too weak.';
      break;
    case 'auth/operation-not-allowed':
      errorMessage = 'User account not enabled.';
      break;
    case 'auth/email-already-in-use':
      errorMessage = 'Email already in use.';
      break;
    default:
  }

  return errorMessage;
};
