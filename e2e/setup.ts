require('dotenv').config(); // eslint-disable-line

import { E2E_COLLECTION_DICTIONARIES, E2E_COLLECTION_WORDS } from '@e2e/constants';
import { db, admin } from '@e2e/database/db';
import { deleteCollection } from '@e2e/database/delete-collection';
import { cleanup, init } from 'detox';
import config from '../detox.config';

beforeAll(async () => {
  await init(config, { initGlobals: false });
});

afterAll(async () => {
  await cleanup();
  await deleteCollection(db, E2E_COLLECTION_DICTIONARIES);
  await deleteCollection(db, E2E_COLLECTION_WORDS);
  await admin.app().delete();
});
