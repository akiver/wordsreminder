module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    // The following plugin must be at the end.
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md#usage-with-prettier
    'prettier/@typescript-eslint',
  ],
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: [
    'babel.config.js',
    'metro.config.js',
    'prettier.config.js',
    'jest.config.js',
    'jest.setup.js',
    '*.snap',
  ],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'no-empty-pattern': 0,
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
