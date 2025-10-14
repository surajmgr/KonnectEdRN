import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { ArrowLeft } from 'lucide-react-native';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { signInWithPassword, signUpWithPassword } from '@/lib/auth/authHandlers';
import { Route, useRouter } from 'expo-router';
import { getErrorMessage } from '@/lib/utils/error';
import { passwordSchema, signUpPasswordSchema } from '@/lib/schema/auth';
import { toast } from '@backpackapp-io/react-native-toast';

interface PasswordStepProps {
  email: string;
  authMode: 'signin' | 'signup';
  callbackUrl: Route;
  onBack: () => void;
  onSwitchToOTP?: () => void;
}

export const PasswordStep = ({
  email,
  authMode,
  callbackUrl,
  onBack,
  onSwitchToOTP,
}: PasswordStepProps) => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    if (authMode === 'signup') {
      const validation = signUpPasswordSchema.safeParse({ password, confirmPassword });
      if (!validation.success) {
        setError(validation.error.errors[0].message);
        return;
      }
    } else {
      const validation = passwordSchema.safeParse({ password });
      if (!validation.success) {
        setError(validation.error.errors[0].message);
        return;
      }
    }

    setIsLoading(true);

    try {
      if (authMode === 'signup') {
        await signUpWithPassword({ email, password, callbackUrl });
        toast.success('Account created successfully!');
      } else {
        await signInWithPassword({ email, password, callbackUrl });
        toast.success('Welcome back!');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        `Failed to ${authMode === 'signup' ? 'sign up' : 'sign in'}. Please check your credentials.`
      );
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="gap-6">
      <Button
        variant="ghost"
        onPress={onBack}
        disabled={isLoading}
        className="self-start -ml-2"
      >
        <View className="flex-row items-center gap-2">
          <ArrowLeft size={18} />
          <Text className="text-base">Back</Text>
        </View>
      </Button>

      {error && (
        <View className="bg-red-50 border border-red-200 p-4 rounded-xl">
          <Text className="text-red-800 text-sm font-medium">{error}</Text>
        </View>
      )}

      <View className="gap-5">
        <PasswordInput
          label="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError('');
          }}
          placeholder="Enter your password"
          editable={!isLoading}
        />

        {authMode === 'signup' && (
          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setError('');
            }}
            placeholder="Confirm your password"
            editable={!isLoading}
          />
        )}

        <Button onPress={handleSubmit} disabled={isLoading} className="h-14 mt-2">
          {isLoading ? (
            <View className="flex-row items-center gap-2">
              <ActivityIndicator size="small" color="white" />
              <Text className="text-white font-semibold">
                {authMode === 'signup' ? 'Creating account...' : 'Signing in...'}
              </Text>
            </View>
          ) : (
            <Text className="text-white font-semibold text-base">
              {authMode === 'signup' ? 'Create account' : 'Sign in'}
            </Text>
          )}
        </Button>

        {onSwitchToOTP && (
          <Button variant="ghost" onPress={onSwitchToOTP} disabled={isLoading}>
            <Text className="text-base">Use verification code instead</Text>
          </Button>
        )}

        {authMode === 'signin' && (
          <View className="items-center mt-2">
            <Text
              className="text-sm text-blue-600 font-medium"
              onPress={() => router.push('/forgot-password' as Route)}
            >
              Forgot password?
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
