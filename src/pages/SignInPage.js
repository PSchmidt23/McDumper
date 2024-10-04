import React, { useState } from 'react';
import { auth } from '../services/firebaseConfig';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const SignInPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const setupRecaptcha = () => {
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
          'size': 'invisible',
        }, auth);
        window.recaptchaVerifier.render();
      }
    } catch (err) {
      console.error("Error setting up Recaptcha:", err);
      setError("Recaptcha setup failed. Please try again.");
    }
  };

  const handleSignIn = () => {
    if (phoneNumber.trim() === '') {
      setError('Please enter a valid phone number.');
      return;
    }

    setLoading(true);
    setError('');
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        setConfirmationResult(confirmationResult);
        setMessage('Code sent successfully!');
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error during sign-in:', error);
        setError('Failed to send code. Please try again.');
        setLoading(false);
      });
  };

  const verifyCode = () => {
    if (verificationCode.trim() === '') {
      setError('Please enter the verification code.');
      return;
    }

    setLoading(true);
    setError('');

    confirmationResult.confirm(verificationCode)
      .then((result) => {
        console.log('User signed in successfully!');
        setMessage('User signed in successfully!');
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error verifying code:', error);
        setError('Incorrect verification code. Please try again.');
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
        placeholder="Enter phone number with country code"
        disabled={loading}
      />
      <button id="sign-in-button" onClick={handleSignIn} disabled={loading}>
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
    </div>
  );
};

export default SignInPage;
