const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('../tsconfig');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRunner: 'jest-circus/runner',
  testTimeout: 120000,
  setupFilesAfterEnv: ['./setup.ts'],
  reporters: ['detox/runners/jest/streamlineReporter'],
  verbose: true,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/../', // it will map jest to the parent dir so setup.ts cwd will be '..'
  }),
};
