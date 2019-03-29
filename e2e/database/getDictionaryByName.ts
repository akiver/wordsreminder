import { db } from '@e2e/database/db'
import { E2E_COLLECTION_DICTIONARIES } from '@e2e/constants'
import { Dictionary } from '@models/dictionary'

const getDictionaryByName = async (name: string) => {
  const doc = await db
    .collection(E2E_COLLECTION_DICTIONARIES)
    .where('name', '==', name)
    .get()

  const dictionary = doc.docs[0].data() as Dictionary
  dictionary.id = doc.docs[0].id

  return dictionary
}

export { getDictionaryByName }
