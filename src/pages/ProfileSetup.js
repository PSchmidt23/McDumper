// src/pages/ProfileSetup.js

import React, { useState, useContext } from 'react';
import { db, storage } from '../firebase/firebaseConfig'; // Updated import path
import { AuthContext } from '../contexts/AuthContext'; // Updated import path
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import './ProfileSetup.css'; // Updated import path
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify'; // Optional: For toast notifications

const ProfileSetup = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [message, setMessage] = useState('');

  const handleProfileSetup = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!displayName.trim()) {
      setMessage('Display Name cannot be empty.');
      return;
    }

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    try {
      let profilePictureLink = '';
      if (profilePicture) {
        const imageRef = ref(storage, `profilePictures/${currentUser.uid}/${uuidv4()}`);
        await uploadBytes(imageRef, profilePicture);
        profilePictureLink = await getDownloadURL(imageRef);
      }

      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, {
        displayName,
        email,
        instagram,
        profilePicture: profilePictureLink,
      });

      toast.success('Profile setup completed!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error setting up profile:', error);
      setMessage('Failed to set up profile.');
      toast.error('Failed to set up profile.');
    }
  };

  return (
    <div className="profile-setup-container">
      <h2>Set Up Your Profile</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleProfileSetup} className="profile-form">
        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Instagram Username"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setProfilePicture(e.target.files[0]);
          }}
        />

        <button type="submit" className="auth-button">
          Complete Setup
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup;
