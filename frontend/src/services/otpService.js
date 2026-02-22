// OTP Service - Firebase Phone Authentication
import { signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { getFirebaseAuth, setupRecaptcha, isFirebaseConfigured } from '../lib/firebase';

// Store confirmation result for verification
let confirmationResult = null;

/**
 * Check if real OTP service is available
 */
export const isOTPServiceAvailable = () => {
  return isFirebaseConfigured();
};

/**
 * Send OTP to phone number using Firebase
 * @param {string} phoneNumber - Phone number with country code (e.g., +919876543210)
 * @param {string} recaptchaContainerId - ID of the container for reCAPTCHA
 * @returns {Promise<{success: boolean, message: string, isMock?: boolean}>}
 */
export const sendOTP = async (phoneNumber, recaptchaContainerId = 'recaptcha-container') => {
  // Check if Firebase is configured
  if (!isFirebaseConfigured()) {
    console.log('Firebase not configured - using mock OTP');
    return {
      success: true,
      message: 'OTP sent (MOCK MODE - use 123456)',
      isMock: true,
    };
  }

  try {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }

    // Setup reCAPTCHA
    const recaptchaVerifier = setupRecaptcha(recaptchaContainerId);
    if (!recaptchaVerifier) {
      throw new Error('Failed to setup reCAPTCHA');
    }

    // Send OTP
    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    
    return {
      success: true,
      message: 'OTP sent successfully',
      isMock: false,
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    
    // Handle specific Firebase errors
    let errorMessage = 'Failed to send OTP';
    
    switch (error.code) {
      case 'auth/invalid-phone-number':
        errorMessage = 'Invalid phone number format. Use format: +919876543210';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many attempts. Please try again later';
        break;
      case 'auth/quota-exceeded':
        errorMessage = 'SMS quota exceeded. Please try again later';
        break;
      case 'auth/captcha-check-failed':
        errorMessage = 'reCAPTCHA verification failed. Please try again';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your internet connection and ensure this domain is authorized in Firebase Console.';
        break;
      case 'auth/internal-error':
        errorMessage = 'Firebase configuration error. Please contact support.';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Phone authentication is not enabled. Please enable it in Firebase Console.';
        break;
      case 'auth/app-not-authorized':
        errorMessage = 'This app is not authorized to use Firebase. Please add this domain to Firebase authorized domains.';
        break;
      default:
        errorMessage = error.message || 'Failed to send OTP';
    }
    
    return {
      success: false,
      message: errorMessage,
      isMock: false,
    };
  }
};

/**
 * Verify OTP code
 * @param {string} otpCode - 6-digit OTP code entered by user
 * @returns {Promise<{success: boolean, message: string, user?: object, idToken?: string}>}
 */
export const verifyOTP = async (otpCode) => {
  // Check if Firebase is configured (mock mode)
  if (!isFirebaseConfigured()) {
    // Mock verification - accept any 6-digit code, recommend 123456
    if (otpCode && otpCode.length === 6) {
      return {
        success: true,
        message: 'OTP verified (MOCK MODE)',
        isMock: true,
        user: null,
        idToken: null,
      };
    }
    return {
      success: false,
      message: 'Invalid OTP code',
      isMock: true,
    };
  }

  try {
    if (!confirmationResult) {
      throw new Error('No OTP request found. Please request OTP first.');
    }

    // Verify the OTP
    const result = await confirmationResult.confirm(otpCode);
    const user = result.user;
    
    // Get the ID token for backend verification
    const idToken = await user.getIdToken();
    
    return {
      success: true,
      message: 'OTP verified successfully',
      isMock: false,
      user: {
        uid: user.uid,
        phoneNumber: user.phoneNumber,
        displayName: user.displayName,
      },
      idToken,
    };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    
    let errorMessage = 'Failed to verify OTP';
    
    switch (error.code) {
      case 'auth/invalid-verification-code':
        errorMessage = 'Invalid OTP code';
        break;
      case 'auth/code-expired':
        errorMessage = 'OTP has expired. Please request a new one';
        break;
      default:
        errorMessage = error.message || 'Failed to verify OTP';
    }
    
    return {
      success: false,
      message: errorMessage,
      isMock: false,
    };
  }
};

/**
 * Resend OTP (request new OTP)
 * @param {string} phoneNumber - Phone number with country code
 * @param {string} recaptchaContainerId - ID of the container for reCAPTCHA
 */
export const resendOTP = async (phoneNumber, recaptchaContainerId = 'recaptcha-container') => {
  // Reset confirmation result
  confirmationResult = null;
  
  // Clear existing reCAPTCHA
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch (e) {
      console.log('Error clearing recaptcha:', e);
    }
    window.recaptchaVerifier = null;
  }
  
  // Send new OTP
  return sendOTP(phoneNumber, recaptchaContainerId);
};

const OTPService = {
  isOTPServiceAvailable,
  sendOTP,
  verifyOTP,
  resendOTP,
};

export default OTPService;
