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
    'plugin:react-hooks/recommended',
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
    '/.bundle',
    'yarn.lock',
    'jest.config.js',
    '*.snap',
    'LICENSE',
    'Gemfile',
    '.*-version',
    '*.md',
    '*.yml',
    '*.ai',
  ],
};
