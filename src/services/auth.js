import { auth } from './firebaseConfig'; // Importing the firebase auth instance
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export const setupRecaptcha = () => {
  try {
    // Ensure Recaptcha is initialized only once
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          console.log("Recaptcha solved");
        }
      }, auth);
    }
  } catch (error) {
    console.error("Error setting up Recaptcha:", error);
  }
};

export const sendVerificationCode = (phoneNumber) => {
  return new Promise((resolve, reject) => {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        resolve(confirmationResult);
      })
      .catch((error) => {
        console.error("Error during sign-up:", error);
        reject(error);
      });
  });
};

export const verifyCode = (confirmationResult, verificationCode) => {
  return confirmationResult.confirm(verificationCode)
    .then((result) => {
      return result.user; // User successfully signed in
    })
    .catch((error) => {
      console.error("Error verifying code:", error);
      throw error;
    });
};
