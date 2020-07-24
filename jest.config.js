const { defaults: tsjPreset } = require('ts-jest/presets');
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  ...tsjPreset,
  preset: 'react-native',
  transform: tsjPreset.transform,
  testPathIgnorePatterns: ['\\.snap$', '<rootDir>/node_modules/', '<rootDir>/e2e/', '<rootDir>/migrations/'],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!((jest-)?@react-native-community|react-native|@react-navigation|react-native-gesture-handler|rn-secure-storage.*))',
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    './node_modules/react-native-gesture-handler/jestSetup.js',
    './jest.setup.js',
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
};
