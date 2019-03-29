const { defaults: tsjPreset } = require('ts-jest/presets')
const { pathsToModuleNameMapper } = require('ts-jest/utils')
const { compilerOptions } = require('./tsconfig')

module.exports = {
  ...tsjPreset,
  preset: 'react-native',
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
  setupFilesAfterEnv: ['./setupTest.ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
}
