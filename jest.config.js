const { defaults: tsjPreset } = require('ts-jest/presets');
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  ...tsjPreset,
  preset: 'react-native',
  transform: tsjPreset.transform,
  testPathIgnorePatterns: ['\\.snap$', '<rootDir>/node_modules/', '<rootDir>/e2e/', '<rootDir>/migrations/'],
  transformIgnorePatterns: ['node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation)'],
  forceExit: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
};
