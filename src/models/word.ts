import { Entity } from '@models/entity'
import { DocumentSnapshot } from 'react-native-firebase/firestore'

export interface Word extends Entity {
  value: string
  signification: string
  description?: string
  dictionary: string
}

export const documentSnapshotToWord = (snap: DocumentSnapshot) => {
  const word = snap.data() as Word
  word.id = snap.id!

  return word
}
