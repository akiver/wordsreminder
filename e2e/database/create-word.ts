import { firestore } from 'firebase-admin'
import { db, admin } from '@e2e/database/db'
import {
  E2E_COLLECTION_DICTIONARIES,
  E2E_COLLECTION_WORDS,
} from '@e2e/constants'

const createWord = async (
  dictionaryId: string,
  value: string,
  signification: string,
  description: string | null = null
) => {
  const dictionary = firestore()
    .collection(E2E_COLLECTION_DICTIONARIES)
    .doc(dictionaryId)

  const word = await db.collection(E2E_COLLECTION_WORDS).add({
    value,
    signification,
    description,
    dictionary: dictionaryId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  })

  await dictionary.update({
    words: firestore.FieldValue.arrayUnion(word.id),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  })

  return word
}

export { createWord }
