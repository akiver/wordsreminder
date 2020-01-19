import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface Entity {
  id: string;
  createdAt: FirebaseFirestoreTypes.Timestamp | null;
  updatedAt: FirebaseFirestoreTypes.Timestamp | null;
}
