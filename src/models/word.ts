import { Entity } from '@models/entity';
import { DocumentSnapshot } from 'react-native-firebase/firestore';

export interface Word extends Entity {
  value: string;
  signification: string;
  description?: string;
  dictionary: string;
}

export const documentSnapshotToWord = (snap: DocumentSnapshot) => {
  const word = snap.data() as Word;
  if (snap.id === null) {
    throw new Error('word snapshot document id not found');
  }
  word.id = snap.id;

  return word;
};
