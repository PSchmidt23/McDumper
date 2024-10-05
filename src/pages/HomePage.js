// src/pages/HomePage.js

import React from 'react';
import { firebase } from '../services/firebaseConfig';

const HomePage = ({ navigateToWelcome }) => {
  const user = firebase.auth().currentUser;

  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log('User signed out');
        navigateToWelcome();
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <div>
      <h1>Welcome to McDumper!</h1>
      {user && (
        <div>
          <p>You are signed in as: {user.phoneNumber}</p>
          {user.displayName && <p>Name: {user.displayName}</p>}
        </div>
      )}
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default HomePage;
