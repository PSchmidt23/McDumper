// src/components/withAuthProtection.js

import React, { useEffect } from 'react';
import { firebase } from '../services/firebaseConfig';

const withAuthProtection = (WrappedComponent, navigateToWelcome) => {
  return (props) => {
    useEffect(() => {
      const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
          navigateToWelcome();
        }
      });
      return () => unsubscribe();
    }, []); // Removed navigateToWelcome from dependency array

    return <WrappedComponent {...props} />;
  };
};

export default withAuthProtection;