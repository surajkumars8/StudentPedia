// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyDQsmnVoFP1kOe8igXgqYN3p0ycZKy3e5A",
  authDomain: "studentpedia-41588.firebaseapp.com",
  projectId: "studentpedia-41588",
  storageBucket: "studentpedia-41588.appspot.com",
  messagingSenderId: "766199013951",
  appId: "1:766199013951:web:dfdb03ae7967a840290e8a",
  measurementId: "G-PR3CEFPBHT"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const db = getFirestore(app);


export { app, auth, firestore, storage,db };