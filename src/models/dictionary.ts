import { Entity } from '@models/entity';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface Dictionary extends Entity {
  name: string;
  words: string[];
}

export const documentSnapshotToDictionary = (snap: FirebaseFirestoreTypes.DocumentSnapshot) => {
  const dictionary = snap.data() as Dictionary;
  if (snap.id === null) {
    throw new Error('dictionary snapshot document id not found');
  }
  dictionary.id = snap.id;

  return dictionary;
};
