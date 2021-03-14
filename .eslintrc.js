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
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: [
    'node_modules',
    'ios',
    'android',
    'assets',
    '/*.js',
    'yarn.lock',
    'jest.config.js',
    '*.snap',
    'LICENSE',
    '*.md',
    '*.yml',
    '*.ai',
  ],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'no-empty-pattern': 0,
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
