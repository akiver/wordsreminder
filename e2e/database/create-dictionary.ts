import { db, admin } from '@e2e/database/db'
import { E2E_COLLECTION_DICTIONARIES } from '@e2e/constants'

const createDictionary = async (name: string, words = []) => {
  return await db.collection(E2E_COLLECTION_DICTIONARIES).add({
    name,
    words,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  })
}

export { createDictionary }
