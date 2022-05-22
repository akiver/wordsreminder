import admin, { firestore } from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert(require('../google-services.json')), // eslint-disable-line
});

export const db = firestore();

export { admin };
