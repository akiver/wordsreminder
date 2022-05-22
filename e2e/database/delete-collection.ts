import { Firestore, Query } from '@google-cloud/firestore';

function deleteQueryBatch(
  db: Firestore,
  query: Query,
  batchSize: number,
  resolve: (value?: unknown) => void,
  reject: () => void
) {
  query
    .get()
    .then((snapshot) => {
      if (snapshot.size === 0) {
        return 0;
      }

      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      return batch.commit().then(() => {
        return snapshot.size;
      });
    })
    .then((numDeleted) => {
      if (numDeleted === 0) {
        resolve();
        return;
      }

      process.nextTick(() => {
        deleteQueryBatch(db, query, batchSize, resolve, reject);
      });
    })
    .catch(reject);
}

export function deleteCollection(db: Firestore, collectionPath: string) {
  const batchSize = 100;
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, batchSize, resolve, reject);
  });
}
