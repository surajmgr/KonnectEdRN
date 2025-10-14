import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { setPassword } from '@/lib/api/server/auth';
import { getErrorMessage } from '@/lib/utils/error';
import { signUpPasswordSchema } from '@/lib/schema/auth';
import { toast } from '@backpackapp-io/react-native-toast';

interface SetPasswordStepProps {
  onSuccess: () => void;
  onSkip: () => void;
}

export const SetPasswordStep = ({ onSuccess, onSkip }: SetPasswordStepProps) => {
  const [password, setPasswordValue] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    const validation = signUpPasswordSchema.safeParse({ password, confirmPassword });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    try {
      await setPassword({ input: { newPassword: password } });
      toast.success('Password set successfully!');
      onSuccess();
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to set password. Please try again.');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="gap-6">
      {error && (
        <View className="bg-red-50 border border-red-200 p-4 rounded-xl">
          <Text className="text-red-800 text-sm font-medium">{error}</Text>
        </View>
      )}

      <View className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
        <Text className="text-sm text-blue-800 leading-6">
          Setting a password will make it easier to sign in next time. You can skip this step and
          continue using email verification codes.
        </Text>
      </View>

      <View className="gap-5">
        <PasswordInput
          label="Password"
          value={password}
          onChangeText={(text) => {
            setPasswordValue(text);
            setError('');
          }}
          placeholder="Enter your password"
          editable={!isLoading}
        />
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

        <View className="gap-3 mt-2">
          <Button onPress={handleSubmit} disabled={isLoading} className="h-14">
            {isLoading ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white font-semibold">Setting password...</Text>
              </View>
            ) : (
              <Text className="text-white font-semibold text-base">Set password</Text>
            )}
          </Button>

          <Button variant="ghost" onPress={onSkip} disabled={isLoading}>
            <Text className="text-base">Skip for now</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};
