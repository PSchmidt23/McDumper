// src/pages/ProfileSetup.js

import React, { useState, useContext } from 'react';
import { db, storage } from '../firebaseConfig';
import { AuthContext } from '../AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import '../styles/ProfileSetup.css';
import { toast } from 'react-toastify'; // Optional: For toast notifications

const ProfileSetup = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleProfileSetup = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!displayName.trim()) {
      toast.error('Display Name is required.');
      return;
    }

    setIsUpdating(true);

    try {
      console.log('Starting profile setup...');

      const userDocRef = doc(db, 'users', currentUser.uid);

      let profilePictureLink = currentUser.profilePicture || '';

      if (profilePicture) {
        const imageRef = ref(storage, `profilePictures/${currentUser.uid}/${uuidv4()}`);
        await uploadBytes(imageRef, profilePicture);
        profilePictureLink = await getDownloadURL(imageRef);
        console.log('Profile picture uploaded:', profilePictureLink);
      }

      await updateDoc(userDocRef, {
        displayName,
        email,
        instagram,
        profilePicture: profilePictureLink,
      });

      console.log('User document updated successfully.');

      toast.success('Profile setup complete!');
      navigate('/profile'); // Navigate to profile page
    } catch (error) {
      console.error('Error setting up profile:', error.code, error.message);
      toast.error('Failed to set up profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="profile-setup-container">
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleProfileSetup} className="profile-form">
        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
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

        <button type="submit" disabled={isUpdating} className="auth-button">
          {isUpdating ? 'Processing...' : 'Next'}
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup;
