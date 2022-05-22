type SecureStorageError = {
  code: string;
};

export function isSecureStorageError(error: unknown): error is SecureStorageError {
  return (error as SecureStorageError).code !== undefined;
}
