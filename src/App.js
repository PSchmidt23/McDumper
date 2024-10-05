// src/App.js

import React, { useState } from 'react';
import WelcomePage from './pages/WelcomePage';
import SignInPage from './components/SignInPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import HomePage from './pages/HomePage';
import withAuthProtection from './components/withAuthProtection';

function App() {
  const [currentPage, setCurrentPage] = useState('welcome');

  const navigateToSignIn = () => {
    console.log('Navigating to SignInPage');
    setCurrentPage('signIn');
  };

  const navigateToProfileSetup = () => {
    console.log('Navigating to ProfileSetupPage');
    setCurrentPage('profileSetup');
  };

  const navigateToHome = () => {
    console.log('Navigating to HomePage');
    setCurrentPage('home');
  };

  const navigateToWelcome = () => {
    console.log('Navigating to WelcomePage');
    setCurrentPage('welcome');
  };

  const ProtectedProfileSetupPage = withAuthProtection(ProfileSetupPage, navigateToWelcome);
  const ProtectedHomePage = withAuthProtection(HomePage, navigateToWelcome);

  return (
    <div className="App">
      {currentPage === 'welcome' && <WelcomePage navigateToSignIn={navigateToSignIn} />}
      {currentPage === 'signIn' && <SignInPage navigateToProfileSetup={navigateToProfileSetup} />}
      {currentPage === 'profileSetup' && (
        <ProtectedProfileSetupPage navigateToHome={navigateToHome} />
      )}
      {currentPage === 'home' && <ProtectedHomePage navigateToWelcome={navigateToWelcome} />}
    </div>
  );
}

export default App;
