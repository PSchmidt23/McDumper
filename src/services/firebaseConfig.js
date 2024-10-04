// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8w6Hrwq6WsZDrZQz0ZqM-0bnr6geOy2A",
  authDomain: "mcdumper-36b77.firebaseapp.com",
  projectId: "mcdumper-36b77",
  storageBucket: "mcdumper-36b77.appspot.com",
  messagingSenderId: "848104218864",
  appId: "1:848104218864:web:79e96e7acdacec894b2235",
  measurementId: "G-0NPEHDSPNS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
