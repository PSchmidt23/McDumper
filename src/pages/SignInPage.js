import React, { useState } from 'react';
import { auth } from '../services/firebaseConfig';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const SignInPage = ({ navigateToWelcome }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setupRecaptcha = () => {
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
          'size': 'invisible',
          'callback': (response) => {
            console.log('Recaptcha resolved');
          }
        }, auth);

        // Render the recaptcha widget
        window.recaptchaVerifier.render().then((widgetId) => {
          console.log("Recaptcha rendered with widgetId:", widgetId);
        }).catch(err => {
          console.error("Error rendering Recaptcha:", err);
        });
      }
    } catch (err) {
      console.error("Error setting up Recaptcha:", err);
      setError("Recaptcha setup failed. Please try again.");
    }
  };

  const handleSignIn = () => {
    if (!phoneNumber) {
      setError('Please enter a valid phone number.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');

    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        setConfirmationResult(confirmationResult);
        setMessage('Verification code sent. Please check your phone.');
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error during sign-in:', error);
        setError('Failed to send verification code. Please try again.');
        setLoading(false);
      });
  };

  const verifyCode = () => {
    if (!verificationCode || !confirmationResult) {
      setError('Please enter the verification code.');
      return;
    }

    setLoading(true);
    setError('');
    confirmationResult.confirm(verificationCode)
      .then((result) => {
        console.log('User signed in successfully:', result.user);
        setMessage('User signed in successfully.');
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error verifying code:', error);
        setError('Invalid verification code. Please try again.');
        setLoading(false);
      });
  };

  return (
    <div>
      <h1>Sign In with Phone</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Enter phone number"
        disabled={loading}
      />
      <button onClick={handleSignIn} disabled={loading}>
        {loading ? 'Sending...' : 'Send Code'}
      </button>

      <div id="recaptcha-container"></div>

      {confirmationResult && (
        <>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
            disabled={loading}
          />
          <button onClick={verifyCode} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
        </>
      )}

      <button onClick={navigateToWelcome}>Back to Welcome</button>
    </div>
  );
};

export default SignInPage;
