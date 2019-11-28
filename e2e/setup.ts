require('dotenv').config()

import { E2E_COLLECTION_DICTIONARIES, E2E_COLLECTION_WORDS } from '@e2e/constants'
import { db, admin } from '@e2e/database/db'
import { deleteCollection } from '@e2e/database/delete-collection'
import { cleanup, init } from 'detox'
import adapter from 'detox/runners/jest/adapter'
import specReporter from 'detox/runners/jest/specReporter'

const config = require('../package.json').detox

jest.setTimeout(120000)
// eslint-disable-next-line
// @ts-ignore When using @types/jasmine there are conflicts with @types/jest
jasmine.getEnv().addReporter(adapter)
// eslint-disable-next-line
// @ts-ignore
jasmine.getEnv().addReporter(specReporter)

beforeAll(async () => {
  await init(config, { initGlobals: false })
})

beforeEach(async () => {
  await adapter.beforeEach()
})

afterAll(async () => {
  await adapter.afterAll()
  await cleanup()
  await deleteCollection(db, E2E_COLLECTION_DICTIONARIES)
  await deleteCollection(db, E2E_COLLECTION_WORDS)
  await admin.app().delete()
})
