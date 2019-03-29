import { db } from '@e2e/database/db'
import { E2E_COLLECTION_WORDS } from '@e2e/constants'
import { Word } from '@models/word'

const getWordByValue = async (value: string) => {
  const doc = await db
    .collection(E2E_COLLECTION_WORDS)
    .where('value', '==', value)
    .get()

  const word = doc.docs[0].data() as Word
  word.id = doc.docs[0].id

  return word
}

export { getWordByValue }
