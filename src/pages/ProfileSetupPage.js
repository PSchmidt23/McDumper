// src/pages/ProfileSetupPage.js

import React, { useState } from 'react';
import { firebase } from '../services/firebaseConfig';

const ProfileSetupPage = ({ navigateToHome }) => {
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    const user = firebase.auth().currentUser;

    if (user) {
      user.updateProfile({ displayName })
        .then(() => {
          console.log('Profile updated');
          navigateToHome();
        })
        .catch((error) => {
          console.error('Error updating profile:', error);
          setError('Failed to update profile. Please try again.');
        });
    } else {
      setError('No user is signed in.');
    }
  };

  return (
    <div>
      <h1>Set Up Your Profile</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="Enter your name"
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default ProfileSetupPage;
