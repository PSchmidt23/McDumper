import React, { useState } from 'react';
import WelcomePage from './pages/WelcomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  const [currentPage, setCurrentPage] = useState('welcome');

  const navigateToSignIn = () => {
    setCurrentPage('signIn');
  };

  const navigateToSignUp = () => {
    setCurrentPage('signUp');
  };

  const navigateToWelcome = () => {
    setCurrentPage('welcome');
  };

  return (
    <div className="App">
      {currentPage === 'welcome' && (
        <WelcomePage 
          navigateToSignIn={navigateToSignIn} 
          navigateToSignUp={navigateToSignUp} 
        />
      )}
      {currentPage === 'signIn' && (
        <SignInPage navigateToWelcome={navigateToWelcome} />
      )}
      {currentPage === 'signUp' && (
        <SignUpPage navigateToWelcome={navigateToWelcome} />
      )}
    </div>
  );
}

export default App;
