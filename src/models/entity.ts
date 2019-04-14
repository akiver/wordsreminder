import { Timestamp } from 'react-native-firebase/firestore'

export interface Entity {
  id: string
  createdAt: Timestamp | null
  updatedAt: Timestamp | null
}
