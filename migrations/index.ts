import path from 'path';
import { readdirSync } from 'fs';

require('dotenv').config();

readdirSync(path.join('', 'migrations'))
  .filter(file => file !== 'index.ts' && file.endsWith('.ts'))
  .forEach(async file => {
    try {


    
      console.log(`migrating ${file}...`);
      // eslint-disable-next-line
      const migration = require(`./${file}`);
      await migration.run();
    } catch (err) {
      console.error(err);
    } finally {
      console.log(`migration ${file} done.`);
    }
  });
