// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: "AIzaSyD-a-bcwGNmahzuH47B6lyGDSmCvdW4JHU",
  authDomain: "tesis-1e8d3.firebaseapp.com",
  projectId: "tesis-1e8d3",
  storageBucket: "tesis-1e8d3.firebasestorage.app",
  messagingSenderId: "1096407588878",
  appId: "1:1096407588878:web:a5025098e66ed7d4abdc5f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);