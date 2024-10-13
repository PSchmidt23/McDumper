// src/components/SignInPage.js

import React, { useEffect } from 'react';
import { auth } from '../services/firebaseConfig'; // Correct import
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { useNavigate } from 'react-router-dom';
import './SignInPage.css';


const SignInPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // FirebaseUI configuration
    const uiConfig = {
      signInOptions: [
        {
          provider: 'phone',
          defaultCountry: 'US', // Adjust as needed
        },
      ],
      callbacks: {
        signInSuccessWithAuthResult: (authResult) => {
          console.log('User signed in successfully:', authResult.user);
          // Navigate to profile setup or dashboard
          navigate('/profile-setup');
          return false; // Prevent automatic redirect
        },
        signInFailure: (error) => {
          console.error('Sign-in failed:', error);
        },
      },
    };

    // Initialize the FirebaseUI Widget using Firebase
    const ui =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(auth);

    ui.start('#firebaseui-auth-container', uiConfig);

    return () => {
      ui.reset();
    };
  }, [navigate]);

  return (
    <div className="signin-container">
      <h1>Sign In</h1>
      <div id="firebaseui-auth-container"></div>
    </div>
  );
};

export default SignInPage;
