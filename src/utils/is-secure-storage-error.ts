type SecureStorageError = {
  code: string;
};

export const isSecureStorageError = (error: unknown): error is SecureStorageError => {
  return (error as SecureStorageError).code !== undefined;
};
