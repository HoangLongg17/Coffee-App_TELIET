import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey : "AIzaSyDXPegSGjDRqHVbZZM7g7xOhHMw71XIOjI" , 
  authDomain : "telietapp.firebaseapp.com" , 
  projectId : "telietapp" , 
  storageBucket : "telietapp.firebasestorage.app" , 
  messagingSenderId : "54019229268" , 
  appId : "1:54019229268:web:53dccded96ef61b4f8cfc1" , 
  measurementId : "G-88BZYVQ0HT" 
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db };

