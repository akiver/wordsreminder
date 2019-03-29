import { Entity } from '@models/entity'
import { DocumentSnapshot } from 'react-native-firebase/firestore'

export interface Dictionary extends Entity {
  name: string
  words: string[]
}

export const documentSnapshotToDictionary = (snap: DocumentSnapshot) => {
  const dictionary = snap.data() as Dictionary
  dictionary.id = snap.id!

  return dictionary
}
