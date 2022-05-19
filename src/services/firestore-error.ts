export type FirestoreError = {
  code: string;
};

export function isFirestoreError(error: unknown): error is FirestoreError {
  return (error as FirestoreError).code !== undefined;
}
