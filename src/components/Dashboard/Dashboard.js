// src/components/Dashboard/Dashboard.js

import React, { useContext, useEffect, useState } from 'react';
import { auth, db, storage } from '../../firebase/firebaseConfig'; // Updated import path
import { signOut } from 'firebase/auth';
import { AuthContext } from '../../contexts/AuthContext'; // Updated import path
import { useNavigate, Link } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import './Dashboard.css'; // Updated import path
import { v4 as uuidv4 } from 'uuid';

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureURL, setProfilePictureURL] = useState('');
  const [message, setMessage] = useState('');

  // Fetch existing user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        setDisplayName(data.displayName || '');
        setEmail(data.email || '');
        setInstagram(data.instagram || '');
        setProfilePictureURL(data.profilePicture || '');
      }
    };

    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage('');

    // Simple validation
    if (!displayName.trim()) {
      setMessage('Display Name cannot be empty.');
      return;
    }

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    try {
      // Update profile picture if a new one is selected
      let profilePictureLink = profilePictureURL;
      if (profilePicture) {
        const imageRef = ref(storage, `profilePictures/${currentUser.uid}/${uuidv4()}`);
        await uploadBytes(imageRef, profilePicture);
        profilePictureLink = await getDownloadURL(imageRef);
      }

      // Update user document in Firestore
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        displayName,
        email,
        instagram,
        profilePicture: profilePictureLink,
      });

      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile.');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome to Your Dashboard!</h2>
      {currentUser && (
        <p>
          Signed in as: <strong>{currentUser.phoneNumber}</strong>
        </p>
      )}

      {message && <p className="message">{message}</p>}

      <form onSubmit={handleProfileUpdate} className="profile-form">
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
          Update Profile
        </button>
      </form>

      <Link to={`/profile/${currentUser.uid}`} className="profile-link">
        View Your Profile
      </Link>

      <button onClick={handleSignOut} className="sign-out-button">
        Sign Out
      </button>
    </div>
  );
};

export default Dashboard;
