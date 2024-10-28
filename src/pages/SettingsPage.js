// src/pages/SettingsPage.js

import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { auth, db, storage } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './SettingsPage.css';

const SettingsPage = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [instagram, setInstagram] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/sign-in');
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFirstName(userData.firstName || '');
          setLastName(userData.lastName || '');
          setInstagram(userData.instagram || '');
          setProfilePictureUrl(userData.profilePicture || '');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data.');
      }
    };

    fetchUserData();
  }, [currentUser, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const updatedData = {
        firstName,
        lastName,
        instagram,
      };

      if (profilePicture) {
        const profilePicRef = ref(storage, `profilePictures/${currentUser.uid}`);
        await uploadBytes(profilePicRef, profilePicture);
        const profilePicUrl = await getDownloadURL(profilePicRef);
        updatedData.profilePicture = profilePicUrl;
        setProfilePictureUrl(profilePicUrl);
      }

      await updateDoc(userDocRef, updatedData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully.');
      navigate('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error.code, error.message);
      toast.error('Failed to sign out. Please try again.');
    }
  };

  if (!currentUser) {
    return <p>Loading...</p>;
  }

  return (
    <div className="settings-page-container">
      <h2>Settings</h2>
      <form onSubmit={handleSave} className="settings-form">
        <label>
          Profile Picture:
          <div className="profile-picture-preview">
            {profilePictureUrl ? (
              <img src={profilePictureUrl} alt="Profile" />
            ) : (
              <div className="placeholder">No Image</div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files[0])}
          />
        </label>
        <label>
          First Name:
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
        <label>
          Instagram Handle:
          <input
            type="text"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
        </label>
        <div className="settings-buttons">
          <button type="submit">Save Changes</button>
          <button type="button" onClick={handleSignOut}>
            Log Out
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
