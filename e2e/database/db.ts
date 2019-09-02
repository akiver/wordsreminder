import admin, { firestore } from 'firebase-admin'

admin.initializeApp({
  // eslint-disable-next-line
  credential: admin.credential.cert(require('../google-services.json')),
})

const db = firestore()

export { admin, db }
