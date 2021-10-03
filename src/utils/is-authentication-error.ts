type AuthenticationError = {
  name: string;
};

export const isAuthenticationError = (error: unknown): error is AuthenticationError => {
  return (error as AuthenticationError).name !== undefined;
};
