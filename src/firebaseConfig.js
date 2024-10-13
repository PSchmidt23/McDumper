// src/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore
import { getStorage } from 'firebase/storage';     // Import Storage

const firebaseConfig = {
    apiKey: "AIzaSyB8w6Hrwq6WsZDrZQz0ZqM-0bnr6geOy2A",
    authDomain: "mcdumper-36b77.firebaseapp.com",
    projectId: "mcdumper-36b77",
    storageBucket: "mcdumper-36b77.appspot.com",
    messagingSenderId: "848104218864",
    appId: "1:848104218864:web:79e96e7acdacec894b2235"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Cloud Firestore
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

export { auth, db, storage };
