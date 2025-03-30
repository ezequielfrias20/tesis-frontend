import { db } from '../config/firebaseConfig';
import {
    addDoc,
    collection,
    getDocs,
  } from 'firebase/firestore';

  const collectionName = 'metrics'
  
  export const getMetrics = async () => {
    const list = [] as any;
    const querySnapshot = await getDocs(collection(db, collectionName));
    querySnapshot.forEach((doc) => {
      list.push({
        ...doc.data(),
        id: doc.id,
      });
    });
    return list;
  };

  export const createMetric = async (payload: any) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), payload);
      return docRef.id;
    } catch (e) {
      console.error('Error adding document: ', e);
      throw e; // Re-lanza el error para manejo superior
    }
  };