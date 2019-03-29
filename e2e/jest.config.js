const { pathsToModuleNameMapper } = require('ts-jest/utils')
const { compilerOptions } = require('../tsconfig')

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./setup.ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/../', // it will map jest to the parent dir so setup.ts cwd will be '..'
  }),
}
