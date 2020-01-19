const { pathsToModuleNameMapper } = require('ts-jest/utils'); // eslint-disable-line
const { compilerOptions } = require('../tsconfig'); // eslint-disable-line

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./setup.ts'],
  reporters: ['detox/runners/jest/streamlineReporter'],
  verbose: true,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/../', // it will map jest to the parent dir so setup.ts cwd will be '..'
  }),
};
