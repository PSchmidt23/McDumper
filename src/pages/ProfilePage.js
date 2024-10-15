// src/pages/ProfilePage.js

import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // Updated import path
import { auth } from '../firebase/firebaseConfig'; // Updated import path
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaCog } from 'react-icons/fa'; // Using react-icons for the settings icon
import './ProfilePage.css'; // Updated import path
import { toast } from 'react-toastify'; // Optional: For toast notifications

const ProfilePage = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

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
    return <p>Loading...</p>; // Optional: Replace with a spinner component for better UX
  }

  return (
    <div className="profile-page-container">
      <div className="profile-header">
        <h2>Your Profile</h2>
        <button onClick={handleSignOut} className="settings-button" title="Settings & Sign Out">
          <FaCog size={24} />
        </button>
      </div>
      <div className="profile-info">
        {currentUser.profilePicture ? (
          <img src={currentUser.profilePicture} alt="Profile" className="profile-picture" />
        ) : (
          <div className="profile-picture-placeholder">No Image</div>
        )}
        <p><strong>Name:</strong> {currentUser.displayName || 'N/A'}</p>
        <p><strong>Phone Number:</strong> {currentUser.phoneNumber || 'N/A'}</p>
        <p><strong>Email:</strong> {currentUser.email || 'N/A'}</p>
        <p><strong>Instagram:</strong> {currentUser.instagram || 'N/A'}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
