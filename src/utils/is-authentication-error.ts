type AuthenticationError = {
  name: string;
};

export function isAuthenticationError(error: unknown): error is AuthenticationError {
  return (error as AuthenticationError).name !== undefined;
}
