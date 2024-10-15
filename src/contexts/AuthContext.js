// src/contexts/AuthContext.js

import React, { createContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebaseConfig'; // Updated import path
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

// Create the AuthContext
export const AuthContext = createContext();

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null); // To handle and display authentication errors

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        try {
          // Listen to real-time updates on the user document
          const unsubscribeFirestore = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              // Determine if the user is new based on the presence of required profile fields
              const isNewUser =
                !data.displayName || data.displayName.trim() === '' ||
                !data.email || data.email.trim() === '';
              setCurrentUser({ ...user, ...data, isNewUser });
            } else {
              // If the user document doesn't exist, create it
              const isNewUser = true;
              setDoc(userDocRef, {
                uid: user.uid,
                phoneNumber: user.phoneNumber || '',
                email: user.email || '',
                displayName: '',
                profilePicture: '',
                instagram: '',
                createdAt: serverTimestamp(),
              });
              setCurrentUser({ ...user, isNewUser });
            }
          });

          // Cleanup Firestore listener when auth state changes
          return () => {
            unsubscribeFirestore();
          };
        } catch (error) {
          console.error('Error fetching user data:', error.code, error.message);
          setAuthError(error); // Store the error to display in the UI
          setCurrentUser(null);
        } finally {
          setAuthLoading(false);
        }
      } else {
        setCurrentUser(null);
        setAuthLoading(false);
      }
    });

    // Cleanup auth listener on unmount
    return () => {
      unsubscribeAuth();
    };
  }, []);

  if (authLoading) {
    return <p>Loading...</p>; // Optional: Replace with a spinner component for better UX
  }

  if (authError) {
    return <p>Error: {authError.message}</p>; // Display error message to the user
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
