// src/services/firebaseConfig.js

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8w6Hrwq6WsZDrZQz0ZqM-0bnr6geOy2A",
  authDomain: "mcdumper-36b77.firebaseapp.com",
  projectId: "mcdumper-36b77",
  storageBucket: "mcdumper-36b77.appspot.com",
  messagingSenderId: "848104218864",
  appId: "1:848104218864:web:79e96e7acdacec894b2235"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
const auth = firebase.auth();

export { auth };
