// src/components/PhoneAuth.js

import React, { useState, useContext, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '../styles/PhoneAuth.css';
import { AuthContext } from '../AuthContext';
import { toast } from 'react-toastify'; // Optional: For toast notifications

const PhoneAuth = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.isNewUser) {
        navigate('/profile-setup');
      } else {
        navigate('/profile');
      }
    }
  }, [currentUser, navigate]);

  const setUpRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response) => {
            console.log('reCAPTCHA solved');
          },
          'expired-callback': () => {
            console.warn('reCAPTCHA expired');
          },
        },
        auth
      );
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!phoneNumber) {
      toast.error('Please enter your phone number.');
      return;
    }

    setIsSendingOtp(true);
    setUpRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      console.log('Formatted phone number:', '+' + phoneNumber);
      const confirmation = await signInWithPhoneNumber(auth, '+' + phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      toast.success('OTP has been sent to your phone.');
    } catch (error) {
      console.error('Error during signInWithPhoneNumber', error.code, error.message);
      toast.error('Failed to send OTP. Please try again.');
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error('Please enter the OTP.');
      return;
    }
    setIsVerifyingOtp(true);
    try {
      await confirmationResult.confirm(otp);
      toast.success('Phone number verified successfully!');
      // Navigation is handled by useEffect based on currentUser
    } catch (error) {
      console.error('Error verifying OTP', error.code, error.message);
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="phone-auth-container">
      <h2>Sign In / Sign Up</h2>
      {!confirmationResult ? (
        <form onSubmit={handleSendOtp} className="auth-form">
          <PhoneInput
            country={'us'}
            value={phoneNumber}
            onChange={(phone) => setPhoneNumber(phone)}
            inputStyle={{ width: '100%' }}
            countryCodeEditable={false}
            placeholder="Enter phone number"
          />
          <button type="submit" disabled={isSendingOtp} className="auth-button">
            {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="auth-form">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="otp-input"
          />
          <button type="submit" disabled={isVerifyingOtp} className="auth-button">
            {isVerifyingOtp ? 'Verifying OTP...' : 'Verify OTP'}
          </button>
        </form>
      )}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default PhoneAuth;
