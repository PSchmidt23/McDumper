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

  return (
    <div className="App">
      {currentPage === 'welcome' && (
        <WelcomePage navigateToSignIn={navigateToSignIn} navigateToSignUp={navigateToSignUp} />
      )}
      {currentPage === 'signIn' && <SignInPage />}
      {currentPage === 'signUp' && <SignUpPage />}
    </div>
  );
}

export default App;
