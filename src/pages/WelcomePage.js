import React from 'react';

const WelcomePage = ({ navigateToSignIn, navigateToSignUp }) => {
  return (
    <div className="welcome-container">
      <h1 className="welcome-title">McDumper</h1>
      <p className="welcome-caption">Built for Dumpys</p>
      <button className="welcome-btn" onClick={navigateToSignIn}>Sign In</button>
      <button className="welcome-btn" onClick={navigateToSignUp}>Sign Up</button>
    </div>
  );
};

export default WelcomePage;
