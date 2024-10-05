import React, { useEffect } from 'react';
import { firebase } from '../services/firebaseConfig';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

const SignInPage = ({ navigateToProfileSetup }) => {
  useEffect(() => {
    const uiConfig = {
      signInOptions: [
        {
          provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
          defaultCountry: 'US',
          whitelistedCountries: ['US', '+1'],
        },
      ],
      callbacks: {
        signInSuccessWithAuthResult: (authResult) => {
          console.log('User signed in successfully:', authResult.user);
          navigateToProfileSetup();
          return false;
        },
      },
    };

    const ui =
      firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());

    ui.start('#firebaseui-auth-container', uiConfig);

    return () => {
      ui.reset();
    };
  }, [navigateToProfileSetup]);

  return (
    <div>
      <h1>Sign Up / Sign In with Phone Number</h1>
      <div id="firebaseui-auth-container"></div>
    </div>
  );
};

export default SignInPage;
