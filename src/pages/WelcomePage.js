// src/pages/WelcomePage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/WelcomePage.css'; // Correct import path

const WelcomePage = () => {
  const navigate = useNavigate();

  const navigateToSignIn = () => {
    navigate('/sign-in');
  };

  return (
    <div className="welcome-container">
      <h1 className="app-title">McDumper</h1>
      <div className="caption-and-button">
        <p className="app-caption">Best Place to Dump</p>
        <button
          className="get-started-button"
          onClick={navigateToSignIn}
          aria-label="Get Started"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
