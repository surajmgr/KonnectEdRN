import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams, Route } from 'expo-router';
import { Text } from '@/components/ui/text';
import { EmailStep } from './steps/EmailStep';
import { PasswordStep } from './steps/PasswordStep';
import { OTPStep } from './steps/OTPStep';
import { SetPasswordStep } from './steps/SetPasswordStep';
import { Image } from 'react-native';
import { AnimatePresence, MotiView } from 'moti';
import { checkHasPassword } from '@/lib/api/server/auth';

type AuthStep = 'email' | 'password' | 'otp' | 'set-password';
type AuthMode = 'signin' | 'signup';

export default function LoginScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const mode = params.authMode === 'signup' ? 'signup' : 'signin';
  const callbackUrl = (params.callbackUrl as Route) || '/';

  const [email, setEmail] = useState('');
  const [authMode, setAuthMode] = useState<AuthMode>(mode);
  const [authStep, setAuthStep] = useState<AuthStep>('email');
  const [hasPassword, setHasPassword] = useState(false);
  const [useOTP, setUseOTP] = useState(false);

  const handleEmailContinue = async (emailValue: string) => {
    setEmail(emailValue);

    // if (authMode === 'signup') {
    //   setAuthStep('password');
    //   return;
    // }

    const userHasPassword = await checkHasPassword({
      input: {
        email: emailValue.trim(),
      },
    });
    setHasPassword(userHasPassword);

    if (userHasPassword && !useOTP) {
      setAuthStep('password');
    } else {
      setAuthStep('otp');
    }
  };

  const handleOTPSuccess = (promptSetPassword: boolean) => {
    if (promptSetPassword && !hasPassword) {
      setAuthStep('set-password');
    } else {
      router.replace(callbackUrl);
    }
  };

  const handleSetPasswordSuccess = () => {
    router.replace(callbackUrl);
  };

  const handleBackToEmail = () => {
    setAuthStep('email');
    setUseOTP(false);
  };

  const handleSwitchToOTP = () => {
    setUseOTP(true);
    setAuthStep('otp');
  };

  const getStepTitle = () => {
    switch (authStep) {
      case 'email':
        return authMode === 'signin' ? 'Welcome back' : 'Create account';
      case 'password':
        return authMode === 'signin' ? 'Enter your password' : 'Set your password';
      case 'otp':
        return 'Verify Your Account';
      case 'set-password':
        return 'Set your password';
    }
  };

  const getStepDescription = () => {
    switch (authStep) {
      case 'email':
        return authMode === 'signin'
          ? 'Sign in to your account to continue'
          : 'Sign up to get started';
      case 'password':
        return authMode === 'signin'
          ? `Enter password for ${email}`
          : 'Choose a secure password for your account';
      case 'otp':
        return email;
      case 'set-password':
        return 'Create a password for easier sign-in next time';
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black"
        contentContainerClassName="min-h-screen px-6 py-8 justify-center"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-md mx-auto">
          {/* Header */}
          <View className="items-center mb-10">
            <View className="w-20 h-20 rounded-3xl items-center justify-center mb-6 bg-white shadow-lg dark:bg-gray-800 dark:shadow-gray-900">
              <Image
                source={require('@/assets/images/icon.png')}
                style={{ width: 56, height: 56 }}
                resizeMode="contain"
              />
            </View>
            <Text className="w-full text-4xl font-bold text-gray-900 mb-3 text-center dark:text-white">
              {getStepTitle()}
            </Text>
            <Text className="w-full text-base text-gray-600 text-center px-4 dark:text-gray-300">
              {getStepDescription()}
            </Text>
          </View>

          {/* Main Card */}
          <View className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 dark:bg-gray-900 dark:border-gray-800 dark:shadow-gray-950">
            <AnimatePresence exitBeforeEnter>
              {authStep === 'email' && (
                <MotiView
                  key="email-step"
                  from={{ opacity: 0, translateX: 20 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  exit={{ opacity: 0, translateX: -20 }}
                  transition={{ type: 'timing', duration: 200 }}
                >
                  <EmailStep
                    authMode={authMode}
                    callbackUrl={callbackUrl}
                    onEmailContinue={handleEmailContinue}
                    onSwitchMode={() =>
                      setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
                    }
                  />
                </MotiView>
              )}

              {authStep === 'password' && (
                <MotiView
                  key="password-step"
                  from={{ opacity: 0, translateX: 20 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  exit={{ opacity: 0, translateX: -20 }}
                  transition={{ type: 'timing', duration: 200 }}
                >
                  <PasswordStep
                    email={email}
                    authMode={authMode}
                    callbackUrl={callbackUrl}
                    onBack={handleBackToEmail}
                    onSwitchToOTP={
                      hasPassword && authMode === 'signin' ? handleSwitchToOTP : undefined
                    }
                  />
                </MotiView>
              )}

              {authStep === 'otp' && (
                <MotiView
                  key="otp-step"
                  from={{ opacity: 0, translateX: 20 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  exit={{ opacity: 0, translateX: -20 }}
                  transition={{ type: 'timing', duration: 200 }}
                >
                  <OTPStep
                    email={email}
                    callbackUrl={callbackUrl}
                    onBack={handleBackToEmail}
                    onSuccess={handleOTPSuccess}
                  />
                </MotiView>
              )}

              {authStep === 'set-password' && (
                <MotiView
                  key="set-password-step"
                  from={{ opacity: 0, translateX: 20 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  exit={{ opacity: 0, translateX: -20 }}
                  transition={{ type: 'timing', duration: 200 }}
                >
                  <SetPasswordStep
                    onSuccess={handleSetPasswordSuccess}
                    onSkip={() => router.replace(callbackUrl)}
                  />
                </MotiView>
              )}
            </AnimatePresence>
          </View>

          {/* Footer */}
          {authStep === 'email' && (
            <View className="items-center mt-8">
              <View className="flex-row items-center flex-wrap justify-center px-4">
                <Text className="text-base text-gray-600 dark:text-gray-400">
                  {authMode === 'signin'
                    ? "Don't have an account? "
                    : 'Already have an account? '}
                </Text>
                <Text
                  className="text-base text-blue-600 font-semibold dark:text-blue-400"
                  onPress={() =>
                    setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
                  }
                >
                  {authMode === 'signin' ? 'Sign up' : 'Sign in'}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>

  );
}
