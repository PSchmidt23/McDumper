// src/pages/WelcomePage.js

import React from 'react';

const WelcomePage = ({ navigateToSignIn }) => {
  return (
    <div>
      <h1>Welcome to McDumper</h1>
      <button onClick={navigateToSignIn}>Sign Up / Sign In</button>
    </div>
  );
};

export default WelcomePage;
