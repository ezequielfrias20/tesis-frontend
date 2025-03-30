import {
    addDoc,
    collection,
    getDocs,
  } from 'firebase/firestore';

  import { db } from '../../firebaseConfig'

  const collectionName = 'wells'
  
  export const getWells = async () => {
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

  export const createWell = async (payload: any) => {
    try {
        const docRef = await addDoc(collection(db, collectionName), payload);
    
        return docRef.id;
      } catch (e) {
        console.error('Error adding document: ', e);
      }
  
  };