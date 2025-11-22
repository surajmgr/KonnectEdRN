import { authClient } from './authClient';
import { Route, router } from 'expo-router';
import { getErrorMessage } from '../utils/error';
import { toast } from '@backpackapp-io/react-native-toast';

const handleError = (error: unknown, defaultMessage: string) => {
  const message = getErrorMessage(error, defaultMessage);
  toast.error(message);
  throw error;
};

export const signInWithPassword = async (args: {
  email: string;
  password: string;
  callbackUrl?: Route;
}) => {
  try {
    const { email, password, callbackUrl = '/' } = args;
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) throw error;

    if (data) {
      router.replace(callbackUrl);
    }

    return data;
  } catch (error) {
    handleError(error, 'Failed to sign in. Please check your credentials.');
  }
};

// Sign up with password
export const signUpWithPassword = async (args: {
  email: string;
  password: string;
  name?: string;
  callbackUrl?: Route;
}) => {
  try {
    const { email, password, name, callbackUrl = '/' } = args;
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name: name || email.split('@')[0],
    });

    if (error) throw error;

    if (data) {
      router.replace(callbackUrl);
    }

    return data;
  } catch (error) {
    handleError(error, 'Failed to sign up. Please try again.');
  }
};

// Send Verification OTP
export const sendVerificationOTP = async (args: {
  email: string;
  type: 'sign-in' | 'email-verification' | 'forget-password';
  turnstileToken: string;
}) => {
  try {
    const { email, type, turnstileToken } = args;
    const { data, error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type,
      fetchOptions: {
        headers: {
          "x-captcha-response": turnstileToken
        }
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    handleError(error, 'Failed to send verification code.');
  }
};

// Sign In with Email OTP
export const signInWithEmailOTP = async (args: {
  email: string;
  otp: string;
  callbackUrl?: Route;
  turnstileToken: string;
}) => {
  try {
    const { email, otp, turnstileToken } = args;
    const { data, error } = await authClient.signIn.emailOtp({
      email,
      otp,
      fetchOptions: {
        headers: {
          "x-captcha-response": turnstileToken
        }
      }
    });

    if (error) throw error;

    return data;
  } catch (error) {
    handleError(error, 'Invalid verification code.');
  }
};

// Google Sign In
export const handleGoogleSignIn = async (args: { callbackUrl?: Route }) => {
  try {
    const { callbackUrl = '/' } = args;
    const { data, error } = await authClient.signIn.social({
      provider: 'google',
      callbackURL: callbackUrl,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    handleError(error, 'Failed to sign in with Google.');
  }
};

// Passkey Sign In
export const handlePassKeySignIn = async (args: { callbackUrl?: Route }) => {
  try {
    const { callbackUrl = '/' } = args;
    const { data, error } = await authClient.signIn.passkey();

    if (error) throw error;

    if (data) {
      router.replace(callbackUrl);
    }

    return data;
  } catch (error) {
    handleError(error, 'Failed to sign in with Passkey.');
  }
};

// Passkey Register
export const handlePassKeyRegister = async () => {
  console.log("Adding Passkey...");
  const notifToast = toast.loading("Adding Passkey...");
  const result = await authClient.passkey.addPasskey({
    fetchOptions: {
      onSuccess: () => {
        toast.success("Passkey added", {
          id: notifToast,
        });
      },
      onError: () => {
        toast.error("Failed to add Passkey", {
          id: notifToast,
        });
      },
    },
  });

  if (!result) {
    return null;
  }

  const { data, error } = result;

  if (error) {
    throw error;
  }

  return data;
}


// Anonymous Sign In
export const handleAnonymousSignIn = async (args: { callbackUrl?: Route }) => {
  try {
    const { callbackUrl = '/' } = args;
    const { data, error } = await authClient.signIn.anonymous();

    if (error) throw error;

    if (data) {
      router.replace(callbackUrl);
    }

    return data;
  } catch (error) {
    handleError(error, 'Failed to sign in anonymously.');
  }
};
