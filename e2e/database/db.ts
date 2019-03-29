import admin, { firestore } from 'firebase-admin'

admin.initializeApp({
  credential: admin.credential.cert(require('../google-services.json')),
})

const db = firestore()

export { admin, db }
