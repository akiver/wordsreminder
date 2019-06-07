const { defaults: tsjPreset } = require('ts-jest/presets') // eslint-disable-line
const { pathsToModuleNameMapper } = require('ts-jest/utils') // eslint-disable-line
const { compilerOptions } = require('./tsconfig') // eslint-disable-line

module.exports = {
  ...tsjPreset,
  preset: '@testing-library/react-native',
  transform: {
    ...tsjPreset.transform,
    '\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
  },
  testPathIgnorePatterns: [
    '\\.snap$',
    '<rootDir>/node_modules/',
    '<rootDir>/e2e/',
    '<rootDir>/migrations/',
  ],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!((jest-)?react-native|react-navigation|@react-navigation|react-native-gesture-handler/.*))',
  ],
  setupFilesAfterEnv: [
    './node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
}
