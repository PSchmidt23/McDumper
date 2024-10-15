// src/firebase/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'mcdumper-36b77.firebaseapp.com',
  projectId: 'mcdumper-36b77',
  storageBucket: 'mcdumper-36b77.appspot.com',
  messagingSenderId: '848104218864',
  appId: '1:848104218864:web:79e96e7acdacec894b2235',
  // Uncomment the following line if you have a measurement ID
  // measurementId: 'G-XXXXXXXXXX',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export the initialized services
export { app, auth, db, storage };
