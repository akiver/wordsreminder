import path from 'path';
import { readdirSync } from 'fs';
import 'dotenv/config';

readdirSync(path.join('', 'migrations'))
  .filter((file) => file !== 'index.ts' && file.endsWith('.ts'))
  .forEach(async (file) => {
    try {
      console.log(`migrating ${file}...`);
      const migration = require(`./${file}`); //eslint-disable-line
      await migration.run();
    } catch (err) {
      console.error(err);
    } finally {
      console.log(`migration ${file} done.`);
    }
  });
